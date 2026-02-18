const DATA_URL = '../../data/clubs.json';
const SELECTED_KEY = 'ntuinfo.clubs.selected';

const scoreColor = (score) => (score >= 8 ? 'score-high' : score >= 4 ? 'score-medium' : 'score-low');
const safe = (v) => String(v ?? '');

function loadSelected() {
  const raw = localStorage.getItem(SELECTED_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveSelected(selected) {
  localStorage.setItem(SELECTED_KEY, JSON.stringify(Array.from(selected)));
}

function byMetricRows(clubs, getter) {
  const values = clubs.map((club) => ({ name: club.name, value: getter(club) }));
  const max = Math.max(...values.map((v) => v.value));
  const min = Math.min(...values.map((v) => v.value));
  const highs = values.filter((v) => v.value === max).map((v) => v.name).join(', ');
  const lows = values.filter((v) => v.value === min).map((v) => v.name).join(', ');
  return { max, min, highs, lows };
}

document.addEventListener('DOMContentLoaded', async () => {
  const clubGrid = document.getElementById('club-grid');
  const searchBar = document.getElementById('search-bar');
  const categoryFilter = document.getElementById('category-filter');
  const sortBy = document.getElementById('sort-by');
  const sortOrder = document.getElementById('sort-order');
  const noResults = document.getElementById('no-results');
  const summaryStats = document.getElementById('summary-stats');
  const showSelectedBtn = document.getElementById('show-selected-btn');
  const showAllBtn = document.getElementById('show-all-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const selectedCount = document.getElementById('selected-count');

  const raw = await fetch(DATA_URL).then((res) => res.json());
  const clubsData = raw.map((club, idx) => ({ ...club, id: club.id || `club-${idx}` }));

  const categories = [...new Set(clubsData.map((c) => c.category))].sort();
  categoryFilter.innerHTML = ['<option value="All">All Categories</option>', ...categories.map((c) => `<option value="${c}">${c}</option>`)].join('');

  const selectedClubs = loadSelected();
  let showOnlySelected = false;

  const metricTotal = document.getElementById('metric-total');
  metricTotal.textContent = String(clubsData.length);

  const timeRows = byMetricRows(clubsData, (c) => c.timeLoad.value);
  const physicalRows = byMetricRows(clubsData, (c) => c.physicalLoad.score);
  const mentalRows = byMetricRows(clubsData, (c) => c.mentalLoad.score);
  const entryRows = byMetricRows(clubsData, (c) => c.entryCriteria.score);

  document.getElementById('metric-time').textContent = `${(clubsData.reduce((sum, c) => sum + c.timeLoad.value, 0) / clubsData.length).toFixed(1)} hrs/week`;
  document.getElementById('metric-time-high').textContent = `${timeRows.highs} (${timeRows.max})`;
  document.getElementById('metric-time-low').textContent = `${timeRows.lows} (${timeRows.min})`;
  document.getElementById('metric-physical').textContent = `${(clubsData.reduce((sum, c) => sum + c.physicalLoad.score, 0) / clubsData.length).toFixed(1)}/10`;
  document.getElementById('metric-physical-high').textContent = `${physicalRows.highs} (${physicalRows.max})`;
  document.getElementById('metric-physical-low').textContent = `${physicalRows.lows} (${physicalRows.min})`;
  document.getElementById('metric-mental').textContent = `${(clubsData.reduce((sum, c) => sum + c.mentalLoad.score, 0) / clubsData.length).toFixed(1)}/10`;
  document.getElementById('metric-mental-high').textContent = `${mentalRows.highs} (${mentalRows.max})`;
  document.getElementById('metric-mental-low').textContent = `${mentalRows.lows} (${mentalRows.min})`;
  document.getElementById('metric-entry').textContent = `${(clubsData.reduce((sum, c) => sum + c.entryCriteria.score, 0) / clubsData.length).toFixed(1)}/10`;
  document.getElementById('metric-entry-high').textContent = `${entryRows.highs} (${entryRows.max})`;
  document.getElementById('metric-entry-low').textContent = `${entryRows.lows} (${entryRows.min})`;

  const updateSelected = () => {
    selectedCount.textContent = String(selectedClubs.size);
    saveSelected(selectedClubs);
  };

  const filterClubs = () => {
    const searchTerm = searchBar.value.toLowerCase().trim();
    const category = categoryFilter.value;
    return clubsData.filter((club) => {
      const searchHit = club.name.toLowerCase().includes(searchTerm) || club.description.toLowerCase().includes(searchTerm);
      const categoryHit = category === 'All' || club.category === category;
      const selectedHit = !showOnlySelected || selectedClubs.has(club.id);
      return searchHit && categoryHit && selectedHit;
    });
  };

  const sortClubs = (clubs) => {
    const field = sortBy.value;
    const order = sortOrder.value;
    const value = (club) => {
      if (field === 'name') return club.name.toLowerCase();
      if (field === 'timeLoad') return club.timeLoad.value;
      if (field === 'physicalLoad') return club.physicalLoad.score;
      if (field === 'mentalLoad') return club.mentalLoad.score;
      if (field === 'entryCriteria') return club.entryCriteria.score;
      return club.ccaPoints;
    };

    return [...clubs].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (va === vb) return 0;
      const result = va > vb ? 1 : -1;
      return order === 'asc' ? result : -result;
    });
  };

  const renderSummary = (clubs) => {
    if (!clubs.length) {
      summaryStats.innerHTML = '<p class="text-center text-gray-500">No clubs to analyze.</p>';
      return;
    }

    const avg = (key) => (clubs.reduce((sum, club) => sum + key(club), 0) / clubs.length).toFixed(1);
    summaryStats.innerHTML = `
      <div class="summary-item"><p class="text-sm text-gray-500">Avg. Time</p><p class="text-2xl font-bold text-ntu-blue">${avg((c) => c.timeLoad.value)} hr/wk</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg. Physical</p><p class="text-2xl font-bold text-ntu-red">${avg((c) => c.physicalLoad.score)}/10</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg. Mental</p><p class="text-2xl font-bold text-ntu-red">${avg((c) => c.mentalLoad.score)}/10</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg. Entry</p><p class="text-2xl font-bold text-ntu-red">${avg((c) => c.entryCriteria.score)}/10</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg. CCA Points</p><p class="text-2xl font-bold text-ntu-blue">${avg((c) => c.ccaPoints)}</p></div>
    `;
  };

  const render = () => {
    const clubs = sortClubs(filterClubs());
    if (!clubs.length) {
      clubGrid.innerHTML = '';
      noResults.classList.remove('hidden');
      renderSummary([]);
      return;
    }

    noResults.classList.add('hidden');
    clubGrid.innerHTML = clubs.map((club, index) => `
      <article class="club-card border-2 ${selectedClubs.has(club.id) ? 'border-ntu-red bg-red-50' : 'border-gray-200'} rounded-lg shadow-sm bg-white p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-bold text-ntu-blue">${safe(club.name)}</h3>
            <span class="category-badge text-xs font-medium text-white px-2 py-1 rounded-full" data-category="${safe(club.category)}">${safe(club.category)}</span>
          </div>
          <div class="club-checkbox-container"><input type="checkbox" class="club-checkbox" ${selectedClubs.has(club.id) ? 'checked' : ''} data-id="${club.id}" aria-label="Select ${safe(club.name)}"></div>
        </div>
        <p class="text-sm text-gray-600 mb-4 h-24 overflow-auto">${safe(club.description)}</p>
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="metric"><h4 class="font-semibold text-xs text-gray-500">Time</h4><div class="metric-value-wrapper"><p class="text-2xl font-bold text-ntu-blue">${club.timeLoad.value}hr</p><span class="metric-justification">${safe(club.timeLoad.text)}</span></div></div>
          <div class="metric"><h4 class="font-semibold text-xs text-gray-500">Physical</h4><div class="metric-value-wrapper"><p class="text-2xl font-bold ${scoreColor(club.physicalLoad.score)}">${club.physicalLoad.score}/10</p><span class="metric-justification">${safe(club.physicalLoad.justification)}</span></div></div>
          <div class="metric"><h4 class="font-semibold text-xs text-gray-500">Mental</h4><div class="metric-value-wrapper"><p class="text-2xl font-bold ${scoreColor(club.mentalLoad.score)}">${club.mentalLoad.score}/10</p><span class="metric-justification">${safe(club.mentalLoad.justification)}</span></div></div>
          <div class="metric"><h4 class="font-semibold text-xs text-gray-500">Entry</h4><div class="metric-value-wrapper"><p class="text-2xl font-bold ${scoreColor(club.entryCriteria.score)}">${club.entryCriteria.score}/10</p><span class="metric-justification">${safe(club.entryCriteria.justification)}</span></div></div>
        </div>
      </article>
    `).join('');

    clubGrid.querySelectorAll('.club-card').forEach((card, idx) => {
      card.style.animationDelay = `${Math.min(idx, 10) * 0.05}s`;
    });

    renderSummary(clubs);
    updateSelected();
  };

  clubGrid.addEventListener('change', (event) => {
    if (!event.target.classList.contains('club-checkbox')) return;
    const id = event.target.dataset.id;
    if (selectedClubs.has(id)) selectedClubs.delete(id);
    else selectedClubs.add(id);
    updateSelected();
    if (showOnlySelected) render();
  });

  searchBar.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);
  sortBy.addEventListener('change', render);
  sortOrder.addEventListener('change', render);

  showSelectedBtn.addEventListener('click', () => { showOnlySelected = true; render(); });
  showAllBtn.addEventListener('click', () => { showOnlySelected = false; render(); });
  clearAllBtn.addEventListener('click', () => { selectedClubs.clear(); showOnlySelected = false; render(); });

  updateSelected();
  render();
});
