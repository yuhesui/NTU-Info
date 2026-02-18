/**
 * Clubs & Societies Explorer
 * - Loads data from ../data/clubs.json
 * - Provides real-time search + filters
 * - Accessible, deterministic rendering
 */

const DATA_URL = '../data/clubs.json';

/** @typedef {{id:string,name:string,category:string,interest:string,time:string,location:string,members:number,meetingTimes:string,contact:string}} Club */

function normalize(s) {
  return String(s || '').trim().toLowerCase();
}

/**
 * @param {Club[]} clubs
 * @param {{q:string, category:string, time:string, location:string}} filters
 */
function filterClubs(clubs, filters) {
  const q = normalize(filters.q);
  const cat = normalize(filters.category);
  const time = normalize(filters.time);
  const loc = normalize(filters.location);

  return clubs.filter((c) => {
    const matchesQ =
      !q ||
      normalize(c.name).includes(q) ||
      normalize(c.category).includes(q) ||
      normalize(c.interest).includes(q) ||
      normalize(c.location).includes(q);

    const matchesCat = !cat || normalize(c.category) === cat;
    const matchesTime = !time || normalize(c.time) === time;
    const matchesLoc = !loc || normalize(c.location) === loc;

    return matchesQ && matchesCat && matchesTime && matchesLoc;
  });
}

function clubCardHTML(club) {
  return `
    <article class="club-card">
      <header class="club-card-header">
        <h2 class="club-title">${club.name}</h2>
        <div class="club-badges" aria-label="Club tags">
          <span class="club-badge">${club.category}</span>
          <span class="club-badge club-badge-secondary">${club.time}</span>
        </div>
      </header>

      <dl class="club-meta">
        <div><dt>Interest</dt><dd>${club.interest}</dd></div>
        <div><dt>Members</dt><dd>${club.members}</dd></div>
        <div><dt>Meets</dt><dd>${club.meetingTimes}</dd></div>
        <div><dt>Location</dt><dd>${club.location}</dd></div>
        <div><dt>Contact</dt><dd><a href="mailto:${club.contact}">${club.contact}</a></dd></div>
      </dl>
    </article>
  `;
}

async function loadClubs() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load clubs data: ${res.status}`);
  /** @type {Club[]} */
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
}

function init() {
  console.log('[PAGE] Loaded successfully:', document.title);

  const el = {
    search: /** @type {HTMLInputElement|null} */ (document.getElementById('clubs-search')),
    category: /** @type {HTMLSelectElement|null} */ (document.getElementById('filter-category')),
    time: /** @type {HTMLSelectElement|null} */ (document.getElementById('filter-time')),
    location: /** @type {HTMLSelectElement|null} */ (document.getElementById('filter-location')),
    list: document.getElementById('clubs-list'),
    count: document.getElementById('clubs-count'),
    empty: document.getElementById('clubs-empty')
  };

  if (!el.search || !el.category || !el.time || !el.location || !el.list) return;

  /** @type {Club[]} */
  let clubs = [];
  const filters = { q: '', category: '', time: '', location: '' };

  function render() {
    const filtered = filterClubs(clubs, filters);
    el.list.innerHTML = filtered.map(clubCardHTML).join('');
    const renderedCount = el.list.querySelectorAll('.club-card').length;

    if (el.count) el.count.textContent = String(renderedCount);
    if (el.empty) el.empty.hidden = renderedCount !== 0;

    console.log('[PAGE] Total clubs rendered:', renderedCount);
  }

  function syncFiltersFromUI() {
    filters.q = el.search.value;
    filters.category = el.category.value;
    filters.time = el.time.value;
    filters.location = el.location.value;
  }

  function bind() {
    el.search.addEventListener('input', () => {
      syncFiltersFromUI();
      render();
    });

    el.category.addEventListener('change', () => {
      syncFiltersFromUI();
      render();
    });

    el.time.addEventListener('change', () => {
      syncFiltersFromUI();
      render();
    });

    el.location.addEventListener('change', () => {
      syncFiltersFromUI();
      render();
    });
  }

  loadClubs()
    .then((data) => {
      clubs = data;

      // Populate filter dropdowns deterministically from data
      const categories = uniqueSorted(clubs.map((c) => c.category));
      const times = uniqueSorted(clubs.map((c) => c.time));
      const locations = uniqueSorted(clubs.map((c) => c.location));

      el.category.innerHTML = ['<option value="">All categories</option>', ...categories.map((c) => `<option value="${c}">${c}</option>`)].join('');
      el.time.innerHTML = ['<option value="">All time commitments</option>', ...times.map((t) => `<option value="${t}">${t}</option>`)].join('');
      el.location.innerHTML = ['<option value="">All locations</option>', ...locations.map((l) => `<option value="${l}">${l}</option>`)].join('');

      bind();
      render();
    })
    .catch((err) => {
      console.error(err);
      el.list.innerHTML = '<p class="muted">Failed to load clubs database. Please refresh.</p>';
    });
}

document.addEventListener('DOMContentLoaded', init);
