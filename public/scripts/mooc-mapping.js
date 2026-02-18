const CSV_PATH = '../data/MOOC-Mapping.csv';

const state = {
  rows: [],
  search: '',
  platform: 'all',
  aus: new Set(),
  selectedTitles: new Set(),
  free: 'all',
  showSelectedOnly: false,
  courseTag: 'all',
  sort: 'title'
};

const el = {
  search: document.getElementById('search-input'),
  platformSelect: document.getElementById('platform-filter'),
  auCheckboxes: Array.from(document.querySelectorAll('input[name="au-filter"]')),
  free: document.getElementById('free-filter'),
  sort: document.getElementById('sort-filter'),
  courseTypeSelect: document.getElementById('course-type-filter'),
  tbody: document.getElementById('results-tbody'),
  cards: document.getElementById('results-cards'),
  resultsCount: document.getElementById('results-count'),
  emptyState: document.getElementById('empty-state'),
  errorState: document.getElementById('error-state'),
  clearFiltersBtn: document.getElementById('clear-filters-btn'),
  showSelectedBtn: document.getElementById('show-selected-btn'),
  tableWrap: document.getElementById('results-table-wrap')
};

init();

async function init() {
  bindControls();

  try {
    const response = await fetch(CSV_PATH);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const parsed = parseCsv(text);
    state.rows = parsed.map(normalizeRow).sort(sortByTitle);

    renderPlatformOptions();
    renderCourseTypeOptions();
    render();
  } catch (error) {
    console.error('Failed loading MOOC CSV:', error);
    el.errorState.hidden = false;
    el.tableWrap.hidden = true;
    el.cards.hidden = true;
    el.resultsCount.textContent = '';
  }
}

function bindControls() {
  el.search.addEventListener('input', (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  el.auCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.aus.add(checkbox.value);
      else state.aus.delete(checkbox.value);
      render();
    });
  });

  el.free.addEventListener('change', (event) => {
    state.free = event.target.value;
    render();
  });

  el.platformSelect?.addEventListener('change', (event) => {
    state.platform = event.target.value;
    render();
  });

  el.courseTypeSelect?.addEventListener('change', (event) => {
    state.courseTag = event.target.value;
    render();
  });

  el.sort.addEventListener('change', (event) => {
    state.sort = event.target.value;
    render();
  });

  el.clearFiltersBtn?.addEventListener('click', clearFilters);

  el.showSelectedBtn?.addEventListener('click', () => {
    state.showSelectedOnly = !state.showSelectedOnly;
    el.showSelectedBtn.setAttribute('aria-pressed', String(state.showSelectedOnly));
    el.showSelectedBtn.textContent = state.showSelectedOnly ? 'Showing selected' : 'Show selected';
    render();
  });
}

function clearFilters() {
  state.search = '';
  state.platform = 'all';
  state.aus.clear();
  state.free = 'all';
  state.courseTag = 'all';
  state.showSelectedOnly = false;
  state.sort = 'title';

  el.search.value = '';
  el.free.value = 'all';
  if (el.platformSelect) el.platformSelect.value = 'all';
  if (el.courseTypeSelect) el.courseTypeSelect.value = 'all';
  el.sort.value = 'title';

  if (el.showSelectedBtn) {
    el.showSelectedBtn.textContent = 'Show selected';
    el.showSelectedBtn.setAttribute('aria-pressed', 'false');
  }

  el.auCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  render();
}

function renderPlatformOptions() {
  if (!el.platformSelect) return;
  const uniquePlatforms = [...new Set(state.rows.map((row) => row.platform).filter(Boolean))].sort();
  const options = ['<option value="all">All platforms</option>']
    .concat(uniquePlatforms.map((platform) => `<option value="${escapeHtml(platform)}">${escapeHtml(platform)}</option>`));
  el.platformSelect.innerHTML = options.join('');
}

