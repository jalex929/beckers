# React Usage in Meridian Health Intelligence

**Stack:** React 18 + TypeScript + Vite + React Router v6

This document explains the React patterns used in this project and the reasoning behind each choice. It is written for a technical reviewer who wants to understand engineering decisions, not just what the code does.

---

## 1. Component Architecture

The codebase has a two-layer component model:

- **Pages** (`client/src/pages/`) — stateful orchestrators. They hold state, call custom hooks, and compose presentational components. `HomePage`, `AssetsPage`, and `SignupPage` are the three pages.
- **Components** (`client/src/components/`) — presentational. `Header`, `Footer`, `AssetCard`, `AssetBadge`, and `SkeletonCard` receive props and render UI. They own no state that matters outside themselves.

This split is not a stylistic preference — it is a load-bearing architectural decision. Pages know about routing, data, and user intent. Components know about rendering. Keeping those concerns separate means a component like `AssetCard` can be tested with a static props fixture without any mock router or fetch interceptor.

**No Context API or Redux.** All state is co-located at the component that needs it, or extracted into a custom hook that the component calls directly. At this scale — three pages, five presentational components — lifting state to a global store would add indirection without adding value. There is no shared state across pages. The decision to reach for Context or a store is a function of whether you have genuinely shared, frequently-updated state that multiple disconnected components need simultaneously. That condition does not exist here.

---

## 2. `useState` — Three Distinct Patterns

### 2a. Simple local state (`AssetsPage.tsx`)

```ts
const [typeFilter, setTypeFilter] = useState('')
const [searchInput, setSearchInput] = useState('')
const [search, setSearch] = useState('')
const [sort, setSort] = useState('newest')
const [page, setPage] = useState(1)
```

Each piece of state corresponds to exactly one user action. They are kept as separate `useState` calls — not merged into a single object — because they have meaningfully different update patterns:

- `searchInput` is updated on every keystroke; `search` is the debounced value that drives filtering.
- `page` resets to `1` when `typeFilter` or `search` changes.
- `sort` and `typeFilter` sync to `useSearchParams`.

Merging these into `const [filters, setFilters] = useState({...})` would require spreading on every update and would obscure which field is changing. Separate declarations make each update site explicit and make the debounce relationship between `searchInput` and `search` easy to follow.

### 2b. Lazy initializer (`useVariant.ts`)

```ts
const [variant] = useState(() => {
  const stored = localStorage.getItem(storageKey)
  if (stored && config.variants.includes(stored)) return stored as T
  const assigned = config.variants[Math.floor(Math.random() * config.variants.length)]
  localStorage.setItem(storageKey, assigned)
  return assigned as T
})
```

The initializer function runs once on mount, not on every render. This is used instead of `useState('')` + `useEffect` for a specific reason: the localStorage read and random assignment must happen synchronously before the first render. If `useEffect` were used, the component would render once with the empty initial value, then re-render after the effect fires with the correct variant. That produces a flash of the wrong variant — a real problem in an A/B test where the wrong branch renders briefly before the correct one appears. The lazy initializer eliminates that render cycle entirely.

### 2c. Data triplet (`useAssets.ts`, `useAsset.ts`)

