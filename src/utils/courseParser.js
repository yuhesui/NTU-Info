/**
 * Course parser for NTU HTML-formatted courses.txt.
 *
 * NOTE: Repo currently doesn't contain courses.txt; build script will fail fast
 * unless an explicit fallback is used.
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
 * Very conservative parser:
 * - Extracts chunks that look like: CODE ... Name ... (AUs/Credits)
 * - Works best with consistent HTML export.
 *
 * @param {string} html
 * @returns {Course[]}
 */
export function parseCoursesHtml(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  /** @type {Course[]} */
  const courses = [];

  // Heuristic regex: e.g. "MH1100 Calculus I 4" or "MH1100 Calculus I (4 AU)"
  const re = /\b([A-Z]{2,3}\d{4})\b\s+([^\d]{3,120}?)\s*(?:\(|\b)(\d(?:\.\d)?)\s*(?:AU|AUs|Credits|credit|\))?/g;
  let m;
  while ((m = re.exec(text))) {
    const code = m[1].trim();
    const name = m[2].trim().replace(/\s{2,}/g, ' ');
    const credits = Number(m[3]);
    if (!code || !name || !Number.isFinite(credits)) continue;
    courses.push({ code, name, credits });
  }

  return courses;
}

/**
 * Standardize, de-duplicate, sort.
 * @param {Course[]} courses
 * @returns {Course[]}
 */
export function normalizeCourses(courses) {
  const map = new Map();
  for (const c of courses) {
    const code = (c.code || '').toUpperCase().trim();
    if (!code) continue;
    const name = (c.name || '').trim();
    const credits = Number(c.credits);
    if (!name || !Number.isFinite(credits) || credits <= 0) continue;

    if (!map.has(code)) {
      map.set(code, { ...c, code, name, credits });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
}