function renderCourseTypeOptions() {
  if (!el.courseTypeSelect) return;
  const tags = [...new Set(state.rows.flatMap((row) => row.derivedTags))].sort((a, b) => a.localeCompare(b));
  const options = ['<option value="all">All course types</option>']
    .concat(tags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`));
  el.courseTypeSelect.innerHTML = options.join('');
}

function render() {
  const filtered = getFilteredAndSortedRows();
  const isEmpty = filtered.length === 0;

  el.resultsCount.textContent = `${filtered.length} course${filtered.length === 1 ? '' : 's'} found`;
  el.emptyState.hidden = !isEmpty;
  el.tableWrap.hidden = isEmpty;
  el.cards.hidden = isEmpty;

  renderTable(filtered);
  renderCards(filtered);
}

function getFilteredAndSortedRows() {
  const rows = state.rows.filter((row) => {
    const keyword = state.search;
    const matchesSearch = !keyword || `${row.title} ${row.provider}`.toLowerCase().includes(keyword);

    const matchesPlatform = state.platform === 'all' || row.platform === state.platform;
    const matchesAu = state.aus.size === 0 || state.aus.has(String(row.au));

    const freeValue = row.free.toLowerCase();
    const matchesFree = state.free === 'all' || freeValue === state.free;

    const matchesCourseTag = state.courseTag === 'all' || row.derivedTags.includes(state.courseTag);
    const matchesSelected = !state.showSelectedOnly || state.selectedTitles.has(row.title);

    return matchesSearch && matchesPlatform && matchesAu && matchesFree && matchesCourseTag && matchesSelected;
  });

  return rows.sort((a, b) => {
    if (state.sort === 'au-desc') return b.au - a.au || sortByTitle(a, b);
    if (state.sort === 'au-asc') return a.au - b.au || sortByTitle(a, b);
    if (state.sort === 'date-newest') return b.enrolDateObj - a.enrolDateObj || sortByTitle(a, b);
    return sortByTitle(a, b);
  });
}

function renderTable(rows) {
  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(row.title)}</td>
      <td><span class="meta-pill platform">${escapeHtml(row.platform)}</span></td>
      <td>${escapeHtml(row.provider)}</td>
      <td><span class="meta-pill au">${row.au}</span></td>
      <td>${renderTagGroup(row)}</td>
      <td><span class="meta-pill ${row.free === 'Yes' ? 'free-yes' : 'free-no'}">${escapeHtml(row.free)}</span></td>
      <td><button type="button" class="btn-link select-btn" aria-pressed="${state.selectedTitles.has(row.title)}">${state.selectedTitles.has(row.title) ? 'Selected' : 'Select'}</button></td>
      <td><button type="button" class="btn-link" aria-expanded="false">Details</button></td>
    `;

    const detailTr = document.createElement('tr');
    detailTr.className = 'details-row';
    detailTr.hidden = true;
    detailTr.innerHTML = `<td colspan="8"><strong>Full Course Type:</strong> ${escapeHtml(row.courseType || 'Not stated')}<br /><strong>Enrolment Date:</strong> ${escapeHtml(row.enrolDate || 'Not stated')}</td>`;

    const detailsBtn = tr.querySelector('button[aria-expanded]');
    const selectBtn = tr.querySelector('.select-btn');

    selectBtn?.addEventListener('click', () => {
      const isSelected = state.selectedTitles.has(row.title);
      if (isSelected) state.selectedTitles.delete(row.title);
      else state.selectedTitles.add(row.title);
      render();
    });

    detailsBtn?.addEventListener('click', () => {
      const nextState = detailTr.hidden;
      detailTr.hidden = !nextState;
      detailsBtn.setAttribute('aria-expanded', String(nextState));
      detailsBtn.textContent = nextState ? 'Hide' : 'Details';
    });

    fragment.appendChild(tr);
    fragment.appendChild(detailTr);
  });

  el.tbody.innerHTML = '';
  el.tbody.appendChild(fragment);
}