```ts
const [assets, setAssets] = useState<Asset[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

Every async data fetch in the project uses this pattern. `loading` starts `true`, resolves to `false` in a `finally` block regardless of success or failure. `error` captures the thrown message string if the fetch rejects. This triplet covers the full state space of an async operation: pending, resolved, rejected. It is explicit rather than collapsed into a discriminated union because the three values are consumed independently in JSX — the skeleton, the error banner, and the content list each check a different field.

---

## 3. `useRef` — Non-Rendering State Guard (`SignupPage.tsx`)

```ts
const hasStartedSignup = useRef(false)
```

This ref gates a `signup_started` analytics event so it fires exactly once, on the first time the user interacts with the form. A ref is used instead of `useState` because this is a side-effect concern, not a rendering concern. The component's UI does not change when `hasStartedSignup` flips from `false` to `true`. If `useState` were used, setting it to `true` would trigger a re-render at the moment the user focuses a form field — an unnecessary render mid-interaction. `useRef` mutations are invisible to React's rendering pipeline, which is precisely the right behavior here.

---

## 4. `useEffect` — Five Distinct Patterns

### 4a. Data fetch on mount (`useAssets.ts`)

```ts
useEffect(() => {
  fetchAssets()
}, [])
```

Empty dependency array: runs once after initial mount. The hook fetches the full asset list and manages the loading/error triplet described above. No cleanup needed because the fetch is not cancellable in this implementation and the component is never unmounted mid-fetch in normal usage.

### 4b. Data fetch on id change (`useAsset.ts`)

```ts
useEffect(() => {
  if (!id) return
  fetchAsset(id)
}, [id])
```

The dependency on `id` means the hook re-fetches whenever the route param changes. The early return guard for a missing `id` prevents a spurious fetch if the component renders before the router has populated the param. This is preferable to a conditional hook call, which is forbidden by the Rules of Hooks.

### 4c. Debounce with cleanup (`AssetsPage.tsx`)

```ts
useEffect(() => {
  const t = setTimeout(() => setSearch(searchInput), 300)
  return () => clearTimeout(t)
}, [searchInput])
```

The cleanup function cancels the pending timeout before the next effect runs. Without it, if the user types faster than 300ms, multiple timers fire in sequence and `setSearch` is called multiple times with intermediate values. The cleanup ensures only the most recent keystroke's timer completes. This is the canonical pattern for debouncing in React without a utility library.

### 4d. Cross-tab storage sync (`useRecentlyViewed.ts`)

```ts
useEffect(() => {
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}, [])
```

The `storage` event fires on `window` when localStorage is modified from another tab. The cleanup removes the listener on unmount. Without cleanup, the listener would persist after the component unmounts, holding a reference to the component's stale closure — a memory leak and a source of hard-to-reproduce bugs if the user navigates back to the page and a second listener is registered.

### 4e. Analytics side effect (`useVariant.ts`)

```ts
useEffect(() => {
  const key = `exp_exposed_${experimentId}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  track({ event: 'experiment_exposure', experimentId, variant })
}, [experimentId, variant])
```

The `sessionStorage` guard ensures the exposure event fires at most once per session, not once per component mount. In React 18 strict mode, effects run twice in development to expose bugs from missing cleanup. The guard makes this effect idempotent. In production, the guard prevents double-counting if the component remounts (e.g., after a navigation back). The dependency on `[experimentId, variant]` means the event re-fires if the experiment changes, which is correct behavior.

---

## 5. `useMemo` — Filter/Search/Sort Pipeline (`AssetsPage.tsx`)

```ts
const filtered = useMemo(() => {
  let result = assets

  if (typeFilter) {
    result = result.filter(a => a.type === typeFilter)
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.sponsorName.toLowerCase().includes(q)
    )
  }

  result = [...result].sort((a, b) =>
    sort === 'newest'
      ? new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      : new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )

  return result
}, [assets, typeFilter, search, sort])
```

Without `useMemo`, this pipeline runs on every render, including renders caused by unrelated state changes (e.g., a hover state on a card). At the current data size this is cheap. The memoization is justified on two grounds beyond raw performance: it makes the dependency contract explicit — the filtered list is a pure function of exactly these four values — and it guards against performance regression if the asset list grows or the search logic becomes more expensive. The `useMemo` declaration is also a form of documentation: it signals to a future reader that this computation is intentionally derived state, not incidental.

---

## 6. `useCallback` — Stable Filter Handler (`AssetsPage.tsx`)

```ts
const handleTypeFilter = useCallback((value: string) => {
  setTypeFilter(value)
  track({ event: 'filter_applied', filterType: 'type', value })
  setSearchParams(prev => {
    const next = new URLSearchParams(prev)
    value ? next.set('type', value) : next.delete('type')
    return next
  })
}, [setSearchParams])
```

`setSearchParams` from `useSearchParams` is referenced inside the handler, so it must appear in the dependency array if this function were ever passed as a prop to a child component. Wrapping in `useCallback` makes the dependency explicit and ensures the handler reference is stable across renders as long as `setSearchParams` is stable. It also consolidates the three responsibilities of this action — update local state, fire analytics, sync URL — in one place with a single dependency declaration, making it easy to audit what this handler touches.

---

## 7. Custom Hooks — Three Patterns

### `useAssets` / `useAsset` — Repository pattern

Pages do not interact with `fetch()` directly. All knowledge of the API endpoint shape, error handling, and response mapping lives in the hook. This is the React equivalent of a repository pattern: the page declares what data it needs (`const { assets, loading, error } = useAssets()`), and the hook owns how to get it.

This separation means if the API endpoint changes — or is replaced by a mock during testing — only the hook changes. The page is unaffected.

### `useRecentlyViewed` — localStorage abstraction with cross-tab sync

Returns `{ items, refresh }`. The `refresh` callback lets `HomePage` manually re-sync after the user clears history without needing a global event bus or shared state. The hook owns the storage key, serialization, and cross-tab listener. The callsite sees a plain array and a function.

### `useVariant<T>` — Generic experiment hook

```ts
const variant = useVariant('hero-cta')
// TypeScript narrows variant to 'control' | 'explore'
```

The generic type parameter `T` is constrained to `VariantOf<typeof EXPERIMENTS[K]>`, which means TypeScript narrows the return type to the specific union of valid variant strings for that experiment — not just `string`. A typo like `variant === 'explre'` is a compile-time error.

The hook encapsulates the full experiment lifecycle: localStorage lookup, random assignment if absent, persistence, and the sessionStorage-guarded analytics exposure event. The callsite is three characters. The mechanism is hidden.

---

## 8. React Router Integration

**`useParams()`** — `SignupPage` reads the `:id` route param to fetch the correct asset and pre-populate the signup form context.

**`useLocation()`** — `location.state.from` is set when a user clicks an `AssetCard` and read on `SignupPage` to construct a "Back to Resources" link that returns to the exact filtered URL the user came from. Without `location.state`, the back link would point to the unfiltered list, losing the user's context.

**`useSearchParams()`** — Filter state (`type`, `search`, `sort`, `page`) is stored in the URL query string, not only in component state. This means filtered views survive page refresh and can be shared as links. The `setSearchParams` call in each filter handler keeps the URL in sync with local state.

**`NavLink` with `className` function:**

```tsx
<NavLink to="/assets" className={({ isActive }) => isActive ? styles.active : ''}>
  Resources
</NavLink>
```

React Router v6's `NavLink` accepts a function for `className` that receives the active state. This avoids a manual `useLocation` comparison in the `Header` component and is the idiomatic v6 pattern.

---

## 9. Form State (`SignupPage.tsx` — no form library)

```ts
const [form, setForm] = useState<SignupPayload>(EMPTY_FORM)
const [fieldErrors, setFieldErrors] = useState<Partial<SignupPayload>>({})
```

`fieldErrors` is typed as `Partial<SignupPayload>` — only fields with active errors are present; fields without errors are `undefined`. This means the JSX can check `fieldErrors.email` without needing a separate `touched` tracking layer.

```ts
const handleChange = (field: keyof SignupPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [field]: e.target.value }))
  if (fieldErrors[field]) {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }
}
```

The handler clears the field's error on change, so validation feedback disappears as soon as the user starts correcting a field. No form library is used. At five fields, the setup cost of `react-hook-form` or `Formik` — registration, schema integration, resolver wiring — outweighs the benefit. This pattern is explicit, auditable, and has no abstraction layer between the code and what it does.

---

## 10. TypeScript Patterns Specific to React

**Shared interfaces** — `Asset`, `SignupPayload`, and `SignupResult` are defined once and imported by both hooks and components. A change to the `Asset` type surfaces as a compile error at every usage site, not as a runtime shape mismatch.

**`AnalyticsEvent` discriminated union (`analytics.ts`)** — The `track()` function accepts an `AnalyticsEvent` type that is a discriminated union over all valid event shapes. TypeScript rejects a call like `track({ event: 'filter_appied', ... })` (typo) or a call with a missing required property at build time. Analytics shape errors are caught before they reach the data pipeline, where they would be silent.

**`VariantOf<T>` on `useVariant`** — The generic constraint means the return type of `useVariant('hero-cta')` is `'control' | 'explore'`, not `string`. Any switch statement or conditional on the returned value is exhaustiveness-checkable. TypeScript can warn if a new variant is added to the experiment config but not handled at a callsite.
