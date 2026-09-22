import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(process.cwd(), 'site');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const candidate = normalize(join(root, relative));
    if (!candidate.startsWith(root)) throw new Error('Path outside site');
    const body = await readFile(candidate);
    response.writeHead(200, { 'content-type': types[extname(candidate)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const profile = await mkdtemp(join(tmpdir(), 'portfolio-edge-'));
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });

let stderr = '';
const browserWebSocket = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`Edge debugging endpoint timeout: ${stderr}`)), 15000);
  edge.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  edge.once('exit', (code) => reject(new Error(`Edge exited early with ${code}: ${stderr}`)));
});

const socket = new WebSocket(browserWebSocket);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const listeners = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error) task.reject(new Error(message.error.message));
    else task.resolve(message.result);
    return;
  }
  const key = `${message.sessionId || ''}:${message.method}`;
  const queue = listeners.get(key);
  if (queue?.length) queue.shift()(message.params);
});

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

function once(method, sessionId) {
  const key = `${sessionId || ''}:${method}`;
  return new Promise((resolve) => {
    const queue = listeners.get(key) || [];
    queue.push(resolve);
    listeners.set(key, queue);
  });
}

const pages = ['/', '/projects/wordy.html', '/projects/boomarena.html'];
const widths = [375, 768, 1440];
const failures = [];

try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);

  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false }, sessionId);
    for (const page of pages) {
      const loaded = once('Page.loadEventFired', sessionId);
      await send('Page.navigate', { url: `http://127.0.0.1:${port}${page}` }, sessionId);
      await loaded;
      const { result } = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          h1Count: document.querySelectorAll('h1').length
        })`,
        returnByValue: true
      }, sessionId);
      const data = result.value;
      const overflow = data.scrollWidth > data.clientWidth;
      console.log(`${width}px ${page} client=${data.clientWidth} scroll=${data.scrollWidth} h1=${data.h1Count} ${overflow ? 'OVERFLOW' : 'OK'}`);
      if (overflow) failures.push(`${page} overflows at ${width}px`);
      if (data.h1Count !== 1) failures.push(`${page} has ${data.h1Count} h1 elements`);
    }
  }

  const loaded = once('Page.loadEventFired', sessionId);
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/` }, sessionId);
  await loaded;
  await send('Runtime.evaluate', { expression: 'document.body.focus()' }, sessionId);
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, sessionId);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, sessionId);
  const focus = await send('Runtime.evaluate', {
    expression: `({ tag: document.activeElement.tagName, href: document.activeElement.getAttribute('href'), outline: getComputedStyle(document.activeElement).outlineStyle })`,
    returnByValue: true
  }, sessionId);
  console.log(`Keyboard first focus: ${JSON.stringify(focus.result.value)}`);
  if (focus.result.value.href !== '#content') failures.push('Skip link is not the first keyboard focus target');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
  const motion = await send('Runtime.evaluate', {
    expression: `({ scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, transitionDuration: getComputedStyle(document.querySelector('.button')).transitionDuration })`,
    returnByValue: true
  }, sessionId);
  console.log(`Reduced motion: ${JSON.stringify(motion.result.value)}`);
  if (motion.result.value.scrollBehavior !== 'auto') failures.push('Reduced-motion scroll behavior is not auto');

  if (failures.length) throw new Error(failures.join('; '));
} finally {
  socket.close();
  edge.kill();
  server.close();
  await rm(profile, { recursive: true, force: true });
}

console.log('Responsive, keyboard-focus, heading-count, and reduced-motion browser checks passed.');
