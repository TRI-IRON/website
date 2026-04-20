# Tri-Iron website

Static marketing site for [Tri-Iron](https://tri-iron.co.uk) — three-founder engineering & design studio, Cheltenham, UK.

## What's in here

```
index.html        The whole page
assets/
  home.css        Styles
  logo.png        Logo / favicon
  split-sphere.js Hero sphere (React via CDN)
  hitl-widget.js  Human-in-the-loop demo (React via CDN)
  word-reveal.js  Hero word-reveal helper (not currently used)
deploy.sh         One-shot deploy to Cloudflare Pages (fallback)
```

No build step. Plain HTML, CSS, and vanilla JS. React is loaded from the unpkg CDN (production builds) only for the two interactive widgets. JSX was pre-compiled to `React.createElement` calls so we don't ship Babel.

## Run locally

Any static file server works:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser (some features may require a server for font-loading quirks — use the Python one-liner if anything looks off).

## Deploy

### Auto-deploy on push (Cloudflare Pages ↔ GitHub)

Once the Pages → GitHub connection is set up (see below), every `git push` to `main` triggers a build + deploy automatically, usually live within ~30 seconds.

**One-time setup:**

1. Open the project's build settings:
   <https://dash.cloudflare.com/0fb02bd98a655dc7d81294f60983cb1c/pages/view/website/settings/builds-deployments>
2. In the **Source** / **Git** section, click **Connect to Git**.
3. Pick **GitHub** and authorise the Cloudflare GitHub App for the `TRI-IRON` organisation (pick **Only select repositories**, tick `website`).
4. Select:
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: *(blank — serves repo root)*
5. **Save**. Cloudflare runs the first deployment immediately; subsequent pushes auto-deploy.

### Manual deploy (fallback / force redeploy)

If you ever need to push a deploy without going through Git — e.g. a hotfix mid-review, or to bypass a stuck build — use the included script:

```bash
./deploy.sh
```

It stages `index.html` + `assets/` into a `_dist/` folder and uploads via `wrangler pages deploy`. Requires `wrangler` installed (`npm i -g wrangler`) and a one-off `wrangler login`.

## Hosting

- **Hosting:** Cloudflare Pages, project `website` (account: `notbensheriff@gmail.com`).
- **Pages URL:** <https://website-bax.pages.dev>
- **Custom domain:** `tri-iron.co.uk` — attach via <https://dash.cloudflare.com/0fb02bd98a655dc7d81294f60983cb1c/pages/view/website/domains>

## Making changes

Edit `index.html` or `assets/home.css` directly. The two React widgets live in `assets/split-sphere.js` and `assets/hitl-widget.js` — they use `React.createElement` directly, no JSX, so no build required. If you want to rewrite with JSX, add a bundler (Vite is a sensible pick) and update `deploy.sh` to run the build first.

Placeholders currently in the page:

- `hello@tri-iron.co.uk` — swap for the real shared inbox.
- Footer `Companies House № pending` — update once the dormant company activates.
