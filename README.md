# AppPilot

AppPilot is a static portfolio for an AI-native application control plane. It presents the product concept and a simulated CRM change workflow; it is not the full CRM or AI platform.

## Preview

Run a local static server from this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Deployment

The site is deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`. Every push to `main` uploads the repository contents as a Pages artifact and publishes them; the workflow can also be started manually from the Actions tab.

One-time setup: in the repository settings, under **Pages**, set **Source** to **GitHub Actions**.

All page, style, script, and asset references are relative, so the site works from a project subpath such as `https://<user>.github.io/AppPilot/`. The empty `.nojekyll` file keeps Pages from running Jekyll over the static files.

## Structure

- `index.html` - portfolio content and semantic page structure
- `styles.css` - responsive visual system
- `script.js` - navigation, lifecycle simulation, and progressive enhancement
- `assets/` - local SVG artwork used by the page

The original concept brief is intentionally ignored and is not part of the deployed site.
