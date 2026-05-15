---

# Decision Log

A record of non-obvious decisions made during this project — what was considered, what was chosen, and the reasoning behind each call.

---

## 1. Standalone brand vs. replicating Becker's Hospital Review

**Options considered:** Reproduce the BHR visual identity directly · Create a distinct sub-brand

**Chosen:** Standalone product brand — *Meridian Health Intelligence*

**Why:** A resource library is a separate product with a different editorial purpose than a news publication. Reproducing BHR directly would have produced a themed template, not a product decision. Building a standalone brand required making intentional choices about name, palette, and voice that could be defended on product grounds rather than inherited from a reference. The palette was derived from BHR's token system — same navy family, similar type hierarchy — not because Meridian is a sub-brand, but as a deliberate design exercise showing that a new system can be built from an existing one coherently. Structurally: analogous navy + teal as the primary pair, gold as the split-complementary accent, warm neutrals as the editorial surface.

**Trade-off accepted:** Diverges from the literal design system reference. Mitigated by deriving the palette from BHR's token system so the two products read as peers built from the same foundation, not as unrelated designs.

---

## 2. CSS Modules vs. Tailwind

**Options considered:** Tailwind utility classes · CSS Modules backed by a `:root` token system

**Chosen:** CSS Modules

**Why:** Design tokens need a single authoritative source. With Tailwind, tokens scatter into utility classes and the canonical source of truth fragments across every file that uses them. With CSS Modules backed by a single `:root` block in `index.css`, every token is auditable in one place and component styles reference the system rather than re-encode it. Contrast ratios for every color pair are annotated inline so any contributor can audit WCAG compliance without running a separate tool. Also relevant: Tailwind's generated class names obscure design intent in ways that matter when the code is being read and evaluated.

**Trade-off accepted:** More verbose than Tailwind for layout utilities. Worth it for token system legibility.

---

## 3. URL-synced filter state vs. component state only

**Options considered:** Keep filter state entirely in React component state · Sync to URL search params via `useSearchParams`

**Chosen:** URL search params

**Why:** Shareable filtered URLs are a product feature, not an implementation detail. A user who filters to "Live Webinars" and sends the link should land on the same filtered view. Browser back/forward also behaves correctly — back from a signup page returns to the filtered list, not an unfiltered one. The cost is one `setSearchParams` call in the filter handler.

**Trade-off accepted:** Filter param names become part of the URL contract. Renaming a param is a breaking change for bookmarked filtered URLs. Acceptable at this scale; would need a redirect layer at production scale.

---

## 4. Load-more pagination vs. infinite scroll

**Options considered:** Infinite scroll via `IntersectionObserver` · Load-more button · Traditional page numbers

**Chosen:** Load-more button

**Why:** Infinite scroll hides the total result count from users and makes knowing "I've seen everything" impossible. It also produces ambiguous analytics: did the user want more content, or did they just scroll past the trigger? A button is explicit. The `load_more_clicked` event fires with `page_number`, `visible_count`, and `total_count` — so you can measure whether users are paginating to find something specific or scrolling through everything. The "Showing X of Y resources" count above the grid gives users enough information to decide whether to refine their search or keep paginating.

**Trade-off accepted:** Marginally more friction than infinite scroll for passive browsing. The result count compensates by making the decision to paginate legible.

---

## 5. Typed analytics bus vs. direct SDK calls at each callsite

**Options considered:** Call `window.gtag()` or a vendor SDK directly wherever tracking is needed · Centralized typed wrapper

**Chosen:** Centralized typed wrapper (`client/src/utils/analytics.ts`)

**Why:** Direct SDK calls scatter event names and property shapes across the codebase with no enforcement. A discriminated union in TypeScript means the compiler rejects malformed events at the callsite — wrong property name, missing required field, or mistyped value all fail at build time, not in production data pipelines. The union also makes the event schema a first-class document: the type definition is the tracking plan, and it lives next to the implementation. Tracking plan drift between frontend code and analytics tooling is one of the most common and costly data quality problems in growth teams.

**Trade-off accepted:** One additional indirection layer at every tracking callsite. Worth it.

