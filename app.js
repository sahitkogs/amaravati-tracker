// ══════════════════════════════════════════════════════════
//  MAP INIT
// ══════════════════════════════════════════════════════════
const map = L.map('map', {
  center: [16.505, 80.515],
  zoom: 13,
  zoomControl: true,
  attributionControl: true
});

const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  maxZoom: 20, subdomains: 'abcd'
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; Esri', maxZoom: 19
});

streetLayer.addTo(map);
let currentTileLayer = 'street';

document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    if (layer === currentTileLayer) return;
    currentTileLayer = layer;
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (layer === 'satellite') {
      map.removeLayer(streetLayer);
      satelliteLayer.addTo(map);
      document.querySelector('.leaflet-tile-pane').classList.add('satellite');
    } else {
      map.removeLayer(satelliteLayer);
      streetLayer.addTo(map);
      document.querySelector('.leaflet-tile-pane').classList.remove('satellite');
    }
  });
});

// ══════════════════════════════════════════════════════════
//  MARKERS & LAYER GROUPS
// ══════════════════════════════════════════════════════════
const layerGroups = {};

Object.keys(CATEGORY_COLORS).forEach(cat => {
  layerGroups[cat] = L.layerGroup().addTo(map);
});

LOCATIONS.forEach(loc => {
  const color = CATEGORY_COLORS[loc.category];
  const size = 12;
  const icon = L.divIcon({
    className: '',
    html: `<div class="marker-icon" style="width:${size}px;height:${size}px;background:${color};" data-id="${loc.id}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
  const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(layerGroups[loc.category]);
  marker.on('click', () => {
    map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 14), { animate: true });
  });
  loc._marker = marker;
});

// ══════════════════════════════════════════════════════════
//  NEWS FETCHING — Google News RSS via CORS proxy
// ══════════════════════════════════════════════════════════
const newsCache = new Map(); // keyword -> { articles, fetchedAt }
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const PROXY_BASE = 'https://corsproxy.io/?';

function buildProxiedRssUrl(keywords) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keywords)}&hl=en-IN&gl=IN&ceid=IN:en`;
  return PROXY_BASE + encodeURIComponent(rssUrl);
}

function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');
  const articles = [];

  items.forEach((item, i) => {
    if (i >= 5) return;

    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const source = item.querySelector('source')?.textContent || '';

    // Extract thumbnail from description HTML
    const descHtml = item.querySelector('description')?.textContent || '';
    let thumb = '';
    const imgMatch = descHtml.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch) thumb = imgMatch[1];

    // Strip " - SourceName" suffix from title since source is shown separately
    const cleanTitle = source && title.endsWith(' - ' + source)
      ? title.slice(0, -((' - ' + source).length))
      : title;

    articles.push({ title: cleanTitle, link, pubDate, source, thumb });
  });

  return articles;
}

async function fetchNews(keywords) {
  const cached = newsCache.get(keywords);
  if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL) {
    return cached.articles;
  }

  const url = buildProxiedRssUrl(keywords);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

  const xmlText = await resp.text();
  const articles = parseRssXml(xmlText);

  newsCache.set(keywords, { articles, fetchedAt: Date.now() });
  return articles;
}

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ══════════════════════════════════════════════════════════
//  SIDEBAR — viewport-driven live news feed
// ══════════════════════════════════════════════════════════
const sidebarBody = document.getElementById('sidebarBody');
const visibleCountEl = document.getElementById('visibleCount');
let activeFilter = 'all';
let renderGeneration = 0; // prevent stale renders

function getVisibleLocations() {
  const bounds = map.getBounds();
  return LOCATIONS.filter(loc => {
    if (activeFilter !== 'all' && loc.category !== activeFilter) return false;
    return bounds.contains([loc.lat, loc.lng]);
  });
}

function renderArticleHtml(article) {
  const thumbHtml = article.thumb
    ? `<img class="news-article-thumb" src="${article.thumb}" alt="" loading="lazy" onerror="this.remove()">`
    : '';

  return `
    <a class="news-article" href="${article.link}" target="_blank" rel="noopener">
      <div class="news-article-body">
        <div class="news-article-source">
          <span class="news-article-source-name">${article.source}</span>
        </div>
        <div class="news-article-title">${article.title}</div>
        <div class="news-article-time">${timeAgo(article.pubDate)}</div>
      </div>
      ${thumbHtml}
    </a>
  `;
}

function renderSidebar() {
  renderGeneration++;
  const gen = renderGeneration;

  const visible = getVisibleLocations();
  visibleCountEl.textContent = visible.length;

  if (visible.length === 0) {
    sidebarBody.innerHTML = `<div class="sidebar-empty">No locations in the current view.<br>Zoom out or pan the map to see locations.</div>`;
    return;
  }

  // Sort: under_construction first, then planned, then stalled, then completed
  const statusOrder = { under_construction: 0, planned: 1, stalled: 2, completed: 3 };
  visible.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  // Build skeleton with loading states
  sidebarBody.innerHTML = visible.map(loc => {
    const catColor = CATEGORY_COLORS[loc.category];
    const st = STATUS_CONFIG[loc.status];
    const newsUrl = `https://www.google.com/search?q=${encodeURIComponent(loc.searchKeywords)}&tbm=nws`;

    return `
      <div class="loc-group" data-id="${loc.id}">
        <div class="loc-group-header" data-loc-id="${loc.id}">
          <span class="loc-group-dot" style="background:${catColor};"></span>
          <span class="loc-group-name">${loc.name}</span>
          <span class="loc-group-status" style="background:${st.color}18;color:${st.color};">${st.label}</span>
        </div>
        <div class="loc-group-articles" id="articles-${loc.id}">
          <div class="news-loading">
            <div class="news-loading-spinner"></div>
            Loading news...
          </div>
        </div>
        <a class="news-fallback-link" href="${newsUrl}" target="_blank" rel="noopener">
          More on Google News &rarr;
        </a>
      </div>
    `;
  }).join('');

  // Click location header to fly to it
  sidebarBody.querySelectorAll('.loc-group-header').forEach(el => {
    el.addEventListener('click', () => {
      const loc = LOCATIONS.find(l => l.id === el.dataset.locId);
      if (loc) map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 15), { animate: true });
    });
  });

  // Fetch news for each location
  visible.forEach(loc => {
    fetchNews(loc.searchKeywords)
      .then(articles => {
        if (gen !== renderGeneration) return; // stale
        const container = document.getElementById(`articles-${loc.id}`);
        if (!container) return;

        if (articles.length === 0) {
          container.innerHTML = `<div class="news-error">No recent news found.</div>`;
        } else {
          container.innerHTML = articles.map(renderArticleHtml).join('');
        }
      })
      .catch(() => {
        if (gen !== renderGeneration) return;
        const container = document.getElementById(`articles-${loc.id}`);
        if (!container) return;
        container.innerHTML = `<div class="news-error">Could not load news.</div>`;
      });
  });
}

// Debounce sidebar updates on map move
let renderTimeout = null;
function debouncedRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(renderSidebar, 300);
}

map.on('moveend', debouncedRender);
map.on('zoomend', debouncedRender);

// Initial render
renderSidebar();

// ══════════════════════════════════════════════════════════
//  CATEGORY FILTERS
// ══════════════════════════════════════════════════════════
document.getElementById('filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  const filter = btn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = filter;

  Object.entries(layerGroups).forEach(([cat, group]) => {
    if (filter === 'all' || filter === cat) {
      map.addLayer(group);
    } else {
      map.removeLayer(group);
    }
  });

  renderSidebar();
});
