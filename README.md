# asset-lead-gen-interview-take-home

"Take Home" technical interview question

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

## Frontend take-home

Open [`ux-design-dev-interview-challenge.html`](./ux-design-dev-interview-challenge.html) in a browser for the full frontend assignment brief — requirements, per-page specs, API usage, and the submission checklist.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Getting started

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

The default values in `.env.example` work out of the box:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the HTTP server listens on |
| `NODE_ENV` | `development` | Runtime environment |

**3. Start the dev server**

```bash
npm run dev
```

The server starts with hot reload via `ts-node-dev`. You should see:

```
[assetService] Loaded 10 assets and 10 signups from stub data
Server listening on port 3000
```

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

---

## Frontend design decisions

**Brand.** Rather than reproducing the Becker's Hospital Review visual identity directly, I created a distinct sub-brand — *Meridian Health Intelligence* — that shares the same voice and editorial authority while standing on its own. The name and visual system are designed to feel like a credible, trust-first healthcare intelligence platform.

**Color system.** Deep navy (`#0B2D6B`, 13.11:1 on white) anchors the brand and conveys institutional trust; teal (`#0A5968`, 7.95:1) serves as the on-light-background accent for links and CTAs. Gold (`#EABC00`) is reserved exclusively for elements on dark backgrounds — hero CTA, nav active state, and content-type badges — where it achieves a 7.30:1 contrast ratio against navy (WCAG 2.1 AAA). Every foreground/background pairing in the interface meets AAA, with contrast ratios annotated in `client/src/index.css`. Warm cream (`#F5F0E8`) replaces white for text on navy to eliminate harshness while still clearing AAA thresholds.

**Architecture tradeoffs.** CSS Modules were chosen over a utility-first approach (Tailwind) to keep the component API clean and the design token system central — all tokens live in a single `:root` block in `index.css` so they're auditable in one place. The filter state is synced to URL params on the Resource Library page so browser back/forward and shareable links work correctly; asset detail pages pass `location.state.from` back to the resource list so the filter position is preserved on navigation. A localStorage-backed "Recently Viewed" section on the homepage personalizes the return experience without any server state.

**What I'd improve with more time.** I'd add skeleton loading states (shimmer cards instead of plain text), paginate the API rather than loading all assets client-side, introduce a tag/topic facet alongside the type filter, and add keyboard-navigable filter chips with proper `aria-pressed` semantics. On the visual side, I'd explore subtle entry animations for cards and a sticky filter bar on scroll.