---

## 6. localStorage for recently viewed vs. server-side session

**Options considered:** Server-side user session with persistent history · localStorage only

**Chosen:** localStorage

**Why:** No authentication layer exists, so there's no user identity to attach server-side state to. localStorage delivers the full personalization value — returning users find where they left off in fewer clicks — with zero backend changes. The `homepage_recently_viewed` context on `asset_card_clicked` also means returning user behavior is segmentable from new visitor behavior in analytics without any additional work. Cap at 4 items keeps the recently viewed rail compact and avoids a long list that competes with Featured Resources for attention.

**Trade-off accepted:** History doesn't persist across devices or browsers, and is lost when localStorage is cleared. Acceptable for a content discovery use case where the cost of a miss is a slightly longer browse session, not a lost transaction.

---

## 7. Minimal useVariant hook vs. third-party feature flag service

**Options considered:** Integrate LaunchDarkly, Statsig, or GrowthBook · Build a minimal variant hook

**Chosen:** Minimal `useVariant` hook (`client/src/hooks/useVariant.ts`)

**Why:** Third-party services require API keys, network calls on page load, and SDK bundle overhead — disproportionate for a take-home demonstrating the pattern. The hook's architecture (stable localStorage assignment, `experiment_exposure` event via sessionStorage guard, centralized experiment registry in `experiments.ts`) mirrors exactly how production services work. Swapping in a real service means replacing the `pickVariant` + localStorage logic with an SDK assignment call and keeping everything else — the registry, the exposure event, the variant consumption pattern — identical.

**Trade-off accepted:** localStorage-based assignment can be cleared, causing users to be re-bucketed and polluting experiment data with variant switches. In a real growth system this causes holdout group leakage and inflates variance. Known limitation; acceptable here.

---

## 8. Deterministic pseudo-random registration count vs. real API count

**Options considered:** Fetch signup count from API · Hardcoded static number · Deterministic hash from asset ID

**Chosen:** Deterministic hash from asset ID

**Why:** The API doesn't expose a signup count endpoint. A hardcoded number would be identical on every asset, which reads as a placeholder rather than real data. A hash-derived count (50–199, consistent per asset across renders) makes the social proof element credible and distinct per asset. The function is named `getRegistrationCount` and the derivation is visible in the source — it doesn't pretend to be real data. In production this would be a field on the GET `/assets/:id` response.

**Trade-off accepted:** Not real data. Transparency in the implementation mitigates the risk of this being read as fabricated social proof.

---

## 9. Vitest vs. Jest for frontend tests

**Options considered:** Jest (already used for backend tests) · Vitest (native Vite integration)

**Chosen:** Vitest

**Why:** The frontend runs on Vite. Vitest shares the same config, transform pipeline, and module resolution — CSS modules, path aliases, and TypeScript all work without additional configuration. Jest requires a separate Babel or ts-jest setup that duplicates the Vite pipeline and frequently diverges from it in subtle ways that produce "passes in test, fails in browser" situations. The test suite focuses on content correctness (static copy, form labels, nav links, filter button labels) because those are the regressions a take-home produces — renamed copy strings or removed elements, not logic bugs.

**Trade-off accepted:** Two test runners in the monorepo (Jest for the Express backend, Vitest for the React frontend). They're different environments with different requirements; unifying them would require compromising one setup for the other.

---

## 10. `location.state` for back-navigation vs. browser history

**Options considered:** Rely on `window.history.back()` · Pass the source URL via React Router `location.state`

**Chosen:** `location.state`

**Why:** `window.history.back()` is fragile — it goes back one step in browser history regardless of whether that step is in this application. A user who deep-links directly to an asset detail page and clicks "Back" would navigate to wherever they came from before the app, not to the resource library. `location.state.from` is set explicitly when a card is clicked (capturing the current path + search params at click time) and read on the signup page to construct the back link. This means "← Back to Resources" always returns to the exact filtered/searched listing state the user was in, not just the listing page root.

**Trade-off accepted:** Only works when navigating within the app via the card's Link component. Direct links or page refreshes fall back to `/assets`. The fallback is intentional and handled explicitly.
