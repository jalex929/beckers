# Meridian Health Intelligence — Take-Home Write-Up Content Bank

**Author:** Jay Fox  
**Role:** UX Engineer, Growth & Experimentation — Becker's Healthcare  
**Live site:** https://fox-beckers.netlify.app  
**GitHub:** https://github.com/jalex929/beckers

---

## 1. What's In Scope

### Homepage

The homepage opens with a full-width hero that runs a live A/B experiment on CTA copy. Variant A reads the control copy; Variant B reads an action-oriented alternative. Assignment is stable per-user via localStorage and exposure is fired once per session via a sessionStorage guard. Below the hero, Featured Resources are pulled from the live API and rendered as cards. A Browse by Type grid lets users navigate directly to the filtered Resource Library. A Recently Viewed rail at the bottom tracks the last four assets a user visited, persists via localStorage, and includes a "Clear history" control.

### Resource Library

The library is built around four coordinated interaction surfaces. A multi-select type filter lets users combine content types (e.g. Whitepapers + Podcasts simultaneously) — active selections sync to the URL via `useSearchParams`, so filtered views are shareable and browser back returns to the exact filter state, not the root page. A debounced search input (300ms) fires over the filtered result set and highlights matching terms inline in each card title. A sort control offers 'Coming up soon' (filters to future-dated assets only, sorted ascending) alongside the default order. Pagination uses a load-more pattern at 9 assets per page; a "Showing X of Y" result count is always visible. A skeleton loading state holds layout stable during fetches and communicates the shape of incoming content before it arrives. The filter bar is sticky on scroll.

### Signup Page

The signup page is structured in two columns: an asset detail panel on the left showing the resource name, type, and description; a 5-field signup form on the right. Inline validation fires on submission and surfaces field-level error messages without page reload. On a successful POST, the form is replaced with an inline confirmation state that shows the `signupDate` returned by the API — no redirect. A Related Resources rail below the fold surfaces other assets of the same type. A back-link restores the exact filter state the user came from, using the URL search params passed through the navigation.

### Analytics Event Bus

A typed event bus covers the full conversion funnel with 12 actively firing events: `asset_card_clicked`, `filter_applied`, `search_used`, `sort_changed`, `load_more_clicked`, `signup_started`, `signup_submitted`, `signup_completed`, `signup_failed`, `recommendation_clicked`, `recently_viewed_cleared`, and `experiment_exposure`. A thirteenth event — `page_viewed` — is defined in the schema but not yet wired (covered in Section 2). Every event fires to `window.dataLayer` in GTM-compatible format with a consistent shape: event name, timestamp, and a typed payload. The schema is documented in `docs/analytics-plan.md`.

### Experiment Infrastructure

A `useVariant` hook handles variant assignment, exposure deduplication, and retrieval. Assignment is stable via localStorage keyed to experiment ID. Exposure events fire once per session via a sessionStorage guard to prevent inflation. The experiment registry is a single typed object — adding a new experiment is one entry. Two experiments are running: `hero-cta` (hero button copy — control: 'Browse the Resource Library' / variant: 'Explore Resources') and `signup-cta` (signup form submit button copy — control: 'Get Access' / variant: 'Register Now'). The architecture mirrors how a production feature flag client like LaunchDarkly or Statsig would be structured, with the localStorage backend standing in for a flag service.

### Test Suite

31 tests across 5 files, written with Vitest. Coverage includes: the Header (nav links, brand mark), the Footer (nav links, tagline), the Homepage (hero rendering, Recently Viewed behavior, clear action), the Resource Library (filter chips, search input, sort options, load-more, result count), and the Signup form (form fields, validation, submission flow, speaker rendering, inline success state). Analytics and experiment hook coverage is documented but not yet unit-tested — those are integration concerns better validated against a live analytics destination.

### Documentation

Four documents in `docs/`: a decision log covering 13 architectural decisions with rationale and tradeoffs; an analytics plan documenting the full event schema; a what-I-prioritized document that is honest about the sprint boundary; and a react-usage document explaining component and hook patterns.

---

## 2. What's Out of Scope

Each of the following was explicitly considered and deferred — not overlooked.

**Authentication / user identity.** No auth layer means no server-side personalization and no persistent user profiles. localStorage was the right call given the constraints: it gives stable variant assignment and "recently viewed" history without the overhead of an auth flow. In production, I'd stitch localStorage identity to a server-side user ID on first login.

