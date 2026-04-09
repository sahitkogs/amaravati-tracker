# Amaravati Construction Tracker — MVP Implementation Plan

## Goal
A **single standalone HTML file** that displays an interactive map of Amaravati's capital region with marked construction/infrastructure points. Clicking a point opens pre-built Google/YouTube search links in a side panel, letting users discover the latest news and updates for that location.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Single HTML File                    │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │                      │  │     Side Panel        │ │
│  │    Leaflet.js Map    │  │                       │ │
│  │   (OpenStreetMap)    │  │  - Location name      │ │
│  │                      │  │  - Category/status    │ │
│  │  [pin] [pin] [pin]   │  │  - Description        │ │
│  │       [pin]          │  │  - 🔗 Google Search   │ │
│  │                      │  │  - 🔗 YouTube Search  │ │
│  │                      │  │  - 🔗 Twitter Search  │ │
│  └──────────────────────┘  └──────────────────────┘ │
│                                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │  Filters: [Roads] [Buildings] [Bridges] [All]  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack (all via CDN — no build tools)

| Component       | Library / Source         | Purpose                          |
|-----------------|--------------------------|----------------------------------|
| Map             | Leaflet.js (CDN)         | Interactive map rendering        |
| Map tiles       | OpenStreetMap             | Free tile layer                  |
| Markers         | Leaflet default + custom | Color-coded by category          |
| Data            | Inline JSON              | Location points embedded in HTML |
| Search          | Google/YouTube/Twitter URLs | Pre-built search links         |
| UI              | Vanilla HTML/CSS/JS      | No framework dependency          |

---

## Data Model

Each location point in the embedded JSON array:

```json
{
  "id": "loc_001",
  "name": "Secretariat Complex",
  "nameLocal": "సచివాలయం",
  "category": "government",
  "lat": 16.5150,
  "lng": 80.5100,
  "status": "under_construction",
  "description": "Main administrative building of AP Government in Amaravati capital city.",
  "searchKeywords": "Amaravati Secretariat building construction",
  "lastUpdated": "2025-12-01"
}
```

### Categories (color-coded on map)
- `government` — Secretariat, Assembly, High Court (Red)
- `road` — Seed access roads, expressways, arterial roads (Blue)
- `bridge` — Bridges over Krishna river, flyovers (Orange)
- `residential` — Housing colonies, township areas (Green)
- `commercial` — Business hubs, IT parks (Purple)
- `utility` — Water, power, drainage infrastructure (Gray)

### Status values
- `completed`
- `under_construction`
- `planned`
- `stalled`

---

## Implementation Steps

### Step 1: HTML Skeleton + CSS Layout

Create the page structure:
- **Left/main area (65-70%)**: Map container
- **Right panel (30-35%)**: Info sidebar, hidden by default, slides in on click
- **Top bar**: Title + filter buttons
- Responsive: On mobile, sidebar overlays the map as a bottom sheet

Key CSS considerations:
- Use CSS Grid or Flexbox for the two-panel layout
- Sidebar has `transform: translateX(100%)` by default, transitions in on point click
- Map must fill its container with `height: 100vh`
- Category filter buttons styled as pill/chip toggles

### Step 2: Initialize Leaflet Map

- Center: `[16.515, 80.515]` (Amaravati capital region)
- Default zoom: `13` (shows the full capital area)
- Tile layer: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Optional satellite layer toggle using Esri World Imagery (free): `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`

### Step 3: Populate Location Data

Embed a `const LOCATIONS = [...]` array directly in a `<script>` tag. Start with **20-30 key locations** gathered from:

1. **APCRDA GIS portal** (`gis.apcrda.org/lps/index.html`) — visually identify major plots and note coordinates
2. **Google Maps** — search known landmarks like "Amaravati Secretariat" and grab lat/lng
3. **News articles** — identify frequently mentioned construction sites

Initial seed locations to include:
- AP Secretariat
- AP Legislative Assembly
- AP High Court
- Seed Access Road (multiple segments)
- Amaravati Trunk Infrastructure (roads)
- Icons of Amaravati (towers)
- Krishna riverfront development
- Capital region inner ring road
- Vijayawada-Amaravati Expressway
- Key bridges (Kanaka Durga flyover area, new Krishna bridges)
- AIIMS Mangalagiri
- Government housing colonies
- Solar power plant areas

### Step 4: Render Markers on Map

