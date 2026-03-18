# Search and Filter Implementation

Short doc on how the dashboard search-by-name and filter-by-sport work, two bugs we hit (slow/inconsistent selector, then list not refetching), and how we fixed them.

## What We Implemented

- **Search by name** – Text input; value is debounced (300ms) then written to the URL as `?search=...`. The server reads `searchParams` and passes `search` into `getAllEvents()`, which uses Supabase `.ilike("name", ...)` so the query runs in the database.
- **Filter by sport** – Select (All sports, Soccer, Tennis, Basketball, Pickleball). The chosen value is written to the URL as `?sport=...`. The server passes `sport` into `getAllEvents()`, which uses `.eq("activity", sport)`.
- **Loading states** – The events list is wrapped in `<Suspense>` with `<EventsListSkeleton />` as fallback while the server component that calls `getAllEvents()` is loading. Search/filter bar is also in its own Suspense boundary.

**Source of truth:** The URL. The home page is a server component that `await searchParams` and passes `search` and `sport` into `SearchAndFilter` (client) and `Stats` (server). Changing search or sport updates the URL via `router.push()`; the server then re-renders with new params and refetches from the DB.

## Previous Bug: Selector Slow and Inconsistent

Originally the sport Select was controlled only by the URL: its value was `initialSport || "all"` (i.e. whatever the server passed in from `searchParams`). So the flow was: user picks a sport → we push the new URL → wait for the server to respond with a new RSC payload → *then* the Select received new props and updated.

**What users saw:** Selections did change eventually, but the dropdown often felt unresponsive. It would “think” for a moment, sometimes not switch at all on first click, or switch only after a noticeable delay. That was because the Select couldn’t show the new value until the full round-trip (navigation + server render + client hydration) completed.

**Fix:** We introduced local state `sportValue` and update it immediately in `onValueChange` (before calling `setFilters`). The Select’s `value` is now `sportValue`, so the UI updates as soon as the user picks an option. We still sync `sportValue` from `initialSport` in a `useEffect` so the dropdown stays in sync with the URL (e.g. back/forward, or after the refetch completes). Result: the selector feels instant; the list refetches in the background.

## The Bug: Selector Felt Responsive but Didn’t Change the List

After making the sport selector “responsive,” it updated instantly when you picked a value, but the events list didn’t refetch and didn’t change. So the UI suggested the filter was applied, but the data didn’t match.

## Why It Happened

1. **No explicit refetch after navigation** – We were only calling `router.push(url)` with the new query string. In the App Router, updating the URL doesn’t always trigger a new server fetch for the same path; the client can keep showing the previous RSC payload. So the server component that calls `getAllEvents(search, sport)` wasn’t necessarily re-running with the new params.
2. **Possible static/cache behavior** – The page could be cached or treated as static so that `searchParams` didn’t change on the server for each filter change, or the new params weren’t used for a fresh data fetch.
3. **No signal to remount the list** – Even when new props were passed, React might reuse the same `Stats` tree. Without a changing key, the list didn’t reliably remount and refetch when only query params changed.

## How We Fixed It

1. **Call `router.refresh()` after `router.push(url)`** – In `SearchAndFilter`, after pushing the new URL we call `router.refresh()` (inside `setTimeout(..., 0)` so it runs after the router has applied the new URL). That forces the App Router to refetch the current route’s server components, so the page runs again with the updated `searchParams` and `getAllEvents(search, sport)` runs with the right filters.
2. **Use `pathname` when building the URL** – We build the href as `${pathname}?${q}` instead of hardcoding `/?${q}`, so navigation and refresh work correctly for the actual route.
3. **`export const dynamic = "force-dynamic"` on the home page** – Ensures the page is never statically cached; every request gets fresh `searchParams` and the server always runs the page with the current query.
4. **`key={\`${search}-${sport}\`}` on the Stats Suspense boundary** – When search or sport changes, the key changes so the boundary (and `Stats`) remount. That guarantees a new data load and shows the skeleton while the refetch is in progress.

We also kept the sport selector feeling instant by storing the selected sport in local state (`sportValue`) and updating it immediately in `onValueChange`, then syncing that state with the URL. So the dropdown reflects the choice right away while the list refetches in the background.

## Files Involved

- `app/page.tsx` – Reads `searchParams`, passes `search`/`sport` to children, `dynamic = "force-dynamic"`, Suspense with key for `Stats`.
- `components/Stats/SearchAndFilter.tsx` – Client component: URL updates via `router.push` + `router.refresh()`, local state for responsive select, debounced search.
- `components/Stats/Stats.tsx` – Server component: accepts `search`/`sport`, calls `getAllEvents({ search, sport })`, renders list or error/empty.
- `lib/supabase/actions.ts` – `getAllEvents(filters)` applies optional `.ilike("name", ...)` and `.eq("activity", sport)` to the Supabase query.
