# Meridian — Frontend Take-Home Worklog

## Context for a fresh session

This is Jay Fox's UX Engineer (Growth & Experimentation) take-home for Becker's Healthcare.  
The brief is at `ux-design-dev-interview-challenge.html` (open in browser for full spec).  
GitHub repo: **https://github.com/jalex929/beckers**  
Codespace name: **improved-disco** (GitHub Codespaces)

---

## How to run locally (two terminals required)

```bash
# Terminal 1 — backend (Express + TypeScript, port 3000)
npm run dev

# Terminal 2 — frontend (Vite React, port 5173)
npm run dev:client
```

Open `http://localhost:5173` in the browser. The Vite dev server proxies `/assets/*` to `http://localhost:3000`.

---

## Project structure

```
asset-lead-gen-interview-take-home-main/
├── src/                        Backend (Express + TypeScript)
│   ├── types/index.ts          LeadGenAsset, Person, API shapes
│   ├── services/assetService.ts  Data access (stub data, in-memory)
│   ├── controllers/assetController.ts
│   ├── routes/assets.ts
│   ├── app.ts
│   └── server.ts
├── client/                     Frontend (React 18 + TypeScript + Vite 5)
│   ├── index.html              Title: "Meridian | Healthcare Resource Library"
│   ├── vite.config.ts          Port 5173, proxy /assets → localhost:3000
│   └── src/
│       ├── index.css           ★ Design token system (ALL CSS variables live here)
│       ├── App.tsx             React Router routes: / | /assets | /assets/:id
│       ├── types/index.ts      Asset, Speaker, SignupPayload, SignupResult
│       ├── hooks/
│       │   ├── useAssets.ts    useAssets(), useAsset(id), submitSignup()
│       │   └── useRecentlyViewed.ts  localStorage, up to 4 assets
│       ├── components/
│       │   ├── Header.tsx / .module.css
│       │   ├── Footer.tsx / .module.css
│       │   ├── AssetCard.tsx / .module.css  (passes location state for back-nav)
│       │   └── AssetBadge.tsx / .module.css
│       └── pages/
│           ├── HomePage.tsx / .module.css   Hero + Recently Viewed + Featured + Browse by Type
│           ├── AssetsPage.tsx / .module.css Filter | Search (debounced 300ms) | Sort | Load More
│           └── SignupPage.tsx / .module.css Asset detail + 5-field form + success + related
├── design_system/              Becker's brand reference (READ ONLY — do not modify)
│   ├── colors_and_type.css     Original BHR tokens (we derived our Meridian system from this)
│   ├── assets/icons/           SVG icons: events, webinars, whitepapers, podcasts
│   └── ui_kits/bhr-web/        High-fidelity BHR component recreations (reference only)
├── README.md                   ★ Has design decisions section (submission requirement — DONE)
└── WORKLOG.md                  This file
```

---

## Brand token quick-reference

All tokens are in `client/src/index.css` `:root`. Key values:

| Token | Value | Use |
|---|---|---|
| `--mer-navy-800` | `#0B2D6B` | Brand primary, bg-inverse, filter active state |
| `--mer-navy-700` | `#0E3A87` | Hover on primary elements |
| `--mer-teal-800` | `#0A5968` | Links, CTAs on light backgrounds, accent |
| `--mer-gold-300` | `#EABC00` | Text/badges/CTAs **on dark backgrounds only** (7.30:1 on navy — AAA) |
| `--mer-gold-800` | `#B8860B` | Decorative/non-text accents only (3.25:1 — fails AA for text) |
| `--mer-cream`    | `#F5F0E8` | Text on dark backgrounds (replaces white) |
| `--mer-error-800`| `#991B1B` | Error text (8.31:1 on white — AAA) |

Semantic aliases: `--color-brand`, `--color-accent`, `--color-fg-inverse`, `--color-kicker-inverse`, `--color-error`, etc.

**Rule:** Never put gold text on white/light backgrounds — it fails contrast. Navy text on gold, or gold on navy, are both AAA.