For each location in the JSON:
- Create a Leaflet `circleMarker` or custom `divIcon` colored by category
- Bind a click handler that:
  1. Opens the sidebar
  2. Populates it with location details
  3. Generates search URLs

Use Leaflet `LayerGroup` per category so filters can toggle entire groups.

### Step 5: Build Search URL Generator

A function that takes `searchKeywords` and returns links:

```javascript
function getSearchLinks(keywords) {
  const encoded = encodeURIComponent(keywords);
  return {
    google: `https://www.google.com/search?q=${encoded}`,
    googleNews: `https://www.google.com/search?q=${encoded}&tbm=nws`,
    youtube: `https://www.youtube.com/results?search_query=${encoded}`,
    twitter: `https://twitter.com/search?q=${encoded}&f=live`
  };
}
```

Each link opens in a **new tab** (`target="_blank"`).

Optional enhancement: also include:
- `https://www.google.com/search?q=${encoded}&tbm=isch` (image search)
- A date-restricted Google search: append `&tbs=qdr:m` (past month)

### Step 6: Sidebar Panel Content

When user clicks a point, the sidebar shows:

```
┌─────────────────────────┐
│ ✕ Close                 │
│                         │
│ 📍 AP Secretariat       │
│ సచివాలయం                │
│                         │
│ Category: Government    │
│ Status: 🟡 Under Const. │
│                         │
│ Main administrative     │
│ building of AP Govt...  │
│                         │
│ ── Search for Updates ──│
│                         │
│ 🔍 Google Search        │
│ 📰 Google News          │
│ 🎥 YouTube Videos       │
│ 🐦 Twitter/X Posts      │
│                         │
│ Last verified: Dec 2025 │
└─────────────────────────┘
```

### Step 7: Category Filters

Top bar filter buttons:
- "All" (default — shows everything)
- One button per category
- Clicking a filter toggles the corresponding `LayerGroup` on/off via `map.addLayer()` / `map.removeLayer()`
- Active filters get a highlighted style

### Step 8: Status Filters (optional enhancement)

Secondary filter row or dropdown to show only:
- Under construction
- Completed
- Planned

### Step 9: Mobile Responsiveness

- Below `768px` width: sidebar becomes a bottom drawer (slides up from bottom, covers ~60% of screen)
- Filter pills become horizontally scrollable
- Map takes full width

---

## Data Collection Strategy

Since we're starting manually, here's a practical workflow:

1. **Open APCRDA GIS portal** side by side with Google Maps
2. **Identify a landmark** on the GIS portal (e.g., a labeled government plot)
3. **Find it on Google Maps** and right-click → "What's here?" to get exact lat/lng
4. **Add to JSON** with a descriptive `searchKeywords` string that will yield good Google/YouTube results
5. **Test the search links** — search for `"Amaravati Secretariat construction update"` manually and verify results are relevant
6. **Refine keywords** if results are poor (e.g., add "2025" or "latest" or Telugu keywords)

Aim for **30 points** to start. Prioritize locations that have active YouTube/news coverage.

---

## Future Enhancements (post-MVP)

| Phase | Feature | Effort |
|-------|---------|--------|
| V1.1  | Embedded Google Programmable Search in sidebar instead of link-out | Low |
| V1.2  | User-submitted locations via a simple form (stores to localStorage) | Low |
| V1.3  | WebLLM integration — summarize search results in-browser | High |
| V2.0  | SearXNG self-hosted backend for richer in-app search | Medium |
| V2.1  | Overlay APCRDA master plan as a GeoJSON/image layer on the map | Medium |
| V2.2  | Timeline view — track progress photos over time per location | High |
| V2.3  | Telugu language support for UI and search | Low |

---

## File Structure

Since this is a **single HTML file**, everything is inline:

```
amaravati-tracker.html
├── <style>         — All CSS (layout, sidebar, filters, markers, responsive)
├── <div>           — Map container, sidebar, filter bar
├── <script> (CDN)  — Leaflet.js
├── <script>        — LOCATIONS JSON data
├── <script>        — App logic (map init, markers, sidebar, filters, search URL builder)
```

Estimated size: ~30-50 KB (excluding Leaflet CDN which loads externally).

---

## Hosting

- **GitHub Pages**: Push the single HTML file to a repo, enable Pages. Free, instant.
- **Cloudflare Pages**: Same idea, slightly faster CDN.
- **Netlify**: Drop the file, done.

No server, no database, no build step. Just one file.
