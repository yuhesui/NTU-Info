/**
 * Autocomplete component for course search.
 * Loads /data/courses.json and provides substring matching by code/name.
 */

/**
 * @typedef {Object} Course
 * @property {string} code
 * @property {string} name
 * @property {number} credits
 * @property {string=} school
 * @property {string=} category
 * @property {string=} description
 * @property {string[]=} prerequisites
 */

/**
 * @typedef {Object} AutocompleteResult
 * @property {Course} course
 * @property {string} label
 */

const DEFAULT_MAX_RESULTS = 10;

/**
 * @param {string} value
 */
function normalize(value) {
  return (value || '').trim().toLowerCase();
}

/**
 * Debounce helper.
 * @param {(function(...any): any)} fn
 * @param {number} delay
 */
function debounce(fn, delay) {
  let t = 0;
  return function (...args) {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * @param {Course[]} courses
 * @param {string} query
 * @param {number} maxResults
 * @returns {AutocompleteResult[]}
 */
export function searchCourses(courses, query, maxResults = DEFAULT_MAX_RESULTS) {
  const q = normalize(query);
  if (!q) return [];

  const results = [];
  for (const c of courses) {
    const code = normalize(c.code);
    const name = normalize(c.name);

    // Simple scoring: startsWith > includes
    let score = 0;
    if (code.startsWith(q)) score += 3;
    else if (code.includes(q)) score += 2;
    if (name.startsWith(q)) score += 2;
    else if (name.includes(q)) score += 1;

    if (score > 0) {
      results.push({
        course: c,
        label: `${c.code} — ${c.name}${Number.isFinite(c.credits) ? ` (${c.credits} AU)` : ''}`,
        _score: score
      });
    }
  }

  results.sort((a, b) => b._score - a._score || a.course.code.localeCompare(b.course.code));
  return results.slice(0, maxResults).map(({ _score, ...rest }) => rest);
}

/**
 * @typedef {Object} AutocompleteController
 * @property {() => void} destroy
 */

/**
 * Attach autocomplete UI to a pair of inputs.
 * @param {HTMLInputElement} codeInput
 * @param {HTMLInputElement} nameInput
 * @param {{ dataUrl?: string, maxResults?: number }} [options]
 * @returns {Promise<AutocompleteController>}
 */
export async function attachCourseAutocomplete(codeInput, nameInput, options = {}) {
  const dataUrl = options.dataUrl ?? '../data/courses.json';
  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;

  /** @type {Course[]} */
  let courses = [];
  try {
    const res = await fetch(dataUrl, { cache: 'no-store' });
    const json = await res.json();
    courses = Array.isArray(json?.courses) ? json.courses : [];
  } catch {
    courses = [];
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'autocomplete-wrapper';
  codeInput.parentElement?.appendChild(wrapper);
  wrapper.appendChild(codeInput);

  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.setAttribute('role', 'listbox');
  wrapper.appendChild(dropdown);

  let selectedIndex = -1;
  /** @type {AutocompleteResult[]} */
  let currentResults = [];

  function close() {
    dropdown.classList.remove('active');
    dropdown.innerHTML = '';
    selectedIndex = -1;
    currentResults = [];
  }

  function open() {
    dropdown.classList.add('active');
  }

  /** @param {AutocompleteResult[]} results */
  function render(results) {
    dropdown.innerHTML = '';
    currentResults = results;
    selectedIndex = -1;

    if (!results.length) {
      close();
      return;
    }

    for (let i = 0; i < results.length; i++) {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.setAttribute('role', 'option');
      item.setAttribute('id', `ac-item-${Math.random().toString(16).slice(2)}`);

      const c = results[i].course;
      item.innerHTML = `
        <div class="course-code">${c.code}</div>
        <div class="course-name">${c.name}</div>
        <div class="course-credits">${Number.isFinite(c.credits) ? `${c.credits} AU` : ''}</div>
      `;

      item.addEventListener('mousedown', (e) => {
        // mousedown to prevent blur closing dropdown before click.
        e.preventDefault();
        codeInput.value = c.code;
        nameInput.value = c.name;
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        close();
      });

      dropdown.appendChild(item);
    }

    open();
  }

  const update = debounce(() => {
    render(searchCourses(courses, codeInput.value, maxResults));
  }, 120);

  function setSelected(nextIndex) {
    const items = Array.from(dropdown.querySelectorAll('.autocomplete-item'));
    items.forEach((n) => n.classList.remove('selected'));

    if (nextIndex < 0 || nextIndex >= items.length) {
      selectedIndex = -1;
      codeInput.removeAttribute('aria-activedescendant');
      return;
    }

    selectedIndex = nextIndex;
    const el = items[selectedIndex];
    el.classList.add('selected');
    const id = el.getAttribute('id');
    if (id) codeInput.setAttribute('aria-activedescendant', id);
  }

  function chooseSelected() {
    if (selectedIndex < 0 || selectedIndex >= currentResults.length) return;
    const { course } = currentResults[selectedIndex];
    codeInput.value = course.code;
    nameInput.value = course.name;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    close();
  }

  function onKeyDown(e) {
    if (!dropdown.classList.contains('active')) {
      if (e.key === 'ArrowDown') {
        update();
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Escape') {
      close();
      e.preventDefault();
      return;
    }

    const items = dropdown.querySelectorAll('.autocomplete-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      setSelected((selectedIndex + 1) % items.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelected((selectedIndex - 1 + items.length) % items.length);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      chooseSelected();
      e.preventDefault();
    }
  }

  function onBlur() {
    // slight delay so click/mousedown can select
    window.setTimeout(() => close(), 120);
  }

  codeInput.setAttribute('autocomplete', 'off');
  codeInput.setAttribute('aria-autocomplete', 'list');
  codeInput.addEventListener('input', update);
  codeInput.addEventListener('keydown', onKeyDown);
  codeInput.addEventListener('blur', onBlur);

  return {
    destroy() {
      codeInput.removeEventListener('input', update);
      codeInput.removeEventListener('keydown', onKeyDown);
      codeInput.removeEventListener('blur', onBlur);
      close();
    }
  };
}
