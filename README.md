# Maksim Kozliakov — AI Architecture Portfolio

Public professional portfolio for Maksim Kozliakov, an intelligent automation specialist with a growing focus on AI Architecture, solution design, product thinking, and AI-assisted delivery.

Live website: [https://kmsspb.github.io/](https://kmsspb.github.io/)

## Featured projects

- **Wordy** — a private family vocabulary-learning application and case study in shared content, learner-specific progress, data modeling, and evolving deployment architecture.
- **BoomArena** — a public real-time multiplayer browser game and case study in deterministic simulation, server authority, WebSockets, and Cloudflare Durable Objects.

These are independent architecture projects. The case studies distinguish product ownership and architectural direction from implementation generated and modified by AI coding agents.

## Technical implementation

- Static semantic HTML and CSS.
- No frontend framework or build step.
- Responsive layouts and accessible HTML/CSS architecture diagrams.
- GitHub Pages hosting.
- GitHub Actions deployment from `site/`.
- Typographic Open Graph preview cards in PNG format, with reproducible SVG sources.

## Repository structure

- `site/index.html` — homepage.
- `site/projects/wordy.html` — Wordy architecture case study.
- `site/projects/boomarena.html` — BoomArena architecture case study.
- `site/assets/style.css` — shared responsive design system.
- `site/assets/images/` — social preview assets and future sanitized product screenshots.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.

## Local preview

No installation is required. From the repository root, run any local static server, for example:

```bash
python -m http.server 8000 --directory site
```

Then open [http://localhost:8000/](http://localhost:8000/).

Opening the HTML files directly also works for basic review, but a local server provides behavior closer to GitHub Pages.

## Product screenshots still needed

The site includes responsive `.project-media` and `.case-media` containers, but does not request nonexistent image files or show fake placeholders. Add only reviewed, real screenshots.

### BoomArena

- Expected file: `site/assets/images/boomarena-gameplay.webp`
- Recommended size: 1600 × 900 pixels, WebP.
- Content: an active multiplayer match showing the arena, players, bombs, and explosions.
- Remove or obscure private room codes, tokens, browser chrome, and session information.
- Suggested alt text: `BoomArena multiplayer match with players, bombs, and explosions in the arena.`

### Wordy

- Expected file: `site/assets/images/wordy-learning.webp`
- Recommended size: 1600 × 900 pixels, WebP.
- Content: a sanitized deck library, flashcard interface, or progress dashboard.
- Remove children's names, real vocabulary records, private URLs, access information, and browser session details.
- Suggested alt text: `Sanitized Wordy vocabulary learning interface with no personal learner data.`

The homepage and case-study pages contain inert `<template>` blocks with the prepared `.project-media` and `.case-media` markup. Images inside templates are not requested or displayed. Once reviewed assets are available, place them in the image directory and move each prepared `<figure>` out of its template at the same location. Until then, the text-only cards remain the intentional published design.

## Social previews

The deployed Open Graph images are 1200 × 630 pixel typographic cards:

- `site/assets/images/og-home.png`
- `site/assets/images/og-wordy.png`
- `site/assets/images/og-boomarena.png`

The Wordy and BoomArena cards intentionally use typography rather than fabricated product imagery. A reviewed real screenshot can replace the visual treatment later without changing the metadata URLs.

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`. The workflow checks out the repository, configures GitHub Pages, uploads `site/`, and deploys it as the Pages artifact.

For first-time repository configuration, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow requires the existing `contents: read`, `pages: write`, and `id-token: write` permissions.

Before publishing changes:

```bash
git status
git diff --check
git diff --cached --name-only
```

Review every staged file because the complete repository history is public, even though only `site/` is deployed.

## Privacy notice

Only public portfolio content belongs in this repository. Personal interview preparation, event or summit talking points, private AI-assistant conversations, internal project dossiers, family learning records, credentials, and employer-confidential information must remain outside this repository.

Wordy is a private family application. Do not publish its live URL, repository, account access, learner names, real learning records, session information, or security configuration.