**Live analytics results.** `window.dataLayer` fires correctly on every interaction. No GTM container, GA4 property, or Amplitude destination is connected, so no data persists. The instrumentation is production-ready; the pipeline isn't wired. This is the highest-priority gap (see Section 7).

**Production feature flag service.** `useVariant` mirrors the client API of LaunchDarkly or Statsig, but localStorage assignment creates holdout leakage risk — a user who clears localStorage gets re-assigned, which inflates variant exposure and makes holdout analysis unreliable. The leakage risk is documented in the decision log. Replacing the storage backend with a real flag service is a one-file change by design.

**`page_viewed` event.** The event is defined in the schema and included in the analytics plan. Firing it correctly requires a scroll-listener component mounted inside BrowserRouter to catch route transitions. The wiring is straightforward but requires a component that lives above the page layer — deferred because it didn't block the conversion funnel events that matter more for this submission.

**UTM parameter capture.** The `session_started` event shape has a `utm_source` / `utm_medium` / `utm_campaign` field documented. No live campaign exists to attribute, so the capture logic wasn't wired. In production, this would be the first thing added alongside any paid distribution.

**Scroll depth tracking.** IntersectionObserver sentinels on the Resource Library and Homepage would fire `scroll_depth` events at 25%, 50%, 75%, and 100%. Documented as a production addition; not wired in this submission.

**Per-field form abandonment.** Overall abandonment is capturable from the `signup_started` → `signup_submitted` gap. Field-level abandonment (which field caused the dropout) requires `onBlur` handlers per field. The architecture supports it; the implementation was deprioritized in favor of the submission and success flow.

**Rage click detection, session identity stitching.** Both are meaningful growth analytics primitives but belong to a session recording layer (FullStory, LogRocket) rather than a home-built event bus. Not in scope for a take-home.

---

## 3. How I Built It — Stack

**Frontend:** React 18, TypeScript, Vite. React Router v6 handles routing, with `useSearchParams` doing the work of syncing filter state to the URL. CSS Modules provide component-scoped styles backed by a `:root` custom property token system in `index.css`. All contrast ratios are annotated inline in the token definitions so the accessibility intent is readable directly in the source — not buried in a spreadsheet.

**Backend:** Express + TypeScript, provided as part of the assignment brief. Not authored by me; deployed as-is with environment variable configuration for production.

**Testing:** Vitest for the frontend test suite. The backend ships with Jest; those tests were not modified.

**Deployment:** Netlify for the frontend (auto-deploys from GitHub main, zero Vite configuration required), Railway for the backend (same pattern — push to main, server restarts automatically). Both deployments are live and connected to the same GitHub repository.

**Version control / CI:** GitHub. Every commit to main triggers both the Netlify frontend build and the Railway backend deploy automatically. There is no separate CI pipeline; the deployment platforms handle it.

**Analytics target:** `window.dataLayer` in GTM-compatible format. Any GTM container connected to the page would immediately receive all events with no further instrumentation changes.

**On CSS Modules over Tailwind:** Tailwind's utility classes distribute design decisions across every component file. A `:root` token system in one `index.css` file puts every color, spacing step, and type size in one auditable location. When a contrast ratio needs to change or a token gets renamed, the change is made once. Design intent — why this blue, why this spacing — is readable in comments adjacent to the token definition, not inferred from a class name.

---

## 4. AI & Tools Workflow

### ChatGPT — strategic and editorial layer

ChatGPT served as the project's product strategist before a line of code was written. It interpreted the assignment brief and extracted the implicit evaluation lens — what "Growth & Experimentation" signals to an engineering hiring manager, what the gap between a polished UI submission and a systems-thinking submission looks like, and what artifacts (decision log, analytics plan, experiment infrastructure) would make that gap visible. The structured markdown that became the working rules, documentation templates, and implementation guidelines Claude Code built from was generated in ChatGPT first.

Beyond initial setup, ChatGPT handled branding pressure-testing (color theory applied to the palette decision, mockups of gold-on-dark vs. gold-on-light to confirm contrast choices before committing), architecture structuring (tool role separation, token budget planning across all three tools), and troubleshooting Bolt.new visual issues without consuming Claude tokens. That last point was a deliberate cost management decision: ChatGPT is better at high-level reasoning and document generation; routing those tasks away from Claude Code kept Claude focused on implementation and prevented expensive back-and-forth on non-code work.

