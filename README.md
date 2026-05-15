# Meridian Health Intelligence — Take-Home Submission

**Jay Fox — UX Engineer (Growth & Experimentation), Becker's Healthcare**

This repo is the original Express + TypeScript API starter with a React 18 + TypeScript + Vite frontend added under `client/`. The frontend is a healthcare resource library called **Meridian Health Intelligence**, built on top of the provided API with no modifications to the backend.

---

## How to run

Two terminals are required.

**Terminal 1 — Backend (Express + TypeScript, port 3000)**

```bash
npm install
npm run dev
```

You should see:
```
[assetService] Loaded 10 assets and 10 signups from stub data
Server listening on port 3000
```

**Terminal 2 — Frontend (React + Vite, port 5173)**

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/assets/*` to `http://localhost:3000` automatically — no CORS configuration required.

---

## What was built

### Three pages

**Homepage (`/`)** — Hero section with navy background and gold CTA, Recently Viewed rail (localStorage-backed, up to 4 items, with a Clear button), Featured Resources, and a Browse by Type grid.

**Resource Library (`/assets`)** — Filter by content type (4 types, URL-synced with `aria-pressed` toggle buttons), debounced search (300ms), sort by date (newest/oldest), load-more pagination (9 per page), result count, empty state, skeleton loading cards, sticky controls bar, and search term highlighting in card titles and descriptions.

**Asset Signup (`/assets/:id`)** — Asset detail panel (sticky on desktop), 5-field validated form, POST to the API, inline success state with signup date, related resources filtered by type, and a smart back-link that restores filter state from `location.state`.

### Components and systems

| Component | Description |
|-----------|-------------|
| `AssetBadge` | 4 type variants with corresponding SVG icons; white-filtered for dark-background use |
| `AssetCard` | Fade-up entry animation staggered by index; respects `prefers-reduced-motion`; optional search highlight via `<mark>` |
| `SkeletonCard` | Shimmer placeholder matching card anatomy; respects `prefers-reduced-motion` |
| `Header` / `Footer` | Sticky header with active nav state in gold; brand wordmark and tagline |
| `useAssets` / `useAsset` | Data-fetching hooks with loading and error state |
| `useRecentlyViewed` | localStorage hook with cap and clear |

### Bonus features delivered

- Debounced search (300ms, no excessive re-renders)
- Sort by date (newest / oldest)
- Related resources on signup success
- Recently Viewed with localStorage + Clear button
- Search term highlighting (gold-tint `<mark>`)
- Skeleton loading cards with shimmer animation
- Sticky filter bar (accounts for 64px header)
- Card entry animations with stagger
- Content-type icons in badges
- `aria-pressed` on filter toggle buttons
- 404 catch-all route
- Mobile responsive (verified at 390px and 1280px)
- Zero TypeScript errors (`tsc --noEmit` clean)
- URL-synced filter state + `location.state` back-navigation
- Analytics instrumentation — typed event bus, GTM-compatible `window.dataLayer`, 10 events across all 3 pages
- `docs/analytics-plan.md` — full instrumentation strategy, conversion funnel, 7 production events, experimentation table

---

## Design decisions

**Brand.** I created a distinct sub-brand — *Meridian Health Intelligence* — rather than reproducing Becker's Hospital Review's identity directly. The rationale is product-level: a resource library sits in a different editorial register than a news publication. It should feel like a credible intelligence platform that shares Becker's authority and voice but has its own visual posture. "Meridian" implies orientation, expertise, and precision — appropriate for a library of clinical and operational content aimed at healthcare decision-makers. The name gives the product something to stand on without diluting the parent brand.

**Color system.** The token system is built around three intentional pairings, each meeting WCAG 2.1 AAA. Deep navy (`#0B2D6B`, 13.11:1 on white) anchors the brand and carries institutional weight — appropriate for a healthcare context where trust is load-bearing, not decorative. Teal (`#0A5968`, 7.95:1 on white) serves as the on-light-background accent for links and interactive elements. Gold (`#EABC00`) is reserved exclusively for elements placed on dark backgrounds — the hero CTA, the active nav state, and content-type badge labels — where it achieves 7.30:1 against navy (AAA). Putting gold on white would fail contrast; the constraint is by design, not oversight. Warm cream (`#F5F0E8`) replaces pure white for body text on navy, reducing optical harshness while still clearing AAA thresholds. All contrast ratios are annotated inline in `client/src/index.css` so any future contributor can audit them without running a separate tool.

**Architecture.** CSS Modules over Tailwind — the decision comes down to where the design token system lives. With Tailwind, tokens scatter into utility classes and the canonical source of truth fragments across files. With CSS Modules backed by a single `:root` block, every token is auditable in one place and component styles reference the system rather than re-encode it. Filter state is synced to URL search params on the Resource Library page so browser back/forward and shareable filtered links work correctly without any additional routing logic. Asset detail pages read `location.state.from` on mount and pass it back to the Back button so the user lands exactly where they left the list. No global state library was needed — `useAssets`, `useAsset`, and `useRecentlyViewed` cover all the state requirements with straightforward React hooks.

**Conversion and analytics thinking.** The Resource Library is the primary conversion surface in a lead-gen product. Every interaction in this UI is a signal — which content types draw attention, which search queries fail, where in the signup flow users abandon. Those signals are the raw material of a growth experimentation practice. Without instrumentation, you are guessing.

The analytics layer (`client/src/utils/analytics.ts`) is structured around three questions a growth team actually asks.

*Content performance.* `asset_card_clicked` captures position and context (`homepage_featured`, `homepage_recently_viewed`, `assets_page`, `related`). Position data answers whether the first card in a grid always wins, or whether lower-ranked content can compete when placed in the right context. Context data separates organic browsing behavior on the listing page from homepage editorial decisions. Without that split, a CTA copy experiment on the listing page is indistinguishable from a layout change on the homepage — both show up as movement in the same metric.

*Funnel health.* The `signup_started → signup_submitted → signup_completed` sequence is the core conversion funnel, and each gap is a different diagnostic. A high started/submitted gap means form friction — too many fields, unclear labels, a failed copy experiment. A high submitted/completed gap means API reliability or error messaging. Neither problem looks the same in aggregate numbers; you need the event sequence to tell them apart. The `signup_started` event fires on first field focus (guarded by a ref so it can't re-fire), which means it captures intent specifically — not accidental page loads.

*Content gap detection.* `search_used` includes `result_count`. Zero-result searches are unfulfilled intent: queries healthcare professionals are typing into this product that return no matching content. Routing zero-result queries to a content team dashboard is a standard growth lever that most teams never build because no one instruments search with result counts.

The `context` property on `asset_card_clicked` is the scaffolding for clean A/B test analysis. When you test "3 featured cards vs. 4 featured cards on the homepage," you need clicks attributed to the homepage featured slot specifically — not pooled with listing page clicks — or your experiment metric is noise. `context: 'homepage_featured'` makes that segmentation possible without a post-hoc data join. The same principle applies to the `related` context on the signup success screen: post-conversion recommendation clicks are a separate signal from discovery clicks and should never be mixed into the same funnel.

Full event schema, conversion funnel diagram, and 7 additional production events (scroll depth, time-to-convert, form field abandonment per field, session identity, UTM capture, rage click detection, A/B exposure event) are documented in `docs/analytics-plan.md`.

**Accessibility.** Semantic HTML throughout — `<nav>`, `<main>`, `<article>`, `<button>` used for their intended roles. Filter buttons use `aria-pressed` (toggle state) rather than `role="tab"` (selection) because the behavior is toggling, not switching contexts. Search and sort controls have explicit `aria-label` attributes. Decorative icons carry `aria-hidden="true"`. All card animation and skeleton shimmer effects are wrapped in a `prefers-reduced-motion` media query — the experience degrades to an instant render, not a broken one.

**Progressive enhancement.** Skeleton cards instead of a spinner preserve layout stability — the page doesn't reflow when content arrives, and users get a sense of what's coming. The sticky filter bar solves a real usability problem: without it, users who scroll past the first page of results have to scroll back to the top to change filters. Debounced search (300ms) keeps the interaction responsive without triggering a re-fetch on every keystroke. Staggered card entry animations (80ms delay per index) make the list feel sequential rather than simultaneous — it reads as content loading in, not a flash of 9 items appearing at once.

**AI-assisted workflow.** This project used Claude Code for implementation and debugging, ChatGPT for systems thinking and documentation, and Bolt.new for initial UI scaffolding. The workflow was human-led throughout: architecture decisions, design tradeoffs, and final implementation calls were made by me; AI tools handled acceleration, not direction. Every suggestion was reviewed and validated before it was committed. I'm transparent about this because I think it's the right way to work, and because the growth engineering role almost certainly involves thinking about AI-assisted workflows in product — so it seems worth modeling.

---

## Design system

The `design_system/` folder contains the Becker's Healthcare brand system candidates should use as a reference when building the frontend.

### Fonts & colors — `colors_and_type.css`

Import this file first in any HTML page. It defines:

- **Colors** — deep navy (`--bh-navy-*`) as the identity color, crimson red (`--bh-red-*`) as the accent (links, kickers, CTAs), and a cool-neutral ice palette (`--bh-ice-*`, `--bh-gray-*`) for backgrounds and borders. Semantic aliases (`--color-bg`, `--color-accent`, etc.) are also provided.
- **Typography** — `--font-serif` (Noto Serif) for all headlines; `--font-sans` (Fira Sans) for body, nav, and UI. A fluid type scale from `--fs-xs` (12px) to `--fs-6xl` (72px), plus pre-built classes like `.bh-h1`, `.bh-headline`, `.bh-kicker`, `.bh-body`.
- **Spacing** — 4px base scale (`--sp-1` through `--sp-11`).
- **Radii** — largely square; max `--radius-lg` (8px) for cards, `--radius-pill` for tags.
- **Shadows** — minimal (`--shadow-xs` through `--shadow-lg`); editorial, not decorative.

### Assets

| Path | Contents |
|------|----------|
| `assets/logos/` | Becker's Hospital Review wordmark (PNG) |
| `assets/icons/` | SVG icons for the four content types: `events`, `webinars`, `whitepapers`, `podcasts` |
| `uploads/` | Brand board screenshots used to derive the system |

### UI kits

| Kit | Path | Description |
|-----|------|-------------|
| BHR Web | `ui_kits/bhr-web/` | High-fidelity recreation of the Becker's Hospital Review website. Includes `Header.jsx`, `ArticleCard.jsx`, `EventAndCTA.jsx`, `Footer.jsx`, `SiteSwitcher.jsx`, and an interactive `index.html` demo. |
| Newsletter | `ui_kits/newsletter/` | Recreation of the Becker's daily email newsletter (640px editorial stack). Includes `Newsletter.jsx` and a rendered `index.html` sample. |

Both kits depend on `colors_and_type.css` and scope their styles through `kit.css`.

### Preview pages

`design_system/preview/` contains standalone HTML files for every token and component category: color palettes, type scales, spacing, shadows, radii, buttons, forms, nav, tags, and article/event cards. Open any file in a browser to see the rendered system.

### Brand voice

The design system README (`design_system/README.md`) includes full content guidelines: sentence-case headlines, third-person copy, AP-style numbers, no emoji, and the "Professional · Trusted · Engaging" tone triad. Read it before writing any UI copy.

---

## API

All responses are wrapped in `{ data: T }` on success and `{ error: string }` on failure.

---

### `GET /assets` — List all assets

Returns every lead gen asset in the system.

**Response `200`**

```json
{
  "data": [
    {
      "id": "5af0e596b3c7e95aaafe42e01222f91666354f9152238bcf443b2c4c4ac46cfa",
      "name": "The Future of AI in Clinical Decision Support",
      "description": "A live webinar exploring how AI-powered tools are transforming clinical decision-making...",
      "executionDate": "2026-06-10T14:00:00.000Z",
      "expirationDate": "2026-12-31",
      "sponsorName": "Epic Systems",
      "assetType": "Live Webinar",
      "speakers": [
        {
          "id": "04d7bc0f2f0841afc8f7383a2525a2c5edb805625dbe1b117b70ecc3d3004911",
          "firstName": "Linda",
          "lastName": "Nguyen",
          "jobTitle": "Director of Clinical Informatics",
          "companyName": "Mayo Clinic",
          "email": "linda.nguyen@mayoclinic.org"
        }
      ],
      "createdDate": "2026-04-01T09:00:00.000Z",
      "createdBy": "admin@beckershealthcare.com",
      "lastModifiedDate": "2026-04-15T11:30:00.000Z",
      "lastModifiedBy": "admin@beckershealthcare.com"
    }
  ]
}
```

**Example**

```bash
curl http://localhost:3000/assets
```

---

### `GET /assets/:id` — Get a single asset

Returns one asset by its id, including optional `speakers` and scheduling fields.

**Path parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The asset's unique identifier |

**Response `200`**

```json
{
  "data": {
    "id": "5af0e596b3c7e95aaafe42e01222f91666354f9152238bcf443b2c4c4ac46cfa",
    "name": "The Future of AI in Clinical Decision Support",
    "description": "A live webinar exploring how AI-powered tools are transforming clinical decision-making...",
    "executionDate": "2026-06-10T14:00:00.000Z",
    "expirationDate": "2026-12-31",
    "sponsorName": "Epic Systems",
    "assetType": "Live Webinar",
    "speakers": [...],
    "createdDate": "2026-04-01T09:00:00.000Z",
    "createdBy": "admin@beckershealthcare.com",
    "lastModifiedDate": "2026-04-15T11:30:00.000Z",
    "lastModifiedBy": "admin@beckershealthcare.com"
  }
}
```

**Response `404`** — asset id not found

```json
{ "error": "Asset not found" }
```

**Example**

```bash
curl http://localhost:3000/assets/5af0e596b3c7e95aaafe42e01222f91666354f9152238bcf443b2c4c4ac46cfa
```

---

### `POST /assets/:id/signup` — Sign up for an asset

Registers a person for a lead gen asset. The operation is idempotent: signing up the same person for the same asset twice returns the same signup record both times.

**Path parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The asset's unique identifier |

**Request body** (`application/json`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `person` | object | yes | The person signing up |
| `person.id` | string | no | Existing person id. If omitted, one is generated from the person's name and email |
| `person.firstName` | string | yes | |
| `person.lastName` | string | yes | |
| `person.jobTitle` | string | yes | |
| `person.companyName` | string | yes | |
| `person.email` | string | yes | |

**Response `201`**

```json
{
  "data": {
    "id": "a3f9c2...",
    "assetId": "5af0e596b3c7...",
    "signupDate": "2026-05-11T18:32:00.000Z",
    "person": {
      "id": "7b1d44...",
      "firstName": "Jane",
      "lastName": "Smith",
      "jobTitle": "CFO",
      "companyName": "Acme Health",
      "email": "jane.smith@acme.com"
    }
  }
}
```

**Response `400`** — `person` field missing from request body

```json
{ "error": "person is required" }
```

**Example — new person (no existing id)**

```bash
curl -X POST http://localhost:3000/assets/5af0e596b3c7e95aaafe42e01222f91666354f9152238bcf443b2c4c4ac46cfa/signup \
  -H "Content-Type: application/json" \
  -d '{
    "person": {
      "firstName": "Jane",
      "lastName": "Smith",
      "jobTitle": "CFO",
      "companyName": "Acme Health",
      "email": "jane.smith@acme.com"
    }
  }'
```

**Example — known person (preserve existing id)**

```bash
curl -X POST http://localhost:3000/assets/5af0e596b3c7e95aaafe42e01222f91666354f9152238bcf443b2c4c4ac46cfa/signup \
  -H "Content-Type: application/json" \
  -d '{
    "person": {
      "id": "04d7bc0f2f0841afc8f7383a2525a2c5edb805625dbe1b117b70ecc3d3004911",
      "firstName": "Linda",
      "lastName": "Nguyen",
      "jobTitle": "Director of Clinical Informatics",
      "companyName": "Mayo Clinic",
      "email": "linda.nguyen@mayoclinic.org"
    }
  }'
```

---

## Testing

### Unit tests

Mocks the service layer and tests controller/routing behavior in isolation.

```bash
npm test
```

### E2E tests

Runs the full Express stack against real stub data — no mocks. No server needs to be running; supertest handles it internally.

```bash
npx jest src/__tests__/assets.e2e.test.ts
```

To run all tests together:

```bash
npm test
```

### Watch mode

```bash
npm run test:watch
```

## Other commands

```bash
npm run build      # compile TypeScript to dist/
npm start          # run the compiled server (requires build first)
npm run lint       # lint src/**/*.ts
```
