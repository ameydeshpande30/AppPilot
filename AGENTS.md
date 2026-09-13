# AppPilot Portfolio Guide

## What This Project Is

AppPilot is a static portfolio and product-concept presentation for an AI-native application control plane.

The site presents the idea through a simulated CRM workflow. It is not the full application described in the concept brief.

## Scope

Implemented:

- Responsive single-page portfolio
- Product positioning and narrative
- Interactive front-end CRM change simulation
- Lifecycle walkthrough from request to promotion
- AI CRM template showcase
- Upcoming template roadmap
- Architecture and reliability sections
- Local SVG artwork
- Responsive navigation
- Reduced-motion support
- Plain HTML, CSS, and JavaScript

Not implemented:

- Real CRM backend
- Authentication
- PostgreSQL database
- Live AI agent
- Code generation or repository editing
- Real preview deployment
- Production promotion pipeline
- Live API integrations

The workflow is intentionally a deterministic front-end concept simulation.

## File Guide

- `index.html` - semantic page structure, copy, CRM showcase, workflow, and sections
- `styles.css` - design tokens, layout, responsive rules, typography, accessibility states, and motion
- `script.js` - mobile navigation, demo workflow state, lifecycle controls, active navigation, and scroll reveals
- `assets/mark.svg` - local favicon and brand mark
- `assets/favicon-16.png`, `assets/favicon-32.png`, `assets/apple-touch-icon.png` - PNG favicon fallbacks generated from `mark.svg`
- `assets/hero-control-plane.svg` - hero artwork
- `assets/architecture-map.svg` - local architecture diagram
- `README.md` - short local preview instructions
- `.gitignore` - excludes the source PDF brief and local files
- `AI_Application_Control_Plane_Portfolio_Concept.pdf` - local reference brief only; never stage or deploy it
- `.github/workflows/deploy-pages.yml` - GitHub Pages deployment workflow
- `.nojekyll` - disables Jekyll processing on GitHub Pages

## Local Preview

Start the built-in Python static server from the project root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

Stop the server with `Ctrl+C`.

## Validation

Run the JavaScript syntax check:

```bash
node --check script.js
```

Verify all local image references exist:

```bash
python3 - <<'PY'
import os
from html.parser import HTMLParser

refs = []
class Parser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        refs.extend(value for name, value in attrs if name in ("src", "href") and value)

with open("index.html", encoding="utf-8") as page:
    Parser().feed(page.read())

missing = [ref for ref in refs if ref.startswith("assets/") and not os.path.exists(ref.split("#", 1)[0])]
if missing:
    raise SystemExit(f"Missing local assets: {missing}")
print("Local asset check passed")
PY
```

Confirm the source brief is ignored and not staged:

```bash
git check-ignore -v AI_Application_Control_Plane_Portfolio_Concept.pdf
git status --short
```

The ignore check should point to `.gitignore`, and the PDF should not appear in Git status.

## Content Rules

- Keep AppPilot positioned as an application control plane that maintains and extends real software, not a generic coding chatbot or a one-shot code generator.
- Every capability claim should read as covering both adding features and fixing/maintaining existing behavior, with the agent responsible for the test, build, and ship steps.
- Keep the CRM as the first proof point.
- Describe Inventory Ops, Customer Workspace, customer support portals, internal operations, analytics dashboards, and custom application templates as upcoming or future directions.
- Do not invent customer names, performance metrics, production claims, links, or personal details.
- Do not add CVE remediation, dependency/framework upgrades, rollback and recovery, drift/health monitoring, or refactoring/tech-debt claims - these are explicitly out of scope for now.
- Keep the simulated nature of the workflow clear whenever adding copy that could be mistaken for a live product capability.
- Do not add the PDF brief, generated exports, or other brief artifacts to the deployed site.

## Design Direction

The visual system uses a dark forest-green foundation, warm paper surfaces, and orange signal accents. Keep layouts editorial and product-oriented, with the workflow and architecture as the visual anchors. Avoid generic SaaS card grids, purple gradients, and unnecessary dependencies.

Preserve keyboard focus states, readable contrast, stable mobile layouts, meaningful image alternatives, and `prefers-reduced-motion` behavior when changing the UI.
