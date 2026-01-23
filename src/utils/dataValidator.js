/**
 * Minimal schema validation for courses.json.
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
 * @param {any} json
 * @returns {{ ok: true, courses: Course[] } | { ok: false, errors: string[] }}
 */
export function validateCoursesJson(json) {
  const errors = [];
  if (!json || typeof json !== 'object') errors.push('Root must be an object');
  const courses = json?.courses;
  if (!Array.isArray(courses)) errors.push('Root.courses must be an array');

  /** @type {Course[]} */
  const out = [];

  if (Array.isArray(courses)) {
    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      if (!c || typeof c !== 'object') {
        errors.push(`courses[${i}] must be an object`);
        continue;
      }
      if (typeof c.code !== 'string' || !c.code.trim()) errors.push(`courses[${i}].code must be non-empty string`);
      if (typeof c.name !== 'string' || !c.name.trim()) errors.push(`courses[${i}].name must be non-empty string`);
      if (typeof c.credits !== 'number' || !Number.isFinite(c.credits) || c.credits <= 0) {
        errors.push(`courses[${i}].credits must be a positive number`);
      }
      if (c.prerequisites !== undefined) {
        if (!Array.isArray(c.prerequisites) || c.prerequisites.some((p) => typeof p !== 'string')) {
          errors.push(`courses[${i}].prerequisites must be string[] when present`);
        }
      }
      out.push(/** @type {Course} */ (c));
    }
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, courses: out };
}