### Claude Code (CLI) — implementation layer

Claude Code owned all TypeScript: page components, custom hooks, the analytics event bus, the experiment registry, form logic, and routing. It also owned all tests, all documentation in `docs/`, and all build and deployment configuration. Every task handed to Claude Code arrived as a precise, well-specified instruction generated from the working rules ChatGPT produced — which meant less iteration, fewer correction loops, and more consistent output.

### Bolt.new — visual design layer

Bolt.new owned all CSS: `index.css` (the global token system and `:root` variables) and every `*.module.css` component style file. It implemented the visual design while Claude Code implemented the logic, with a clear file ownership boundary: Bolt never touched TypeScript, Claude never touched CSS while Bolt was active. This prevented merge conflicts and kept both tools operating in the domain where they perform best.

### Netlify and Railway — deployment layer

Both platforms connect directly to GitHub main with zero additional configuration. Netlify handles the Vite build and SPA routing fallback. Railway handles the Express server with environment variables set in the dashboard. The practical effect is that every commit to main is a deploy — no separate deploy step, no CI configuration file to maintain.

### Why tool role separation matters beyond efficiency

The boundary between ChatGPT, Claude Code, and Bolt.new wasn't arbitrary — it mirrors how a cross-functional growth team actually operates. ChatGPT played product: setting direction, defining requirements, making strategic calls. Claude Code played engineering: building to spec, writing tests, maintaining documentation. Bolt.new played design: owning the visual layer without coupling it to implementation decisions.

The tool boundaries were the workflow's API contracts. Just as a design handoff spec defines what engineering receives without dictating how it's built, the rules document ChatGPT produced defined what Claude Code received without dictating how to implement it. This structure scales because each role has a clear interface — it breaks down when any single tool tries to do everything and the interfaces collapse. Growth teams fail the same way: when engineering owns product decisions by default because no one else is in the room, or when design gets applied after engineering ships and the constraints are already set.

---

## 5. Why I Made These Decisions — Key Rationale

### Color system

**Considered:** Reproducing BHR's palette directly, building a brand from scratch with no reference, or deriving from their existing token system while building a distinct identity.

**Chose:** Derived from BHR's token system, built as a standalone brand.

