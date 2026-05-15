# Meridian Health Intelligence — Take-Home Submission

**Jay Fox — UX Engineer (Growth & Experimentation), Becker's Healthcare**

**Live:** https://fox-beckers.netlify.app  
**GitHub:** https://github.com/jalex929/beckers  
**Backend:** https://beckers-production.up.railway.app

---

## How to run locally

Three terminals.

**Terminal 1 — Backend (Express + TypeScript, port 3000)**

```bash
npm run dev
```

**Terminal 2 — Frontend (React + Vite, port 5173)**

```bash
npm run dev:client
```

**Terminal 3 — Tests**

```bash
cd client && npm test
```

The Vite dev server proxies `/assets/*` to `http://localhost:3000` automatically — no CORS configuration required.

---

## What was built

### Three pages

**Homepage (`/`)** — Hero section with live A/B variant on CTA copy, Featured Resources pulled from the API, Browse by Type grid, and a Recently Viewed rail (localStorage-backed, up to 4 items, with a Clear button).

**Resource Library (`/assets`)** — Filter by content type (URL-synced with `useSearchParams`), debounced search (300ms), sort by date, load-more pagination (9 per page), result count ("Showing X of Y"), skeleton loading cards, sticky filter bar, and search term highlighting in card titles and descriptions.

**Asset Signup (`/assets/:id`)** — Asset detail panel, 5-field form with inline validation, POST to the API, inline success state with `signupDate`, related resources filtered by type, and a smart back-link that restores filter state from `location.state`. Live A/B variant on the submit button copy.

### All three brief bonuses were completed.

### Test suite

Vitest — 5 files, 31 tests covering all three pages plus Header and Footer.

### Analytics instrumentation

Typed event bus with GTM-compatible `window.dataLayer`, 12 actively firing event shapes (plus `page_viewed` defined but not wired — see docs), full funnel instrumented from `asset_card_clicked` through `signup_started` → `signup_submitted` → `signup_completed`. Events include `context` and `position` properties for clean A/B test segmentation without post-hoc data joins.

### Experiment infrastructure

`useVariant` hook with localStorage-based stable assignment and sessionStorage-guarded exposure event. Two live A/B tests running: `hero-cta` (control: "Browse the Resource Library" / variant: "Explore Resources") and `signup-cta` (control: "Get Access" / variant: "Register Now"). Adding a third experiment is two lines in `experiments.ts` and one `useVariant()` call at the target component.

---

## Aesthetic decisions

I created Meridian Health Intelligence as a standalone brand rather than reproducing Becker's Hospital Review's visual identity, because a content library occupies a different editorial register than a news publication — it warrants its own visual system, not a template. "Meridian" implies precision and orientation: appropriate for a curated library of clinical and operational content aimed at healthcare decision-makers.

The palette was derived from BHR's token system as a deliberate design exercise — not because Meridian is a sub-brand, but to demonstrate that a coherent new system can be built from an existing one without duplication. Same navy family, similar type scale; distinct enough that the two products read as peers, not parent and child.

The palette is structured as an analogous pair plus a single accent: navy (`#0B2D6B`) and teal (`#0A5968`) share blue as a common base — neighbors on the color wheel, so they read as unified without being identical. Navy carries institutional weight (trust, authority); teal is more approachable and handles interactive elements. Gold (`#EABC00`) is the accent, pulled from the split-complementary direction of the blue family. High chroma, high contrast — reserved exclusively for dark-background use (hero CTA, active nav state, badge labels on navy) where it achieves 7.30:1. Placing gold on white would fail WCAG and visually break the hierarchy; the constraint is load-bearing. Background surfaces use a warm neutral (`#F7F5F2`) rather than stark white — warm tones read as editorial (a quality publication) rather than clinical, which matters for a content library. All contrast ratios annotated inline in `index.css`.

CSS Modules backed by a `:root` token system rather than Tailwind — design tokens stay in one auditable place, and component styles reference the system rather than re-encode it. Card grid over list rows because skimmability at a glance matters more than density for a library browse experience. Skeleton loading over a spinner because skeletons communicate the shape of incoming content and hold layout stable when data arrives.

---

## Engineering tradeoffs

- **URL-synced filter state (`useSearchParams`) vs. component state only** — shareable filtered URLs are a product feature; browser back returns to the correct filtered list rather than root. Trade-off: param names become a URL contract and need to be treated as a public API.

- **Load-more button vs. infinite scroll** — load-more produces attributable analytics events (`load_more_clicked` with `page_number`, `visible_count`, `total_count`); infinite scroll produces ambiguous scroll-position data. "Showing X of Y resources" lets users decide whether to refine or paginate before loading more.

- **localStorage for recently viewed vs. server-side session** — no auth layer exists, so no user identity to attach server-side state to. Full personalization value with zero backend changes. Trade-off: data is device-scoped, not cross-device.

- **Minimal `useVariant` hook vs. LaunchDarkly/Statsig** — architecture mirrors production services (stable assignment, exposure event, centralized registry); swapping to a real SDK means replacing one function. Trade-off: localStorage-based assignment has holdout group leakage risk if a user clears storage.

- **`signup_started` fires on first field focus (ref-guarded) vs. on page load** — captures intent specifically, not accidental page views. A high started/submitted gap means form friction; a high submitted/completed gap means API reliability. Neither problem looks the same in aggregate; you need the event sequence to diagnose them.

---

## What I would do next

- Wire `page_viewed` via a scroll-listener component inside `BrowserRouter` for full funnel top-of-funnel tracking
- UTM parameter capture on `session_started` for campaign attribution
- Replace localStorage-based variant assignment with Statsig or GrowthBook to prevent holdout leakage and enable server-side assignment
- Scroll depth tracking via IntersectionObserver sentinels
- Accessibility focus state pass (keyboard navigation is functional; visible focus rings need a dedicated pass at 390px and 1280px)

---

## Strategy docs

The brief requirements are fully met. The docs below are optional depth.

| Document | Contents |
|----------|----------|
| [`docs/analytics-plan.md`](./docs/analytics-plan.md) | Full event schema, conversion funnel, 7 additional production instrumentation patterns, A/B hypothesis table with primary and secondary metrics |
| [`docs/what-i-prioritized.md`](./docs/what-i-prioritized.md) | Prioritization rationale mapped to the Growth & Experimentation role |
| [`docs/decision-log.md`](./docs/decision-log.md) | 10 architectural and product decisions with options considered and trade-offs accepted |
| [`docs/react-usage.md`](./docs/react-usage.md) | React patterns and state management documentation |

---

## API reference

All responses are wrapped: `{ data: T }` on success, `{ error: string }` on failure.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/assets` | List all lead gen assets |
| GET | `/assets/:id` | Fetch a single asset |
| POST | `/assets/:id/signup` | Sign up a person for an asset |

The signup operation is idempotent — signing up the same person for the same asset twice returns the same record both times.
