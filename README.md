# Maksim Kozliakov — public portfolio website

**PUBLIC REPOSITORY. Every committed file, including previous commits, is visible to others.**

This package contains only website code and public project case studies. Personal interview guides, event scripts, Codex dossiers, and sensitive notes belong in a **different private repository**. Never upload the companion private ZIP here.

## Setup
1. On GitHub create a **public** repository named `<username>.github.io` (use `kmsspb.github.io` only if your GitHub account is `kmsspb`). Do not initialize it with files.
2. Unzip **this public package**. From inside its root run:

```bash
git init
git add README.md .gitignore .github site
git diff --cached --name-only  # inspect all files about to be public
git commit -m "Publish AI Architect portfolio starter"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

3. In repository Settings → Pages → Build and deployment set Source to **GitHub Actions**.
4. Check Actions → Deploy portfolio to GitHub Pages; open `https://<username>.github.io/`.

The workflow publishes only `site/` as Pages artifacts, **but the entire repository is public**. Not deploying a file does not make the committed file private. `.gitignore` is an extra guard, not an access control.

## Site content
- `site/index.html`: homepage
- `site/projects/wordy.html`: Wordy case study grounded in reviewed, publication-safe project facts
- `site/projects/boomarena.html`: BoomArena case study grounded in reviewed, publication-safe project facts
- `site/assets/style.css`: responsive design
- `.github/workflows/pages.yml`: publish `site/` on pushes to `main`

Wordy is a private family application. Do not publish a direct app URL, account access, learner names, real word decks, session cookies, security configurations or private repo links unless you have deliberately reviewed what that reveals. A sanitized screenshot can demonstrate the product instead.

Before every push: `git status`, `git diff --cached --name-only`, and review the staged files. Never commit secrets even to the private notes repo. If sensitive information was already pushed, deleting it in a later commit is not enough; consult GitHub's sensitive-data-removal guidance.
