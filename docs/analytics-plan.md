# Meridian Analytics Plan

## Overview

This document describes Meridian's behavioral instrumentation strategy — what is currently tracked, how events are structured, and what would be added in a production build with more time, tooling, or team context.

All events are fired through `client/src/utils/analytics.ts`, a typed wrapper that pushes to `window.dataLayer` (GTM-compatible) and logs to the console in development. The schema uses a discriminated union so TypeScript enforces correct properties at every call site.

---

## Currently Implemented Events

### `page_viewed`
*Planned — not yet wired. Requires a scroll-listener component inside `<BrowserRouter>`.*
Properties: `page`, `path`

### `asset_card_clicked`
Fired when a user clicks "Get Access →" on any asset card.
Properties:
- `asset_id` — unique asset identifier
- `asset_type` — Live Webinar, On-Demand Webinar, Whitepaper, on-demand podcast
- `asset_name` — asset title (for content analysis)
- `position` — zero-based card index within its grid (measures position bias)
- `context` — placement: `homepage_featured`, `homepage_recently_viewed`, `assets_page`, `related`

**Why context matters:** A/B tests on card layout, CTA copy, or content hierarchy need position + context to separate "featured slot 0 performs well" from "featured cards outperform listing cards."

### `filter_applied`
Fired when user selects a content type filter on the Assets page.
Properties:
- `filter_value` — the selected type or `'all'`

### `search_used`
Fired when the debounced search query resolves (300ms after last keystroke) and is non-empty.
Properties:
- `query` — the search string
- `result_count` — number of matching assets at the time of fire

**Why result_count:** Zero-result searches are a content gap signal. High-volume zero-result queries become a backlog item for content teams.

### `sort_changed`
Fired when user changes the sort dropdown.
Properties:
- `sort_value` — `default`, `asc`, or `desc`

### `load_more_clicked`
Fired when user requests the next page of results.
Properties:
- `page_number` — the new page number (1-indexed)
- `visible_count` — count visible before load
- `total_count` — total filtered count

### `signup_started`
Fired once when the user first focuses any field in the signup form. Uses a `useRef` guard to prevent re-firing on re-focus.
Properties:
- `asset_id`
- `asset_type`

### `signup_submitted`
Fired on every form submission attempt (after client-side validation passes).
Properties:
- `asset_id`
- `asset_type`

**Note:** The gap between `signup_started` and `signup_submitted` counts form abandonment. The gap between `signup_submitted` and `signup_completed` counts API failures.

### `signup_completed`
Fired after a successful API response.
Properties:
- `asset_id`
- `asset_type`
- `signup_date` — ISO timestamp from the API response

### `signup_failed`
Fired when the API call throws.
Properties:
- `asset_id`
- `error_message` — the caught error string

### `recommendation_clicked`
*Defined in schema — wired via `asset_card_clicked` with `context: 'related'` for now.*
Full properties (for future dedicated implementation):
- `source_asset_id` — the asset the user just signed up for
- `clicked_asset_id`
- `clicked_asset_type`
- `position` — rank in the related list

### `recently_viewed_cleared`
Fired when user clicks "Clear" in the Recently Viewed section.
Properties:
- `item_count` — how many items were cleared

---

## Conversion Funnel

```
Homepage
  → asset_card_clicked (context: homepage_featured | homepage_recently_viewed)

Assets Page
  → filter_applied, search_used, sort_changed, load_more_clicked
  → asset_card_clicked (context: assets_page)

Signup Page
  → signup_started        [intent signal — user opened the form]
  → signup_submitted      [commitment signal — user hit submit]
  → signup_completed      [conversion — API confirmed]
  → recommendation_clicked [post-conversion engagement]
```

**Key funnel metrics to monitor:**
- `asset_card_clicked → signup_started` rate (do users who click actually engage with the form?)
- `signup_started → signup_submitted` rate (form abandonment — field count, label clarity)
- `signup_submitted → signup_completed` rate (API reliability / error rate)
- `signup_completed → recommendation_clicked` rate (post-conversion content appetite)

---

## What Would Be Added in a Production Build

### Scroll depth tracking
```typescript
{ event: 'scroll_depth_reached'; properties: { depth: 25 | 50 | 75 | 100; page: string } }
```
Implemented via `IntersectionObserver` on sentinel elements at 25/50/75/100% of page height. Critical for measuring whether users see below-the-fold content like featured resources or browse-by-type.

### Time to convert
```typescript
{ event: 'time_to_convert'; properties: { asset_id: string; seconds_from_first_view: number } }
```
Captures the delta between `asset_card_clicked` (or page load) and `signup_completed`. High values indicate friction; sudden spikes after a copy change are a regression signal.

### Form field abandonment
```typescript
{ event: 'form_field_abandoned'; properties: { field: string; filled: boolean } }
```
Fires on `blur` when a field is left empty or invalid. Identifies which fields cause the most drop-off. Classic conversion finding: job title fields reduce completion rates ~8–12% in B2B lead-gen.

### Search with no results
Already partially captured via `search_used` (result_count: 0). Would add a dedicated:
```typescript
{ event: 'search_no_results'; properties: { query: string } }
```
These queries route to a content team dashboard as unfulfilled intent signals.

### Session identity
A lightweight anonymous session ID (UUID in `sessionStorage`) would let us stitch events from the same session without PII. Critical for funnel analysis. Would attach `session_id` to every event payload.

### UTM parameter capture
```typescript
{ event: 'session_started'; properties: { utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string } }
```
Captures marketing attribution on page load. Maps newsletter links → signup completions.

### Rage click detection
Fires when the same element receives 3+ clicks within 500ms. Signals broken UI elements or frustrated users. Typically implemented via a global `mousedown` listener tracking coordinates.

### A/B test exposure event
```typescript
{ event: 'experiment_exposure'; properties: { experiment_id: string; variant: string; asset_id?: string } }
```
Would be the foundation for any Meridian experimentation layer. Every variant assignment fires this event before the user sees the variant. Lets us compute clean intent-to-treat ratios rather than post-hoc conversions.

---

## Experimentation Opportunities

The instrumentation above is designed to support the following hypothesis-driven A/B tests:

| Hypothesis | Primary metric | Secondary metric |
|---|---|---|
| "Get Access" CTA → "Watch Now" / "Read Now" by type | `asset_card_clicked` rate | `signup_completed` rate |
| Sticky signup module on Signup page vs. current layout | `signup_started` rate | `signup_completed` rate |
| Featured section uses 3 cards vs. 4 cards vs. editorial hero | `asset_card_clicked` rate | Time on page |
| Remove job title from signup form | `signup_completed` rate | Lead quality (offline) |
| Search visible on homepage hero vs. only on listing page | `search_used` rate | `asset_card_clicked` from homepage |
| Recently Viewed section positioned above vs. below Featured | `recently_viewed` CTR | `signup_completed` rate |

---

## Analytics Stack Assumptions

The current implementation pushes to `window.dataLayer`, which is the standard GTM input. In a production build:

- **GTM** would route events to GA4, Segment, Amplitude, or all three
- **Segment** would fan out to a data warehouse (Snowflake/BigQuery) for funnel SQL queries
- **GA4** would handle real-time dashboards and audience building
- **Amplitude/Mixpanel** would handle cohort analysis and retention flows

The typed `AnalyticsEvent` union in `analytics.ts` would become the source of truth for a Segment tracking plan document, ensuring no event name drift between frontend and analytics tooling.