---

## API endpoints (backend, port 3000)

| Method | Path | Notes |
|---|---|---|
| GET | `/assets` | Returns `{ data: Asset[] }` |
| GET | `/assets/:id` | Returns `{ data: Asset }` or `{ error }` 404 |
| POST | `/assets/:id/signup` | Body: `{ person: { firstName, lastName, email, jobTitle, companyName } }` → `{ data: SignupResult }` |

---

## Completed work ✅

- [x] **Three pages** — HomePage (`/`), AssetsPage (`/assets`), SignupPage (`/assets/:id`)
- [x] **Meridian brand system** — Navy/teal/gold palette, WCAG 2.1 AAA compliance on all text, CSS custom property token system in `index.css`
- [x] **Header** — Sticky, navy bg, "Meridian" wordmark, "Resource Library" subtitle, active nav underline in gold
- [x] **Footer** — Brand wordmark, "Clarity in the business of healthcare." tagline, nav links, copyright
- [x] **AssetBadge** — 4 types styled: Live Webinar (gold/navy), On-Demand Webinar (navy-700/white), Whitepaper (ice/navy), Podcast (navy-600/white)
- [x] **AssetCard** — Badge, date, title, description, sponsor, "Get Access →" link with `location.state.from` for back-nav
- [x] **AssetsPage** — Filter by type (URL param synced), debounced search (300ms, searches name/description/sponsor), sort by date asc/desc, 9-per-page load more, result count "Showing X of Y"
- [x] **SignupPage** — Asset detail panel (sticky on desktop), 5-field validated form (email regex + required), POST to API, inline success with signupDate, related assets by type, smart back link (restores filter state)
- [x] **Recently Viewed** — `useRecentlyViewed` hook, localStorage `meridian_recently_viewed`, max 4, section appears on HomePage after ≥1 visit
- [x] **README design decisions** — Brand, color system, architecture tradeoffs, next steps (4 paragraphs)
- [x] **Bug fix** — `--bh-navy-700` stale token in `AssetsPage.module.css` → `--mer-navy-700`
- [x] **Bug fix** — SignupPage `.stateError` was `--color-accent` (teal) → `--color-error` (red)

---

## Open tickets

### 🔴 P0 — Bugs / must fix before submission

#### P0-1: TypeScript strict checks — run and fix all errors
- Run `cd client && npx tsc --noEmit` to surface any type errors
- Known potential issue: `useRecentlyViewed` `refresh` function in `useEffect` dep array in `HomePage.tsx` may trigger an ESLint exhaustive-deps warning. Fix by wrapping `refresh` in `useCallback` in the hook, or memoizing via `useRef`.
- **Files**: `client/src/hooks/useRecentlyViewed.ts`, `client/src/pages/HomePage.tsx`

#### P0-2: Lint pass — clean up any remaining `--bh-*` token references
- Run `grep -r "bh-navy\|bh-red\|bh-ice\|bh-gray" client/src` to find any leftover original BHR tokens
- All tokens in our system use `--mer-*` prefix (raw) or `--color-*` (semantic)
- **Files**: any CSS modules

---

### 🟠 P1 — Essential polish (brief requirements)

#### P1-1: Responsive layout verification — 1280px and 390px
- Brief explicitly requires "no broken layouts" at desktop and mobile
- **Test at 390px (iPhone 14):**
  - Hero title should drop from `--fs-5xl` (56px) to `--fs-3xl` (36px) — already coded in HomePagemodule.css `@media (max-width: 640px)`
  - `AssetsPage` controls already collapse at 768px — verify search/sort stack correctly
  - `SignupPage` layout already goes to 1-col at 900px — verify form field row also collapses (it does, at 900px)
  - **Check**: typeGrid on HomePage has no mobile breakpoint — 4 cards in `minmax(220px, 1fr)` may be tight at 390px → may need `grid-template-columns: 1fr 1fr` or `1fr`
  - **Check**: AssetCard title text — long titles may overflow at narrow widths