function renderCards(rows) {
  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const card = document.createElement('article');
    card.className = 'result-card';

    card.innerHTML = `
      <h3>${escapeHtml(row.title)}</h3>
      <div class="card-meta">
        <p><strong>Platform:</strong> ${escapeHtml(row.platform)}</p>
        <p><strong>Provider:</strong> ${escapeHtml(row.provider)}</p>
        <p><strong>AU:</strong> ${row.au}</p>
        <p><strong>Free:</strong> ${escapeHtml(row.free)}</p>
      </div>
      <div class="tag-group">${renderTagPills(row)}</div>
      <button type="button" class="btn-link select-btn" aria-pressed="${state.selectedTitles.has(row.title)}">${state.selectedTitles.has(row.title) ? 'Selected' : 'Select'}</button>
      <button type="button" class="btn-link" aria-expanded="false">Details</button>
      <div class="card-detail" hidden><strong>Full Course Type:</strong> ${escapeHtml(row.courseType || 'Not stated')}<br /><strong>Enrolment Date:</strong> ${escapeHtml(row.enrolDate || 'Not stated')}</div>
    `;

    const selectBtn = card.querySelector('.select-btn');
    const btn = card.querySelector('button[aria-expanded]');
    const panel = card.querySelector('.card-detail');

    selectBtn?.addEventListener('click', () => {
      const isSelected = state.selectedTitles.has(row.title);
      if (isSelected) state.selectedTitles.delete(row.title);
      else state.selectedTitles.add(row.title);
      render();
    });

    btn?.addEventListener('click', () => {
      const nextState = panel.hidden;
      panel.hidden = !nextState;
      btn.setAttribute('aria-expanded', String(nextState));
      btn.textContent = nextState ? 'Hide' : 'Details';
    });

    fragment.appendChild(card);
  });

  el.cards.innerHTML = '';
  el.cards.appendChild(fragment);
}

function renderTagGroup(row) {
  return `<div class="tag-group">${renderTagPills(row)}</div>`;
}

function renderTagPills(row) {
  const pills = [
    `<span class="meta-pill platform">${escapeHtml(row.platform)}</span>`,
    `<span class="meta-pill au">${row.au}</span>`,
    ...row.derivedTags.map((tag) => `<span class="meta-pill type">${escapeHtml(tag)}</span>`),
    `<span class="meta-pill ${row.free === 'Yes' ? 'free-yes' : 'free-no'}">${escapeHtml(row.free)}</span>`
  ];

  return pills.join('');
}

function normalizeRow(row) {
  const platform = row['Platform']?.trim() || 'Other';
  const title = row['Course Title']?.trim() || 'Untitled Course';
  const provider = row['Content Developer']?.trim() || 'Unknown';
  const au = Number.parseInt((row['Equivalent AU'] || '0').trim(), 10) || 0;
  const courseType = row['Course Type']?.trim() || '';
  const enrolDate = row['Enrolment Date']?.trim() || '';
  const enrolDateObj = parseDate(enrolDate);
  const free = (row['Free for NTU students'] || 'No').trim();
  const derivedTags = deriveCourseTypeTags(courseType);

  return { platform, title, provider, au, courseType, enrolDate, enrolDateObj, free, derivedTags };
}

function deriveCourseTypeTags(text) {
  if (!text) return [];
  const matches = text.match(/GER-PE\s*\([^)]+\)|UE|BDE/g) || [];
  return [...new Set(matches.map((item) => item.replace(/\s+/g, ' ').trim()))];
}

function parseDate(value) {
  const parts = value.split('-');
  if (parts.length !== 3) return new Date('1900-01-01');

  const [day, mon, yy] = parts;
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const year = Number(yy) + 2000;
  const month = months[mon] ?? 0;
  const date = Number(day) || 1;
  return new Date(year, month, date);
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let value = '';
  let i = 0;
  let inQuotes = false;

  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i += 1;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      i += 1;
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
      i += 1;
      continue;
    }

    value += char;
    i += 1;
  }

  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [header = [], ...dataRows] = rows.filter((current) => current.some((cell) => cell.trim() !== ''));

  return dataRows.map((dataRow) => {
    const entry = {};
    header.forEach((key, index) => {
      entry[key] = dataRow[index] ?? '';
    });
    return entry;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
