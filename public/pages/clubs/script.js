// Clubs Explorer (legacy-structure port)
// - Mirrors archived/NTU Clubs & Societies Explorer/script.js behavior
// - Uses local JSON data at ../../data/clubs.json

const DATA_URL = '../../data/clubs.json';

/** @typedef {{id:string,name:string,category:string,interest:string,time:string,location:string,members:number,meetingTimes:string,contact:string}} Club */

function safeText(s) {
  return String(s ?? '');
}

function normalize(s) {
  return safeText(s).toLowerCase().trim();
}

function loadSelected() {
  try {
    const raw = localStorage.getItem('ntuinfo.clubs.selected');
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSelected(set) {
  try {
    localStorage.setItem('ntuinfo.clubs.selected', JSON.stringify(Array.from(set)));
  } catch {
    // ignore quota
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[PAGE] Loaded successfully:', document.title);

  // DOM Elements (same ids as legacy)
  const clubGrid = document.getElementById('club-grid');
  const searchBar = document.getElementById('search-bar');
  const categoryFilter = document.getElementById('category-filter');
  const sortBy = document.getElementById('sort-by');
  const sortOrder = document.getElementById('sort-order');
  const noResultsMessage = document.getElementById('no-results');
  const summaryStats = document.getElementById('summary-stats');
  const showSelectedBtn = document.getElementById('show-selected-btn');
  const showAllBtn = document.getElementById('show-all-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const selectedCount = document.getElementById('selected-count');

  const metricTotal = document.getElementById('metric-total');
  const metricCommonCategory = document.getElementById('metric-common-category');

  /** @type {Club[]} */
  let clubsData = [];

  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`clubs.json load failed: ${res.status}`);
    const json = await res.json();
    clubsData = Array.isArray(json) ? json : [];
  } catch (e) {
    console.error(e);
    clubsData = [];
  }

  let selectedClubs = loadSelected();
  let showOnlySelected = false;

  const updateSelectedCount = () => {
    selectedCount.textContent = String(selectedClubs.size);
    showSelectedBtn.disabled = selectedClubs.size === 0;
    saveSelected(selectedClubs);
  };

  const toggleClubSelection = (clubName) => {
    if (selectedClubs.has(clubName)) selectedClubs.delete(clubName);
    else selectedClubs.add(clubName);
    updateSelectedCount();
    renderClubs();
  };

  const categories = Array.from(new Set(clubsData.map((c) => c.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  categoryFilter.innerHTML = ['<option value="All">All Categories</option>', ...categories.map((c) => `<option value="${c}">${c}</option>`)].join('');

  const filterClubs = () => {
    const searchTerm = normalize(searchBar.value);
    const selectedCategory = categoryFilter.value;

    return clubsData.filter((club) => {
      const matchesSearch = !searchTerm || normalize(club.name).includes(searchTerm) || normalize(club.interest).includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
      const matchesSelection = !showOnlySelected || selectedClubs.has(club.name);
      return matchesSearch && matchesCategory && matchesSelection;
    });
  };

  const sortClubs = (clubs) => {
    const sortCriteria = sortBy.value;
    const order = sortOrder.value;

    return clubs.sort((a, b) => {
      let aValue;
      let bValue;

      if (sortCriteria === 'members') {
        aValue = a.members || 0;
        bValue = b.members || 0;
      } else {
        aValue = normalize(a.name);
        bValue = normalize(b.name);
      }

      if (order === 'desc') return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
  };

  const renderSummary = (clubs) => {
    if (!summaryStats) return;
    if (clubs.length === 0) {
      summaryStats.innerHTML = '<p class="text-center text-gray-500">No clubs to analyze.</p>';
      return;
    }

    const totalClubs = clubs.length;

    const byCategory = new Map();
    clubs.forEach((c) => byCategory.set(c.category, (byCategory.get(c.category) || 0) + 1));
    const topCategory = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const avgMembers = (clubs.reduce((sum, c) => sum + (c.members || 0), 0) / totalClubs).toFixed(1);

    summaryStats.innerHTML = `
      <div class="summary-item"><p class="text-sm text-gray-500">Total Clubs</p><p class="text-2xl font-bold text-ntu-blue">${totalClubs}</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg Members</p><p class="text-2xl font-bold text-ntu-blue">${avgMembers}</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Top Category</p><p class="text-2xl font-bold text-ntu-red">${topCategory}</p></div>
    `;

    // Keep grid spacing aligned even if fewer than legacy 6 columns
    console.log('[PAGE] Total clubs rendered:', totalClubs);

    if (metricTotal) metricTotal.textContent = String(clubsData.length);
    if (metricCommonCategory) metricCommonCategory.textContent = topCategory;
  };

  const renderClubs = () => {
    const filtered = filterClubs();
    const sorted = sortClubs(filtered);

    if (sorted.length === 0) {
      noResultsMessage.classList.remove('hidden');
      clubGrid.innerHTML = '';
    } else {
      noResultsMessage.classList.add('hidden');

      clubGrid.innerHTML = sorted
        .map((club) => {
          const isSelected = selectedClubs.has(club.name);
          return `
            <div class="club-card border-2 ${isSelected ? 'border-ntu-red bg-red-50' : 'border-gray-200'} rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-grow">
                    <h3 class="text-lg font-bold text-ntu-blue pr-2">${safeText(club.name)}</h3>
                    <span class="category-badge text-xs font-medium text-white px-2 py-1 rounded-full" data-category="${safeText(club.category)}">${safeText(club.category)}</span>
                  </div>
                  <div class="club-checkbox-container flex-shrink-0">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} class="club-checkbox" data-club-name="${safeText(club.name)}" aria-label="Select ${safeText(club.name)}">
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">Interest: <strong>${safeText(club.interest)}</strong> • Time: <strong>${safeText(club.time)}</strong> • Location: <strong>${safeText(club.location)}</strong></p>
                <p class="text-sm text-gray-600 mb-4">Meets: ${safeText(club.meetingTimes)} • Contact: <a href="mailto:${safeText(club.contact)}">${safeText(club.contact)}</a></p>
              </div>

              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="metric">
                  <h4 class="font-semibold text-xs text-gray-500">Members</h4>
                  <div class="metric-value-wrapper">
                    <p class="text-2xl font-bold text-ntu-blue">${Number(club.members || 0)}</p>
                    <span class="metric-justification">Approximate members (demo dataset)</span>
                  </div>
                </div>
                <div class="metric">
                  <h4 class="font-semibold text-xs text-gray-500">Time</h4>
                  <div class="metric-value-wrapper">
                    <p class="text-2xl font-bold text-ntu-red">${safeText(club.time)}</p>
                    <span class="metric-justification">Reported time commitment bucket</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join('');

      clubGrid.querySelectorAll('.club-card').forEach((card, idx) => {
        card.style.animationDelay = `${Math.min(idx, 10) * 0.05}s`;
      });
    }

    updateSelectedCount();
    renderSummary(sorted);
  };

  const processFiltersAndSort = () => renderClubs();

  searchBar.addEventListener('input', processFiltersAndSort);
  categoryFilter.addEventListener('change', processFiltersAndSort);
  sortBy.addEventListener('change', processFiltersAndSort);
  sortOrder.addEventListener('change', processFiltersAndSort);

  showSelectedBtn.addEventListener('click', () => {
    showOnlySelected = true;
    processFiltersAndSort();
  });

  showAllBtn.addEventListener('click', () => {
    showOnlySelected = false;
    processFiltersAndSort();
  });

  clearAllBtn.addEventListener('click', () => {
    selectedClubs.clear();
    showOnlySelected = false;
    updateSelectedCount();
    processFiltersAndSort();
  });

  clubGrid.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('club-checkbox')) {
      const clubName = t.dataset.clubName;
      toggleClubSelection(clubName);
    }
  });

  updateSelectedCount();

  // Initial render
  processFiltersAndSort();
});
