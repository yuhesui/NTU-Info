/**
 * localStorage helpers for NTU Info tools.
 * Keeps keys stable and provides light schema migration.
 */

const STORAGE_KEYS = {
  cgpa: 'ntuinfo_cgpa_data',
  exams: 'ntuinfo_exam_data'
};

/**
 * Safely parse JSON from localStorage.
 * @param {string} key
 * @param {any} fallback
 */
export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely write JSON to localStorage.
 * @param {string} key
 * @param {unknown} value
 */
export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy mode.
  }
}

export function getCgpaKey() {
  return STORAGE_KEYS.cgpa;
}

export function getExamKey() {
  return STORAGE_KEYS.exams;
}