- **Test at 1280px:** Should look roughly like a normal wide viewport. No known issues but verify visually.
- **Files**: `client/src/pages/HomePage.module.css`, `client/src/pages/AssetsPage.module.css`, `client/src/pages/SignupPage.module.css`

#### P1-2: Add `aria-pressed` to filter buttons on AssetsPage
- Current filter buttons are `<button>` but lack `aria-pressed` — screen readers can't tell which is active
- Fix: add `aria-pressed={typeFilter === t.value}` to each button in AssetsPage
- **File**: `client/src/pages/AssetsPage.tsx:90-97`

#### P1-3: Add a catch-all 404 route
- Currently unknown URLs silently render nothing (blank main area)
- Add a `<Route path="*">` in `App.tsx` with a minimal "Page not found" message and link back to home
- **File**: `client/src/App.tsx`

---

### 🟡 P2 — Nice to have / differentiators

#### P2-1: Content-type icons in AssetCard and AssetBadge
- The design system at `design_system/assets/icons/` has SVGs for: `events`, `webinars`, `whitepapers`, `podcasts`
- Copy them to `client/src/assets/icons/` and import as React components (or `<img>`)
- Show the appropriate icon alongside or inside the AssetBadge
- **Files**: `client/src/components/AssetBadge.tsx`, `client/src/assets/icons/`

#### P2-2: Skeleton loading cards instead of plain text
- Current loading state is just `<p>Loading resources…</p>`
- Replace with 3 shimmer skeleton cards (grey animated placeholders) that match the AssetCard dimensions
- CSS `@keyframes shimmer` with a gradient sweep — no extra libraries needed
- **Files**: new `client/src/components/SkeletonCard.tsx` + `.module.css`, update `HomePage.tsx`, `AssetsPage.tsx`

#### P2-3: Sticky filter bar on AssetsPage on scroll
- As user scrolls down through many results, the filter/search controls scroll off-screen
- Make `.controls` sticky (`position: sticky; top: 64px;` — accounts for 64px header height) with a white background and subtle bottom border
- Simple CSS change, high impact
- **File**: `client/src/pages/AssetsPage.module.css`

#### P2-4: Card entry animations
- Subtle fade-up on cards when they enter the viewport (or on page load)
- Use CSS `@keyframes` + `animation-delay` staggered by card index via inline style
- Keep motion minimal — respect `prefers-reduced-motion`
- **File**: `client/src/components/AssetCard.module.css`, `AssetCard.tsx`

#### P2-5: Search result term highlighting
- When a search query is active on AssetsPage, bold/highlight the matching substring in card title and description
- Requires a helper that splits the string around the match and wraps the match in `<mark>` or `<strong>`
- **File**: `client/src/pages/AssetsPage.tsx`, `client/src/components/AssetCard.tsx`

#### P2-6: "Clear recently viewed" button on HomePage
- Give users a way to clear their recently viewed history
- A small "Clear" link next to the section title that calls `localStorage.removeItem('meridian_recently_viewed')` and re-calls `refresh()`
- **Files**: `client/src/pages/HomePage.tsx`, `client/src/hooks/useRecentlyViewed.ts` (export `clearRecentlyViewed()`)

---

## Submission checklist (from brief)

- [x] Three pages implemented
- [x] All API endpoints consumed
- [x] Form validation with error display
- [x] Filter and search on AssetsPage
- [x] Success state after signup
- [x] Related resources after signup (bonus)
- [x] Debounced search (bonus)
- [x] Sort by date (bonus)
- [x] Recently viewed with localStorage (bonus)
- [x] README design decisions section
- [ ] **Responsive layout verified at 1280px and 390px** → P1-1
- [ ] TypeScript / lint clean → P0-1, P0-2

---

## Git workflow

```bash
# Commit and push
git add <files>
git commit -m "message"
git push origin main
```

Remote: `https://github.com/jalex929/beckers.git`  
Branch: `main`
