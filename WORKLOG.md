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
│       ├── assets/icons/           events.svg, webinars.svg, whitepapers.svg, podcasts.svg
│       ├── components/
│       │   ├── Header.tsx / .module.css
│       │   ├── Footer.tsx / .module.css
│       │   ├── AssetCard.tsx / .module.css  (index prop, highlight prop, fadeUp animation)
│       │   ├── AssetBadge.tsx / .module.css (SVG icons, inverse filter for dark variants)
│       │   └── SkeletonCard.tsx / .module.css  (shimmer loading placeholder)
│       ├── pages/
│       │   ├── HomePage.tsx / .module.css   Hero + Recently Viewed (+ Clear) + Featured + Browse by Type
│       │   ├── AssetsPage.tsx / .module.css Filter | Search | Sort | Load More | Sticky controls | Skeletons
│       │   └── SignupPage.tsx / .module.css Asset detail + 5-field form + success + related
│       └── vite-env.d.ts           CSS module type declarations
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
- [x] **TypeScript** — Created `client/src/vite-env.d.ts`; resolved all 7 CSS module TS2307 errors; zero type errors on `tsc --noEmit`
- [x] **Token cleanup** — Replaced remaining `--bh-navy-500` in `HomePage.module.css` → `--mer-navy-500`; no `--bh-*` references remain
- [x] **Accessibility** — `aria-pressed={typeFilter === t.value}` on all AssetsPage filter buttons
- [x] **404 route** — Inline `NotFound` component + `<Route path="*">` catch-all in `App.tsx`
- [x] **Responsive** — typeGrid collapses to 2-col at 640px, 1-col at 420px; verified hero, controls, and card grid at 390px
- [x] **Content-type icons** — SVGs (events/webinars/whitepapers/podcasts) from design system rendered in AssetBadge; dark-background variants use `filter: brightness(0) invert(1)` for white icons
- [x] **Sticky filter bar** — AssetsPage `.controls` is `position: sticky; top: 64px` with tinted background and bottom border
- [x] **Skeleton loading** — `SkeletonCard` component with shimmer animation replaces loading text in HomePage + AssetsPage; respects `prefers-reduced-motion`
- [x] **Card animations** — Fade-up on entry (`@keyframes fadeUp`) with 60ms staggered delay by card index; respects `prefers-reduced-motion`
- [x] **Search highlighting** — Matching substrings in card title and description wrapped in `<mark>` with gold background when a search query is active; uses index-parity split approach for reliable `g`-flag regex matching
- [x] **Clear recently viewed** — `clearRecentlyViewed()` exported from hook; Clear button in Recently Viewed section header on HomePage
- [x] **Search highlight color** — Softened from full `--mer-gold-300` to `rgba(234,188,0,0.25)` tint so it doesn't compete with active UI elements
- [x] **README rewrite** — Full submission-ready README: Meridian intro, two-terminal setup, feature inventory, 7-paragraph design decisions section (brand, color, architecture, conversion thinking, accessibility, progressive enhancement, AI workflow disclosure)

---

## Open tickets

*All P0, P1, and P2 tickets closed. No open issues.*

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
- [x] **Responsive layout verified at 1280px and 390px**
- [x] TypeScript / lint clean — zero errors on `tsc --noEmit`, no stale `--bh-*` tokens

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
