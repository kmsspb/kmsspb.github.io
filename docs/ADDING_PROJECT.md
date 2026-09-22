# Adding a Project

This portfolio intentionally has no build system, content management system, or runtime dependency. A new project is published by copying two reviewed HTML templates: one full case-study page and one homepage card.

The source templates live outside `site/`, so GitHub Pages does not publish them. Placeholder tokens may remain in `templates/`; they must never remain in `site/`.

## 1. Choose the slug and chronology number

- Use a short lowercase, kebab-case slug, such as `document-intelligence`.
- Assign the next stable chronological label, such as `Project 03`.
- Do not renumber older projects when the homepage display order changes. Homepage order is editorial and may differ from chronology.

## 2. Create the case-study page

Copy the case-study template to the published projects directory and rename it with the slug.

PowerShell:

```powershell
Copy-Item templates/project-case-study.html site/projects/document-intelligence.html
```

Bash:

```bash
cp templates/project-case-study.html site/projects/document-intelligence.html
```

Replace every `{{UPPERCASE_PLACEHOLDER}}` in the copied file. In particular, give the page its own:

- title and meta description;
- canonical URL;
- Open Graph title, description, URL, and image;
- Twitter title, description, and image;
- project title, summary, role, scope, technologies, and status;
- complete case-study content.

The case study must cover overview, problem, role, scope, architecture, decisions, iterations, validation, outcome, lessons, and next steps. Keep headings in that order unless the story clearly requires a different structure.

Include a concise, accurate AI implementation disclosure when AI tools contributed to implementation. Remove the disclosure block if it does not apply. Never imply that generated code was manually authored or independently validated when it was not.

External product or repository links are optional. Add them only after verifying that the destination is public and appropriate to share. If an optional link is unavailable, remove its entire prepared block. Every link that opens a new tab must include `rel="noopener noreferrer"`.

## 3. Add reviewed images

Future project images use this convention:

```text
site/assets/images/projects/<slug>/cover.webp
site/assets/images/projects/<slug>/01-overview.webp
site/assets/images/projects/<slug>/02-architecture.webp
site/assets/images/og-<slug>.png
```

- The homepage and case-study cover is recommended at 1600 × 900 pixels in WebP format.
- Supporting images use numbered, descriptive filenames under the same project directory.
- The social preview must be exactly 1200 × 630 pixels.
- Every displayed image needs useful alt text plus explicit `width` and `height` attributes.
- Delete an optional `<figure>` entirely when there is no reviewed asset. Do not publish a broken URL or a fake product screenshot.

Before adding an image, inspect it for personal data, credentials, tokens, private URLs, customer or employer information, browser session details, and other confidential material. Sanitize or omit anything sensitive.

## 4. Add the homepage card

Open `site/index.html` and find the comments that begin and end the project-card region. Copy the complete contents of `templates/project-card.html` into that region, then replace every placeholder.

Each card must include:

- its stable `Project NN` chronology label;
- project status and motivation;
- architectural focus;
- role and technologies;
- a link to `projects/<slug>.html`;
- only those external links that have been verified.

The homepage display order is manual. Put the card where it best supports the portfolio story without changing its chronology label. Delete the optional cover or external-link block when it is not used.

## 5. Preview locally

From the repository root, run:

```bash
python -m http.server 8000 --directory site
```

Review the homepage and the new page at:

- `http://localhost:8000/`
- `http://localhost:8000/projects/<slug>.html`

Test both pages at approximately 375, 768, and 1440 pixels wide. Confirm there is no horizontal overflow and that content remains readable without zooming.

## 6. Validate before publishing

Run these repository checks:

```bash
rg -n '\{\{[A-Z0-9_]+\}\}' site
git diff --check
git status
```

The placeholder search must return no results. Placeholders in `templates/` are expected because those files are not deployed.

Complete this review checklist:

- [ ] Page title, description, canonical URL, Open Graph metadata, and Twitter metadata are unique and accurate.
- [ ] Project slug, page filename, canonical URL, social URL, and homepage link agree.
- [ ] All IDs are unique and every internal link and fragment resolves.
- [ ] Every stylesheet and displayed image loads successfully.
- [ ] Every new-tab link includes `noopener noreferrer`.
- [ ] Heading levels form a logical hierarchy.
- [ ] Keyboard focus is visible and all controls can be reached without a pointer.
- [ ] Images have descriptive alt text and explicit dimensions.
- [ ] The layout works at 375, 768, and 1440 pixels with no horizontal overflow.
- [ ] Reduced-motion preferences are respected.
- [ ] No personal, credential, customer, employer-confidential, or otherwise private material is present.
- [ ] `git diff --check` reports no whitespace errors.
- [ ] `.github/workflows/pages.yml` still publishes only `site/`.

## 7. Publish through the normal workflow

Commit the project on a feature branch, push it, and open a pull request into `main`. Review the rendered change and the complete diff before merging. The existing GitHub Actions workflow deploys `site/` after the merge; no build command or dependency installation is required.

