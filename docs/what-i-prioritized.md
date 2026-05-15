---

# What I Prioritized — and Why

## The Role Lens

This is a UX Engineer (Growth & Experimentation) role. That framing shaped every prioritization call I made. A growth and experimentation engineer isn't primarily a UI builder — they're a systems thinker who builds measurable, hypothesis-driven product surfaces. I tried to make that evident in the work itself, not just in the documentation around it.

---

## The Listing Page as the Primary Surface

The Resource Library (`/assets`) received the most investment: type filtering with URL sync, debounced search with result-count tracking, sort, load-more pagination, skeleton loading, empty states, sticky controls bar, search highlighting, and analytics instrumentation on every interaction.

**Why:** It's the highest-leverage conversion surface in the product. Every event instrumented here — `filter_applied`, `search_used` with result count, `sort_changed`, `load_more_clicked`, `asset_card_clicked` with position and context — maps directly to a testable hypothesis. Zero-result search queries are a content gap signal that routes to a content team roadmap. Position data on card clicks answers position bias questions before you run a card-ranking experiment. None of that analysis is possible without proper instrumentation, and the instrumentation only works if the component structure is clean enough to fire discrete, attributable events.

---

## The Signup Form as a Minimal-Friction Conversion Point

Five fields, inline validation on change, no page redirect on success. The form was kept deliberately lean.

**Why:** B2B lead-gen forms are where conversion rates die. Each additional required field is a measurable drop-off point. The inline success state — confirmation shown in the same layout without a page reload — eliminates the "where did my submission go?" moment that causes users to second-guess whether their form actually went through. The related resources section after signup is a post-conversion engagement hook, not decoration: it extends session time and creates a second conversion opportunity without any additional acquisition cost.

The form also anchors the first experiment I'd run in production: remove job title, measure `signup_completed` rate against baseline. The `signup_cta` experiment already running ("Get Access" vs. "Register Now") tests whether imperative framing outperforms access framing on the primary CTA — a classic B2B conversion hypothesis.

---

## Analytics Instrumentation and Experiment Infrastructure Over More UI Polish

I invested in a typed analytics bus (`analytics.ts`), an experiment registry (`experiments.ts`), and a variant assignment hook (`useVariant`) rather than adding additional visual features.

**Why:** The job title is Growth & Experimentation. An evaluator looking for someone who "already thinks like a modern UX Engineer focused on experimentation" needs to see that thinking in the artifact itself — not only described in a README. The `useVariant` hook with stable localStorage assignment, the `experiment_exposure` event, and the centralized experiment registry aren't decorative additions. They're the plumbing that makes A/B tests possible without rebuilding infrastructure for each one. Two experiments are currently running. Adding a third means two lines in `experiments.ts` and one `useVariant` call at the relevant callsite.

---

## The Meridian Sub-Brand Over Reproducing BHR

I built a distinct sub-brand — *Meridian Health Intelligence* — rather than reproducing the Becker's Hospital Review visual identity.

**Why:** A resource library is a separate product with a different editorial purpose than a news publication. Reproducing BHR's exact treatment would have produced a themed template, not a product decision. A sub-brand required making intentional calls about name, palette, and tone that could be defended on product grounds. "Meridian" implies orientation, precision, and expertise — appropriate for a library of clinical and operational content aimed at healthcare decision-makers. The palette was derived from BHR's token system (same navy family, similar type hierarchy) rather than invented wholesale, so it reads as related without being identical.

---

## Recently Viewed as Lightweight Personalization Without Server State

`useRecentlyViewed` (localStorage, capped at 4, with a clear button) was built rather than any server-side personalization pattern.

**Why:** No authentication exists in this product, so there's no user identity to attach server-side state to. localStorage delivers the full personalization value — returning users find where they left off in fewer clicks — with zero backend changes. It also adds a `homepage_recently_viewed` context to `asset_card_clicked`, which means returning user behavior is segmentable from new visitor behavior in any downstream analysis. That segmentation would matter in a real experiment: a homepage layout test should be able to separate "new visitor clicked featured card" from "returning visitor clicked recently viewed card" without a post-hoc data join.

---

## What I Intentionally Left Out

**`page_viewed` tracking.** Requires a scroll-listener component inside `<BrowserRouter>` to access React Router's location context. The event is defined in the analytics schema and documented in `docs/analytics-plan.md`. Skipped because wiring it properly takes more infrastructure than the value justifies here.

**Scroll depth tracking.** Needs `IntersectionObserver` sentinels at 25/50/75/100% of page height. Documented as a production addition. Would matter most for measuring whether users see below-the-fold content like the Browse by Type section.

**Form field abandonment per field.** Needs `onBlur` handlers tracking which fields were left empty or invalid. Documented in `analytics-plan.md`. The gap between `signup_started` and `signup_submitted` already captures overall form abandonment; per-field abandonment adds diagnostic precision that isn't necessary to demonstrate the pattern.

**UTM parameter capture.** Relevant for a real B2B content marketing product — you want to know which newsletter link drove which signup. Deferred because there's no live campaign to attribute. The event shape (`session_started` with `utm_source`, `utm_medium`, `utm_campaign`) is documented.

**A production feature flag service.** The `useVariant` hook uses `Math.random()` + localStorage rather than LaunchDarkly, Statsig, or GrowthBook. The hook's architecture (stable assignment, exposure event, centralized registry) maps directly to how those services work — it's designed to be swapped out, not extended. The limitation is that localStorage-based assignment can be cleared, causing holdout group leakage in a long-running experiment. Acceptable for a take-home; not for a production growth team.
