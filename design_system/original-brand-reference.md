# Original Brand Reference — Meridian (formerly Becker's Healthcare)

> **Purpose:** This file is a permanent record of the brand system live on the site as of May 2026.
> It should NEVER be modified. Use it as a fallback to revert if new design explorations don't work out.

---

## Brand Identity

**Product name:** Meridian  
**Parent entity:** Meridian Health Intelligence  
**Tagline:** "Intelligence that moves health systems forward."  
**Header sub-brand label:** Resource Library  
**Brand personality:** Professional, Trusted, Engaging (inherited from Becker's brand boards)

---

## Color Palette

### Raw Palette (CSS custom properties)

#### Navy ramp (primary brand color)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-navy-900` | `#061530` | Darkest — deck covers, full-bleed |
| `--mer-navy-800` | `#0B2D6B` | Primary navy — logo, nav, header bg, footer bg |
| `--mer-navy-700` | `#0E3A87` | Hover state for navy surfaces, on-demand badge bg |
| `--mer-navy-600` | `#1E4FA0` | Podcast badge bg |
| `--mer-navy-500` | `#2D63C8` | Hover border accent |

#### Teal ramp (accent/CTA color)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-teal-800` | `#0A5968` | Links, CTA buttons, section links |
| `--mer-teal-700` | `#0A5465` | Hover state for links/CTAs |
| `--mer-teal-100` | `#E0F0F4` | (reserved, not currently used) |

#### Ice ramp (tinted backgrounds)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-ice-050` | `#F4F7FC` | Page background (body + tinted sections) |
| `--mer-ice-100` | `#E8EEF8` | Whitepaper badge bg, live badge bg origin |
| `--mer-ice-200` | `#D1DCF0` | (reserved) |
| `--mer-ice-300` | `#B3C3E0` | Whitepaper badge border, subtle borders |

#### Neutral grays
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-gray-900` | `#111827` | Body text |
| `--mer-gray-700` | `#374151` | Secondary text |
| `--mer-gray-600` | `#4B5563` | Tertiary/subtle text |
| `--mer-gray-200` | `#E5E7EB` | Borders, dividers |
| `--mer-gray-100` | `#F3F4F6` | Muted backgrounds |
| `--mer-white` | `#FFFFFF` | Card backgrounds |

#### Gold (decorative accent)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-gold-300` | `#EABC00` | Hero CTA button bg, eyebrow text on dark, active nav underline |
| `--mer-gold-800` | `#B8860B` | Hero CTA hover state |

#### Cream (inverse text)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-cream` | `#F5F0E8` | Text on dark backgrounds (header, footer) |

#### Error
| Token | Hex | Usage |
|-------|-----|-------|
| `--mer-error-800` | `#991B1B` | Error text |
| `--mer-error-100` | `#FEE2E2` | Error background |

### Semantic Token Map

```css
--color-bg:          #FFFFFF        /* card backgrounds */
--color-bg-muted:    #F3F4F6        /* muted section bg */
--color-bg-tinted:   #F4F7FC        /* page bg, tinted sections (body background) */
--color-bg-inverse:  #0B2D6B        /* header, footer, hero */

--color-fg:          #111827        /* primary text */
--color-fg-muted:    #374151        /* secondary text */
--color-fg-subtle:   #4B5563        /* tertiary text, dates, sponsors */
--color-fg-inverse:  #F5F0E8        /* text on dark bg */
--color-fg-inverse-muted:  rgba(245,240,232,0.75)
--color-fg-inverse-subtle: rgba(245,240,232,0.6)

--color-brand:        #0B2D6B       /* primary brand actions */
--color-brand-hover:  #0E3A87
--color-accent:       #0A5968       /* teal — links, CTAs, submit buttons */
--color-accent-hover: #0A5465

--color-border:         #E5E7EB
--color-border-strong:  #B3C3E0
--color-border-inverse: rgba(255,255,255,0.12)

--color-link:         #0A5968       /* teal */
--color-link-hover:   #0A5465
--color-link-visited: #0E3A87

--color-kicker:         #0A5968     /* eyebrow text on light */
--color-kicker-inverse: #EABC00     /* eyebrow text on dark (gold) */
--color-gold:           #B8860B     /* warm gold decorative */

--color-error:    #991B1B
--color-error-bg: #FEE2E2
```

---

## Typography

### Font Stack

| Role | Family | Fallbacks |
|------|--------|-----------|
| Display/Headings (serif) | **Noto Serif** | Source Serif Pro, Georgia, Times New Roman, serif |
| Body/UI (sans) | **Fira Sans** | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif |
| Code | ui-monospace | SF Mono, Menlo, Consolas, monospace |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap
```

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--fw-light` | 300 | (reserved) |
| `--fw-regular` | 400 | Body text |
| `--fw-semibold` | 600 | Labels, nav links, CTAs, sponsors |
| `--fw-bold` | 700 | Headings, brand name, badges |

### Type Scale
| Token | Size | Usage |
|-------|------|-------|
| `--fs-xs` | 12px | Badges, kickers, meta, timestamps |
| `--fs-sm` | 14px | Body small, nav links, descriptions, CTAs |
| `--fs-base` | 16px | Body, form inputs |
| `--fs-md` | 18px | Hero subtitle |
| `--fs-lg` | 20px | (reserved) |
| `--fs-xl` | 24px | Card titles, brand name, section headings |
| `--fs-2xl` | 30px | Form titles, asset titles |
| `--fs-3xl` | 36px | Section headings, asset detail title |
| `--fs-4xl` | 44px | Page titles ("Resource Library") |
| `--fs-5xl` | 56px | Hero title |
| `--fs-6xl` | 72px | (reserved for display) |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--lh-tight` | 1.15 | Display headings |
| `--lh-snug` | 1.3 | Section headings |
| `--lh-normal` | 1.5 | Default body |
| `--lh-loose` | 1.65 | Long-form body text, descriptions |

### Letter Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.01em | Headings |
| `--tracking-normal` | 0 | Body |
| `--tracking-wide` | 0.06em | Nav links, footer tagline, brand sub |
| `--tracking-kicker` | 0.12em | Uppercase badges and eyebrows |

---

## Spacing System (4px base)

| Token | Value |
|-------|-------|
| `--sp-0` | 0 |
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-5` | 20px |
| `--sp-6` | 24px |
| `--sp-7` | 32px |
| `--sp-8` | 40px |
| `--sp-9` | 56px |
| `--sp-10` | 72px |
| `--sp-11` | 96px |

---

## Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | — |
| `--radius-xs` | 2px | Highlights |
| `--radius-sm` | 4px | Buttons, inputs, CTA |
| `--radius-md` | 6px | — |
| `--radius-lg` | 8px | Cards, panels |
| `--radius-pill` | 999px | Badges, filter buttons |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(9,31,62,0.06)` | — |
| `--shadow-sm` | `0 1px 3px rgba(9,31,62,0.08), 0 1px 2px rgba(9,31,62,0.04)` | Cards default |
| `--shadow-md` | `0 4px 10px rgba(9,31,62,0.08), 0 2px 4px rgba(9,31,62,0.05)` | Cards hover |
| `--shadow-lg` | `0 12px 28px rgba(9,31,62,0.12), 0 4px 10px rgba(9,31,62,0.06)` | — |
| `--shadow-focus` | `0 0 0 3px rgba(10,89,104,0.35)` | Focus ring (teal) |

---

## Layout

| Token | Value |
|-------|-------|
| `--container` | 1240px |
| `--container-narrow` | 880px |
| `--gutter` | 24px |

---

## Component Patterns

### Header
- Sticky, full-width, `--color-bg-inverse` (navy) background
- Height: 64px
- Brand: serif bold 24px, cream color, with "Resource Library" sub-label (uppercase, wide tracking, 12px)
- Nav links: sans semibold 14px, uppercase, wide tracking, muted inverse color
- Active nav: full white + gold bottom border (2px)
- Hover: transitions to full white

### Footer
- Navy background (`--color-bg-inverse`), border-top inverse
- Brand name: serif bold 24px, inverse
- Tagline: sans 12px, `rgba(255,255,255,0.5)`, wide tracking
- Links: sans 14px, `rgba(255,255,255,0.65)`, hover to full white
- Copyright: sans 12px, `rgba(255,255,255,0.4)`, right-aligned

### Asset Cards
- White background, 1px gray border, 8px radius, sm shadow
- Hover: md shadow + translateY(-2px)
- Entry animation: fadeUp (opacity 0 → 1, translateY 10px → 0, 0.35s)
- Badge (pill) at top
- Title: serif bold 24px, balanced text wrapping
- Description: sans 14px, muted, 3-line clamp
- Sponsor: sans 12px, semibold, subtle, uppercase, wide tracking
- CTA link: sans 14px, semibold, teal color, hover underline

### Asset Badges (pills)
- Shared: sans 12px bold, uppercase, kicker tracking, pill radius
- **Live Webinar:** gold-300 bg, navy-800 text
- **On-Demand Webinar:** navy-700 bg, white text
- **Whitepaper:** ice-100 bg, navy-800 text, ice-300 border
- **Podcast:** navy-600 bg, white text
- Icons: 13px, inline before text, inverse filter when on dark bg

### Filter Buttons (Resource Library page)
- Inactive: white bg, gray border, gray-700 text, pill radius
- Hover: navy border, navy text
- Active: navy bg, navy border, white text
- Active hover: navy-700 bg

### Search Input
- Sans 14px, gray border, 4px radius, 220px width
- Focus: navy border + 3px navy shadow ring (12% opacity)

### Hero Section (Home)
- Navy background, 96px vertical padding
- Eyebrow: sans 12px bold, uppercase, kicker tracking, gold color
- Title: serif bold 56px, tight line-height, -0.02em tracking, balanced, cream color
- Subtitle: sans 18px, loose line-height, muted inverse, max-width 560px
- CTA button: gold-300 bg, navy text, sans 16px semibold, 4px radius
- CTA hover: gold-800 bg, white text

### Form (Signup Page)
- Two-column grid layout (asset panel + form panel)
- Asset panel is sticky (top: 80px)
- Form inputs: sans 16px, 12px vertical / 16px horizontal padding, gray border, 4px radius
- Focus: navy border + shadow ring
- Submit button: teal bg, white text, sans 16px semibold, 4px radius
- Success: teal icon circle, serif bold title, sans description

### Skeleton Loading Cards
- Same card dimensions and border
- Shimmer animation: linear gradient sweep, 1.4s infinite
- Gradient: gray-100 → gray-200 → gray-100
- Respects prefers-reduced-motion

---

## Animation & Interaction

- **Default transition:** `0.15s ease` on color, background-color, border-color, box-shadow
- **Card hover:** `0.2s ease` on box-shadow + transform
- **Card entrance:** fadeUp keyframe, 0.35s ease both (respects reduced-motion)
- **Skeleton shimmer:** 1.4s infinite linear (respects reduced-motion)
- **No bounces, no parallax, no entrance animations beyond cards** — editorial/newsroom feel

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|-----------|-------------|
| 900px | Signup layout collapses to single column, asset panel unsticks |
| 768px | Resource Library: controls stack, grid → 1 column |
| 640px | Hero title → 36px, section header stacks, type grid → 2 cols, header sub-brand hidden |
| 420px | Type grid → 1 column |

---

## Body / Page Background

The `body` element uses `--color-bg-tinted` (`#F4F7FC`) as its background to ensure the light blue ice color fills the viewport even when content is short. Individual sections (cards, form panels) use `--color-bg` (white) for contrast.

---

## Voice & Content Rules (inherited from Becker's)

- **Third person throughout** — no "I", "we", or "you" in editorial content
- **Sentence case headlines** — not title case
- **No emoji. Ever.**
- **AP style** for numbers, dates, locations
- **Short paragraphs** (1-3 sentences)
- Nav labels and CTAs: Title Case
- Badges/kickers: UPPERCASE with wide tracking

---

## File Locations (for reverting)

| What | Path |
|------|------|
| Global CSS (tokens + resets) | `client/src/index.css` |
| Design system CSS (original Becker's tokens) | `design_system/colors_and_type.css` |
| Design system README | `design_system/README.md` |
| Header component | `client/src/components/Header.tsx` + `.module.css` |
| Footer component | `client/src/components/Footer.tsx` + `.module.css` |
| Asset Card | `client/src/components/AssetCard.tsx` + `.module.css` |
| Asset Badge | `client/src/components/AssetBadge.tsx` + `.module.css` |
| Skeleton Card | `client/src/components/SkeletonCard.tsx` + `.module.css` |
| Home Page | `client/src/pages/HomePage.tsx` + `.module.css` |
| Assets Page | `client/src/pages/AssetsPage.tsx` + `.module.css` |
| Signup Page | `client/src/pages/SignupPage.tsx` + `.module.css` |
| Icons | `client/src/assets/icons/` (events, podcasts, webinars, whitepapers SVGs) |
