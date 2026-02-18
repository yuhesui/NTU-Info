const DATA_URL = '../../data/clubs.json';

const categoryStyles = {
  'Varsity Sports': 'tag tag--varsity',
  'Special Interest': 'tag tag--special',
  'Community & Social Impact': 'tag tag--community',
  'Recreational Sports': 'tag tag--recreation',
  'Arts & Culture': 'tag tag--arts',
  'Academic & Professional': 'tag tag--academic',
  'Community Service': 'tag tag--community',
};

async function loadData() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load clubs: ${response.status}`);
  return response.json();
}

document.addEventListener('DOMContentLoaded', async () => {
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
  const metricHighest = document.getElementById('metric-highest');
  const metricLowest = document.getElementById('metric-lowest');
  const metricCommonCategory = document.getElementById('metric-common-category');

  let clubsData = [];
  let selectedClubs = new Set();
  let showOnlySelected = false;

  try {
    clubsData = await loadData();
  } catch (error) {
    console.error(error);
    noResultsMessage.classList.remove('hidden');
    noResultsMessage.querySelector('p').textContent = 'Could not load club dataset.';
    return;
  }

  const updateSelectedCount = () => {
    selectedCount.textContent = selectedClubs.size;
    showSelectedBtn.disabled = selectedClubs.size === 0;
  };

  const toggleClubSelection = (clubName) => {
    if (selectedClubs.has(clubName)) selectedClubs.delete(clubName);
    else selectedClubs.add(clubName);
    updateSelectedCount();
    renderClubs();
  };

  const categories = [...new Set(clubsData.map((club) => club.category))].sort();
  categoryFilter.innerHTML = `
    <option value="All">All Categories</option>
    ${categories.map((category) => `<option value="${category}">${category}</option>`).join('')}
  `;

  const filterClubs = () => {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    return clubsData.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm) || club.description.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
      const matchesSelection = !showOnlySelected || selectedClubs.has(club.name);
      return matchesSearch && matchesCategory && matchesSelection;
    });
  };

  const sortClubs = (clubs) => {
    const criterion = sortBy.value;
    const order = sortOrder.value;

    return clubs.sort((a, b) => {
      let aValue;
      let bValue;

      switch (criterion) {
        case 'timeLoad':
          aValue = a.timeLoad?.value || 0;
          bValue = b.timeLoad?.value || 0;
          break;
        case 'physicalLoad':
          aValue = a.physicalLoad?.score || 0;
          bValue = b.physicalLoad?.score || 0;
          break;
        case 'mentalLoad':
          aValue = a.mentalLoad?.score || 0;
          bValue = b.mentalLoad?.score || 0;
          break;
        case 'entryCriteria':
          aValue = a.entryCriteria?.score || 0;
          bValue = b.entryCriteria?.score || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string') {
        return order === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });
  };

  const renderSummary = (clubs) => {
    if (!clubs.length) {
      summaryStats.innerHTML = '<p class="text-gray-500">No clubs to analyze.</p>';
      return;
    }

    const total = clubs.length;
    const avgTime = (clubs.reduce((sum, c) => sum + (c.timeLoad?.value || 0), 0) / total).toFixed(1);
    const avgPhysical = (clubs.reduce((sum, c) => sum + (c.physicalLoad?.score || 0), 0) / total).toFixed(1);
    const avgMental = (clubs.reduce((sum, c) => sum + (c.mentalLoad?.score || 0), 0) / total).toFixed(1);
    const avgEntry = (clubs.reduce((sum, c) => sum + (c.entryCriteria?.score || 0), 0) / total).toFixed(1);

    summaryStats.innerHTML = `
      <div class="summary-item"><p class="text-sm text-gray-500">Total Clubs</p><p class="text-2xl font-bold text-ntu-blue">${total}</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg Time</p><p class="text-2xl font-bold text-ntu-blue">${avgTime}h</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg Physical</p><p class="text-2xl font-bold text-ntu-blue">${avgPhysical}/10</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg Mental</p><p class="text-2xl font-bold text-ntu-blue">${avgMental}/10</p></div>
      <div class="summary-item"><p class="text-sm text-gray-500">Avg Entry</p><p class="text-2xl font-bold text-ntu-red">${avgEntry}/10</p></div>
    `;

    const topCategory = Object.entries(clubs.reduce((acc, c) => ({ ...acc, [c.category]: (acc[c.category] || 0) + 1 }), {}))
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    metricTotal.textContent = clubsData.length;
    metricCommonCategory.textContent = topCategory;

    const byTime = [...clubs].sort((a, b) => (b.timeLoad?.value || 0) - (a.timeLoad?.value || 0));
    metricHighest.textContent = byTime[0]?.name || 'N/A';
    metricLowest.textContent = byTime[byTime.length - 1]?.name || 'N/A';
  };

  const renderClubs = () => {
    const clubs = sortClubs(filterClubs());

    if (!clubs.length) {
      noResultsMessage.classList.remove('hidden');
      clubGrid.innerHTML = '';
      renderSummary(clubs);
      return;
    }

    noResultsMessage.classList.add('hidden');
    clubGrid.innerHTML = clubs.map((club) => {
      const selected = selectedClubs.has(club.name);
      const tagClass = categoryStyles[club.category] || 'tag tag--default';
      return `
        <article class="club-card ${selected ? 'selected' : ''}">
          <div class="club-card-head">
            <h3 class="club-title">${club.name}</h3>
            <label class="club-checkbox-container"><input type="checkbox" ${selected ? 'checked' : ''} class="club-checkbox" data-club-name="${club.name}" aria-label="Select ${club.name}"></label>
          </div>
          <div class="club-card-tag-row"><span class="${tagClass}">${club.category}</span></div>
          <p class="club-description">${club.description}</p>
          <div class="club-metrics-grid">
            <div class="club-metric"><strong>Time</strong><span>${club.timeLoad?.text || 'N/A'}</span></div>
            <div class="club-metric metric-value-wrapper"><strong>Physical</strong><span>${club.physicalLoad?.score ?? 0}/10</span><div class="metric-justification">${club.physicalLoad?.justification || ''}</div></div>
            <div class="club-metric metric-value-wrapper"><strong>Mental</strong><span>${club.mentalLoad?.score ?? 0}/10</span><div class="metric-justification">${club.mentalLoad?.justification || ''}</div></div>
            <div class="club-metric metric-value-wrapper"><strong>Entry</strong><span>${club.entryCriteria?.score ?? 0}/10</span><div class="metric-justification">${club.entryCriteria?.justification || ''}</div></div>
          </div>
        </article>
      `;
    }).join('');

    renderSummary(clubs);
  };

  const processFiltersAndSort = () => renderClubs();
  searchBar.addEventListener('input', processFiltersAndSort);
  categoryFilter.addEventListener('change', processFiltersAndSort);
  sortBy.addEventListener('change', processFiltersAndSort);
  sortOrder.addEventListener('change', processFiltersAndSort);

  showSelectedBtn.addEventListener('click', () => { showOnlySelected = true; renderClubs(); });
  showAllBtn.addEventListener('click', () => { showOnlySelected = false; renderClubs(); });
  clearAllBtn.addEventListener('click', () => {
    selectedClubs.clear();
    showOnlySelected = false;
    updateSelectedCount();
    renderClubs();
  });

  clubGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('club-checkbox')) {
      toggleClubSelection(event.target.dataset.clubName);
    }
  });

  updateSelectedCount();
  renderClubs();
});