**Why:** The primary structural pair is analogous navy and teal — neighbors on the color wheel with a shared blue base. They read as unified without being identical, which is appropriate for a sub-brand or product family relationship. Gold functions as a split-complementary accent: it sits in the opposite direction from the blue family on the wheel, which creates contrast without tension. Gold is reserved exclusively for dark backgrounds where it achieves a 7.30:1 contrast ratio against the dark navy. Gold on white fails WCAG AA and — more practically — breaks the hierarchy by pulling attention away from content. Warm neutral surfaces (#F7F5F2) read as editorial, like a quality publication, rather than clinical, like a hospital interface. All ratios are annotated inline in `index.css` adjacent to the token definition.

**Tradeoff:** This palette diverges from the literal BHR visual identity. The mitigation is intentional: the same type scale and navy family mean both products read as peers from the same design foundation. A reviewer looking at both would recognize the relationship without mistaking one for the other.

### Load-more vs. infinite scroll

**Chose load-more.** Infinite scroll produces ambiguous analytics: a `scroll_depth` event doesn't tell you how many assets a user saw. Load-more produces attributable events. `load_more_clicked` fires with `page_number`, `visible_count`, and `total_count`, so you can answer "what percentage of users who viewed 9 results chose to load more" as a discrete funnel step. The "Showing X of Y" count gives users enough information to make an informed decision before committing to loading more content — which is a meaningful UX difference, not just a visual one.

### URL-synced filter state

**Chose `useSearchParams` over component-local state.** A shareable filtered URL is a product feature: a user who finds the right filter combination can send that link to a colleague. Browser back returns to the exact filter state, not the library root, which is what users expect and what local state can't deliver. This also means the Signup page's back-link can restore filter state by passing the search params through navigation — behavior that falls out naturally from URL state and requires explicit work to replicate with local state.

### Inline form success state vs. redirect

**Chose inline confirmation, no redirect.** A redirect after form submission introduces a moment of ambiguity: the user doesn't know whether the submission succeeded or where they were taken. An inline success state with the `signupDate` from the API response is unambiguous — the form was here, now the confirmation is here, the date proves it was received. This is especially important when the call to action is "access a resource" — users should see confirmation of access in context, not navigate to a confirmation page that requires them to navigate back.

### Skeleton loading vs. spinner

**Chose skeletons.** A spinner communicates "something is loading" with no information about what's coming. Skeletons communicate the shape of the incoming content and hold layout stable, which eliminates the reflow that causes the visual pop when content arrives. For a card grid specifically, a spinner would be replaced by a dramatically different layout — skeletons prevent that jump.

### Manual form state vs. react-hook-form

**Chose manual state management.** Five fields. The registration overhead of a form library — schema definition, resolver configuration, controlled vs. uncontrolled pattern selection — exceeds the benefit at this scale. The `handleChange` pattern is explicit, auditable, and requires no library knowledge to understand. If the form grew to 12 fields with conditional sections, that calculus reverses.

### Sort labels: semantic intent over directional labels

**Considered:** Generic "Newest first" / "Oldest first" controls on executionDate · Two named sorts addressing distinct user intents

**Chose:** "Coming up soon" (filters to future-dated assets only, then sorts ascending by executionDate) and "New to the library" (lastModifiedDate descending)

**Why:** "Newest first" by executionDate descending is misleading — it surfaces events furthest in the future, which is the opposite of what someone scanning for something imminent wants. The labels described sort direction rather than user intent. Two distinct user needs exist on a content library: someone planning their schedule wants the soonest upcoming event first; someone browsing for fresh reading wants the most recently published content first. These are different fields and different directions. Naming them by intent rather than direction makes the control self-documenting.

"Coming up soon" filters rather than sorts: only assets with a future executionDate appear in this view. Whitepapers and podcasts without an execution date are excluded entirely — they have no meaningful "upcoming" status, and placing them at the bottom of a "coming up soon" list would make the control feel broken. Past events are also excluded: showing a webinar from three months ago in a "coming up soon" view erodes trust in the control. The result count updates to reflect only the filtered set, which is the honest answer to the question the user is actually asking.

**Tradeoff:** Two specific options instead of a single reversible toggle. The tradeoff is intentional — specificity produces better engagement than vague directional controls.

### Type filter: multi-select toggle vs. single-select

**Considered:** Radio button behavior (one type at a time) · Toggle behavior (any combination active simultaneously)

**Chose:** Multi-select toggle — clicking a type adds it to the active set, clicking again removes it, "All" clears everything.

**Why:** Single-select forces a user who wants to browse whitepapers and podcasts together to switch back and forth. That's two trips through the filter UI to accomplish one browsing goal. Multi-select removes that friction. Active filters sync to URL via multiple `type` params, so combined views are shareable — a user can send a link that opens to Whitepapers + Podcasts simultaneously. The analytics event captures the full active set as a comma-joined string, so filter combinations are attributable in downstream analysis, not just individual type clicks.

**Tradeoff:** The chip active state needs to clearly communicate "multiple things selected" — a visual treatment that only highlights one chip at a time would confuse users in a multi-select context. CSS handles the visual; the logic is correct regardless.

### "New to the library": sort without a date cutoff

**Considered:** Filter to assets modified within the last 30/60/90 days · Sort all assets by lastModifiedDate descending with no exclusion

**Chose:** Sort only — no hard date window.

**Why:** A hard cutoff on a demo dataset with fixed seed dates risks producing empty results for reasons that have nothing to do with user intent. More importantly, "new" is relative to the publishing cadence of the content team — the right threshold for a team publishing daily is different from one publishing monthly. Baking in a 30-day constant would be wrong for half of real cases. The sort gives users the directional signal without the brittle cutoff.

**What this becomes in production:** A configurable recency threshold (CMS setting or feature flag) paired with a "New" badge on cards for content within that window. The badge and the sort would work together: the badge gives a scannable signal while browsing; the sort puts newest items at the top regardless of other active filters.

**Tradeoff:** The "New to the library" label is only honest when the content team is actively publishing. If nothing has been added recently, the sort surfaces old content under a "new" label. Acceptable for a take-home; the badge system resolves this in production.

---

## 6. Prioritizing Learning + Shipping Good Over Perfect

The goal was to ship something that demonstrates how I think, not to achieve perfection. Growth engineers don't optimize for polish — they optimize for measurable hypotheses and the infrastructure to test them. What "good" means in this context is a working product, documented tradeoffs, instrumented interactions, and two live experiments with a clear architecture for adding more. Every decision I didn't make is documented as an explicit out-of-scope item with the rationale for deferring it. That's the same discipline a sprint team applies when writing acceptance criteria: define the boundary, ship to it, measure, decide whether to expand it next sprint.

The test suite isn't about proving the code is correct — it's about making iteration safe for the next person or the next sprint. Tests that cover content correctness (what text renders, what event fires, what state updates) catch the regressions a fast-moving team produces when touching adjacent code. The decision log isn't a postmortem — it's the kind of artifact a growth team expects to have before running an experiment on a surface, because it makes the constraints visible to everyone who might propose a change later.

If I had approached this as a UI polish exercise, I would have spent more time on visual refinement and less time on the analytics event bus and experiment infrastructure. But a polished UI without measurable hypotheses isn't what the Growth & Experimentation role is asking for. The instrumentation is the product for a growth team. What I'd do differently: spend less time on the visual layer and get the analytics pipeline actually wired to a destination, so the data the events generate is visible and actionable rather than firing into a dead window object.

---

## 7. If I Had More Time

Prioritized by growth value:

1. **Connect `window.dataLayer` to a real analytics destination.** GTM to GA4, or direct to Segment. The instrumentation fires correctly on every interaction; nothing captures it. This is the single change that turns the experiment infrastructure from a demonstration into a working measurement system.

2. **Replace localStorage variant assignment with a production feature flag service.** Statsig or GrowthBook. LocalStorage assignment creates holdout leakage — a user who clears storage gets re-assigned, which inflates exposure counts and makes holdout analysis unreliable. Both Statsig and GrowthBook have React SDKs that mirror the `useVariant` hook's API. The swap is a one-file change by design; the hook signature doesn't need to change.

3. **Wire `page_viewed` via a scroll-listener component inside BrowserRouter.** The event is defined in the schema. The implementation requires a component mounted above the page layer that listens to route transitions and fires the event. Straightforward work that was deprioritized in favor of conversion funnel events.

4. **UTM parameter capture on `session_started`.** Needed for any real campaign attribution. The event shape has the fields; the capture logic reads `URLSearchParams` on session init and attaches source, medium, and campaign to the event payload.

5. **Accessibility focus-state pass.** Keyboard navigation works. Visible focus rings at 390px and 1280px need a dedicated pass — particularly the filter chips, card grid, and form fields, which all have interactive states that should be verified against WCAG 2.4.7 at both breakpoints.

6. **Per-field form abandonment tracking.** `onBlur` handlers on each form field firing a `signup_field_abandoned` event with the field name. Overall abandonment is visible from the `signup_started` → `signup_submitted` gap; field-level precision would tell you which specific field causes the most dropout — the kind of diagnostic that informs a copy or UX experiment on the form.

---

## 8. How I Contribute on a Team

**Tool role separation as team model.** The three-tool workflow in this project — product/strategy, engineering/implementation, design/visual — maps directly to how I'd work on a cross-functional growth team. Clear interfaces between roles mean less coordination overhead and fewer decisions made by default because no one else was in the room. I'm comfortable operating in all three layers and equally comfortable defining which layer a given decision belongs to.

**Documentation culture before the sprint ends.** The decision log, analytics plan, and what-I-prioritized document were written as part of the sprint, not after it. Documentation written after the fact reconstructs decisions from memory; documentation written during the sprint records why the decision was made while the context is still live. The next sprint doesn't re-litigate decisions that are already explained.

**Analytics-first component design.** Events are instrumented at build time, not bolted on in QA. Every interactive component in this project fires a typed event as part of its interaction handler — not as an afterthought. That means the analytics contract is part of the component's interface, which makes it testable and makes omissions visible during code review.

**Test suite as team infrastructure.** The 27 tests in this suite aren't primarily about correctness — they're about making the next sprint safer. Tests that cover what text renders and what events fire catch the regressions a fast-moving team produces when touching adjacent components. A growth team ships frequently; the test suite is what makes that speed sustainable.

**Explicit tradeoffs as a communication tool.** I document what I chose not to build and why. This isn't defensive — it's a communication artifact. When a stakeholder asks "why doesn't the form track which field users abandon?" the answer isn't "we didn't have time" — it's "we captured overall abandonment and documented per-field tracking as the next iteration, here's the implementation path." That framing keeps conversations focused on prioritization rather than blame.
