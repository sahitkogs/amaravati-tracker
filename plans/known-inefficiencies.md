# Known Inefficiencies

Identified 2026-04-09. To be addressed in a future pass.

---

## Critical

### 1. All-or-nothing rendering blocks on slowest fetch
**Location:** `app.js` — `renderArticlesTab()` and `renderVideosTab()`

The sidebar waits until every fetch completes (`completed === toFetch.length`) before updating the DOM. If one location's fetch is slow — especially YouTube via Invidious which tries up to 4 instances sequentially — the entire feed is blocked.

**Fix:** Render incrementally after each fetch resolves, not only when the last one completes.

### 2. Unbounded cache growth
**Location:** `app.js` — `newsCache`, `videoCache`, `articlesByLoc`, `videosByLoc`

All four Maps accumulate entries indefinitely with no eviction or size cap. Long sessions with lots of panning will leak memory.

**Fix:** Enforce a max size (e.g., LRU eviction at ~50 entries) or prune stale entries on insertion.

---

## Important

### 3. Double debounce trigger on zoom
**Location:** `app.js` — `map.on('moveend', ...)` and `map.on('zoomend', ...)`

Leaflet fires both `zoomend` and `moveend` on every zoom gesture. Each resets the 300ms debounce timer, so the effective delay doubles.

**Fix:** Only listen to `moveend` (which already fires after zoom). Drop the `zoomend` listener.

### 4. Stale decorated articles after cache refresh
**Location:** `app.js` — `articlesByLoc` / `videosByLoc` population logic

These Maps are populated from cache on demand but never invalidated when the underlying cache entry refreshes after TTL expiry. A location can show outdated articles until page reload.

**Fix:** Clear the corresponding `articlesByLoc`/`videosByLoc` entry when `newsCache`/`videoCache` is refreshed for that keyword.
