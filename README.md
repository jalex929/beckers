# Meridian Health Intelligence — Take-Home Submission

**Jay Fox — UX Engineer (Growth & Experimentation), Becker's Healthcare**

| Resource | Link |
|----------|------|
| Live product | https://fox-beckers.netlify.app |
| Slide deck | https://docs.google.com/presentation/d/1WszpoeiidB07kWUTQQ7XZS7I0EeUibLaKW8OWYNTXPI/edit?usp=sharing |
| Written brief | https://docs.google.com/document/d/1029NcXSAIElm4-jYMziUmGiIAXWh__dh9rOY_4AlymE/edit?usp=sharing |
| GitHub | https://github.com/jalex929/beckers |

---

## How to View

### Option A — Live URL (Recommended)

Visit **https://fox-beckers.netlify.app** — no setup required.

### Option B — GitHub Codespace

1. Go to the repo → green **Code** button → **Codespaces** → **Create codespace on main**
2. Run `npm install && npm run dev` in one terminal
3. Run `npm run dev:client` in a second terminal
4. Visit localhost:5173 when prompted

### Option C — Run Locally

Requires Node.js 18+.

```bash
git clone https://github.com/jalex929/beckers.git
cd beckers && npm install
cd client && npm install && cd ..
```

Terminal 1: `npm run dev` (backend, port 3000)
Terminal 2: `npm run dev:client` (frontend, port 5173)
Tests: `cd client && npm test`

When the frontend starts, navigate manually to **http://localhost:5173** in your browser. If your editor or terminal shows an "Open in browser" or "Open port" prompt, dismiss it and navigate directly — opening via that prompt can resolve to the wrong host and break the API proxy.

---

## Design Decisions

I built Meridian as a standalone brand derived from Becker's Healthcare's token system — same navy family and type scale, but a distinct editorial identity appropriate for a curated content library rather than a news publication. The palette uses an analogous navy/teal pair for structure and gold as a split-complementary accent reserved for dark backgrounds where it achieves 7.30:1 contrast. I chose CSS Modules with a `:root` token system over Tailwind so design decisions stay auditable in one place, and card-grid layouts over list rows because skimmability matters more than density for a browse experience.

**Tradeoffs:** URL-synced filter state makes filtered views shareable but creates a URL contract. Load-more over infinite scroll sacrifices "effortless" browsing for attributable analytics events. localStorage-backed recently viewed and variant assignment works without auth but is device-scoped and has holdout leakage risk.

**With more time:** Replace localStorage variant assignment with GrowthBook/Statsig, wire `page_viewed` tracking, add UTM capture for campaign attribution, complete an accessibility focus-state pass, and add calendar integration for Live Webinar events.

---

## What Was Built

Three pages (Homepage, Resource Library, Asset Signup), all three brief bonuses completed, 31 tests across 5 files, full analytics instrumentation (12 event shapes, GTM-compatible dataLayer), and two live A/B experiments. Details in the slide deck and written brief linked above.

---

## Further Reading (Optional)

| Document | Contents |
|----------|----------|
| [`docs/analytics-plan.md`](./docs/analytics-plan.md) | Event schema, conversion funnel, A/B hypothesis table |
| [`docs/what-i-prioritized.md`](./docs/what-i-prioritized.md) | Prioritization rationale and what was intentionally deferred |
| [`docs/decision-log.md`](./docs/decision-log.md) | Architectural and product decisions with trade-offs |
| [`docs/react-usage.md`](./docs/react-usage.md) | React patterns and state management |
