import { clubsData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // DOM Elements
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

    let currentClubs = [...clubsData];
    let selectedClubs = new Set();
    let showOnlySelected = false;

    // Utility functions
    const updateSelectedCount = () => {
        selectedCount.textContent = selectedClubs.size;
        showSelectedBtn.disabled = selectedClubs.size === 0;
        showSelectedBtn.classList.toggle('opacity-50', selectedClubs.size === 0);
    };

    const toggleClubSelection = (clubName) => {
        if (selectedClubs.has(clubName)) {
            selectedClubs.delete(clubName);
        } else {
            selectedClubs.add(clubName);
        }
        updateSelectedCount();
        renderClubs();
    };

    // Filter clubs based on current filters
    const filterClubs = () => {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        return clubsData.filter(club => {
            const matchesSearch = club.name.toLowerCase().includes(searchTerm) || club.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
            const matchesSelection = !showOnlySelected || selectedClubs.has(club.name);
            return matchesSearch && matchesCategory && matchesSelection;
        });
    };

    // Sort clubs based on current sort criteria
    const sortClubs = (clubs) => {
        const sortCriteria = sortBy.value;
        const order = sortOrder.value;

        return clubs.sort((a, b) => {
            let aValue, bValue;
            switch(sortCriteria) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'timeLoad':
                    aValue = a.timeLoad.value;
                    bValue = b.timeLoad.value;
                    break;
                case 'physicalLoad':
                    aValue = a.physicalLoad.score;
                    bValue = b.physicalLoad.score;
                    break;
                case 'mentalLoad':
                    aValue = a.mentalLoad.score;
                    bValue = b.mentalLoad.score;
                    break;
                case 'entryCriteria':
                    aValue = a.entryCriteria.score;
                    bValue = b.entryCriteria.score;
                    break;
                case 'ccaPoints':
                    aValue = a.ccaPoints;
                    bValue = b.ccaPoints;
                    break;
                default:
                    return 0;
            }

            if (order === 'desc') {
                return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });
    };
    
    // Render summary statistics
    const renderSummary = (clubs) => {
        if (clubs.length === 0) {
            summaryStats.innerHTML = '<p class="text-center text-gray-500">No clubs to analyze.</p>';
            return;
        }

        const totalClubs = clubs.length;
        const avgTime = (clubs.reduce((sum, club) => sum + club.timeLoad.value, 0) / totalClubs).toFixed(1);
        const avgPhysical = (clubs.reduce((sum, club) => sum + club.physicalLoad.score, 0) / totalClubs).toFixed(1);
        const avgMental = (clubs.reduce((sum, club) => sum + club.mentalLoad.score, 0) / totalClubs).toFixed(1);
        const avgEntry = (clubs.reduce((sum, club) => sum + club.entryCriteria.score, 0) / totalClubs).toFixed(1);
        const avgCCA = (clubs.reduce((sum, club) => sum + club.ccaPoints, 0) / totalClubs).toFixed(1);

        summaryStats.innerHTML = `
            <div class="summary-item">
                <p class="text-sm text-gray-500">Avg. Time</p>
                <p class="text-2xl font-bold text-ntu-blue">${avgTime} <span class="text-base font-normal">hrs/wk</span></p>
            </div>
            <div class="summary-item">
                <p class="text-sm text-gray-500">Avg. Physical</p>
                <p class="text-2xl font-bold text-ntu-red">${avgPhysical}<span class="text-base font-normal">/10</span></p>
            </div>
            <div class="summary-item">
                <p class="text-sm text-gray-500">Avg. Mental</p>
                <p class="text-2xl font-bold text-ntu-red">${avgMental}<span class="text-base font-normal">/10</span></p>
            </div>
            <div class="summary-item">
                <p class="text-sm text-gray-500">Avg. Entry</p>
                <p class="text-2xl font-bold text-ntu-red">${avgEntry}<span class="text-base font-normal">/10</span></p>
            </div>
             <div class="summary-item">
                <p class="text-sm text-gray-500">Avg. CCA Pts</p>
                <p class="text-2xl font-bold text-ntu-blue">${avgCCA}</p>
            </div>
        `;
    };

    // Render clubs
    const renderClubs = () => {
        const getScoreColor = (score) => {
            if (score >= 8) return 'score-high';
            if (score >= 4) return 'score-medium';
            return 'score-low';
        };

        const filtered = filterClubs();
        const sorted = sortClubs(filtered);

        if (sorted.length === 0) {
            noResultsMessage.classList.remove('hidden');
            clubGrid.innerHTML = '';
        } else {
            noResultsMessage.classList.add('hidden');
            clubGrid.innerHTML = sorted.map(club => `
                <div class="club-card border-2 ${selectedClubs.has(club.name) ? 'border-ntu-red bg-red-50' : 'border-gray-200'} rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between transition-all duration-300">
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-grow">
                                <h3 class="text-lg font-bold text-ntu-blue pr-2">${club.name}</h3>
                                <span class="category-badge text-xs font-medium text-white px-2 py-1 rounded-full" data-category="${club.category}">${club.category}</span>
                            </div>
                            <div class="club-checkbox-container flex-shrink-0">
                                <input type="checkbox" ${selectedClubs.has(club.name) ? 'checked' : ''} class="club-checkbox h-6 w-6" data-club-name="${club.name}">
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mb-4 h-24 overflow-auto">${club.description}</p>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                        <div class="metric">
                            <h4 class="font-semibold text-xs text-gray-500">Time Load</h4>
                            <div class="metric-value-wrapper">
                                <p class="text-2xl font-bold text-ntu-blue">${club.timeLoad.value}<span class="text-base font-normal">hr</span></p>
                                <span class="metric-justification">${club.timeLoad.text}</span>
                            </div>
                        </div>
                        <div class="metric">
                            <h4 class="font-semibold text-xs text-gray-500">Physical</h4>
                            <div class="metric-value-wrapper">
                                <p class="text-2xl font-bold ${getScoreColor(club.physicalLoad.score)}">${club.physicalLoad.score}<span class="text-base font-normal">/10</span></p>
                                <span class="metric-justification">${club.physicalLoad.justification}</span>
                            </div>
                        </div>
                        <div class="metric">
                            <h4 class="font-semibold text-xs text-gray-500">Mental</h4>
                            <div class="metric-value-wrapper">
                                <p class="text-2xl font-bold ${getScoreColor(club.mentalLoad.score)}">${club.mentalLoad.score}<span class="text-base font-normal">/10</span></p>
                                <span class="metric-justification">${club.mentalLoad.justification}</span>
                            </div>
                        </div>
                        <div class="metric">
                            <h4 class="font-semibold text-xs text-gray-500">Entry</h4>
                             <div class="metric-value-wrapper">
                                <p class="text-2xl font-bold ${getScoreColor(club.entryCriteria.score)}">${club.entryCriteria.score}<span class="text-base font-normal">/10</span></p>
                                <span class="metric-justification">${club.entryCriteria.justification}</span>
                            </div>
                        </div>
                        <div class="metric">
                            <h4 class="font-semibold text-xs text-gray-500">CCA Pts</h4>
                            <p class="text-2xl font-bold text-ntu-blue">${club.ccaPoints}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        updateSelectedCount();
        renderSummary(sorted);
    };

    // Main process function
    const processFiltersAndSort = () => {
        renderClubs();
    };

    // Event Listeners
    searchBar.addEventListener('input', processFiltersAndSort);
    categoryFilter.addEventListener('change', processFiltersAndSort);
    sortBy.addEventListener('change', processFiltersAndSort);
    sortOrder.addEventListener('change', processFiltersAndSort);

    showSelectedBtn.addEventListener('click', () => {
        showOnlySelected = true;
        showSelectedBtn.classList.add('bg-ntu-red', 'text-white');
        showSelectedBtn.classList.remove('bg-gray-200');
        showAllBtn.classList.add('bg-gray-200');
        showAllBtn.classList.remove('bg-ntu-red', 'text-white');
        processFiltersAndSort();
    });

    showAllBtn.addEventListener('click', () => {
        showOnlySelected = false;
        showAllBtn.classList.add('bg-ntu-red', 'text-white');
        showAllBtn.classList.remove('bg-gray-200');
        showSelectedBtn.classList.add('bg-gray-200');
        showSelectedBtn.classList.remove('bg-ntu-red', 'text-white');
        processFiltersAndSort();
    });
    
    clearAllBtn.addEventListener('click', () => {
        selectedClubs.clear();
        showOnlySelected = false;
        showAllBtn.classList.add('bg-ntu-red', 'text-white');
        showAllBtn.classList.remove('bg-gray-200');
        showSelectedBtn.classList.add('bg-gray-200');
        showSelectedBtn.classList.remove('bg-ntu-red', 'text-white');
        processFiltersAndSort();
    });

    clubGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('club-checkbox')) {
            const clubName = e.target.dataset.clubName;
            toggleClubSelection(clubName);
        }
    });

    // Initial render
    processFiltersAndSort();
});
