#!/usr/bin/env node
/**
 * Build `public/data/courses.json`.
 *
 * Requirements:
 * - Prefer parsing `courses.txt` (HTML format)
 * - Validate output schema
 * - Ensure >= 100 courses
 * - Print PROMPT_VERIFICATION at start and end
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCoursesHtml, normalizeCourses } from '../utils/courseParser.js';
import { validateCoursesJson } from '../utils/dataValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

console.log('PROMPT_VERIFICATION: yhs');

const publicOut = path.resolve(repoRoot, 'public', 'data', 'courses.json');

const searchedPaths = [
  path.resolve(repoRoot, 'courses.txt'),
  path.resolve(repoRoot, 'data', 'courses.txt'),
  path.resolve(repoRoot, 'public', 'data', 'courses.txt')
];

const strict = process.env.STRICT_COURSES === '1' || process.argv.includes('--strict');
const allowFallback = !strict && (process.env.ALLOW_ARCHIVED_FALLBACK === '1' || process.argv.includes('--allow-archived-fallback'));

/**
 * @returns {{ source: string, html: string }}
 */
function readSource() {
  for (const p of searchedPaths) {
    if (fs.existsSync(p)) {
      return { source: p, html: fs.readFileSync(p, 'utf8') };
    }
  }

  if (allowFallback) {
    const archived = path.resolve(repoRoot, 'archived', 'v3', 'Data', 'courses.json');
    if (fs.existsSync(archived)) {
      const json = JSON.parse(fs.readFileSync(archived, 'utf8'));
      if (!Array.isArray(json?.courses)) throw new Error('Archived fallback courses.json missing .courses array');

      // Normalize for output
      const courses = normalizeCourses(
        json.courses.map((c) => ({
          code: String(c.code || '').toUpperCase().trim(),
          name: String(c.name || '').trim(),
          credits: Number(c.credits),
          school: c.school ? String(c.school) : undefined,
          category: c.category ? String(c.category) : undefined,
          description: c.description ? String(c.description) : undefined,
          prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(String) : undefined
        }))
      );

      return { source: archived, html: JSON.stringify({ courses }) };
    }
  }

  const msg = [
    'courses.txt not found at expected paths.',
    'Checked:',
    ...searchedPaths.map((p) => `- ${p}`),
    allowFallback
      ? 'Tried fallback: archived/v3/Data/courses.json (not found or invalid).'
      : 'Fallback disabled (STRICT mode).'
  ].join('\n');

  throw new Error(msg);
}

try {
  const { source, html } = readSource();

  /** @type {any} */
  let built;

  if (source.endsWith('.json')) {
    built = JSON.parse(html);
  } else {
    const parsed = normalizeCourses(parseCoursesHtml(html));
    built = { courses: parsed };
  }

  const validation = validateCoursesJson(built);
  if (!validation.ok) {
    throw new Error(`Validation failed:\n${validation.errors.join('\n')}`);
  }

  if (validation.courses.length < 100) {
    throw new Error(`Expected >= 100 unique courses, got ${validation.courses.length}.`);
  }

  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(publicOut, JSON.stringify({ courses: validation.courses }, null, 2) + '\n', 'utf8');

  const size = fs.statSync(publicOut).size;
  console.log(`Wrote ${validation.courses.length} courses to ${path.relative(repoRoot, publicOut)} (${Math.round(size / 1024)} KB)`);

  console.log('PROMPT_VERIFICATION: yhs');
} catch (err) {
  console.error(String(err?.message || err));
  process.exitCode = 1;
  console.log('PROMPT_VERIFICATION: yhs');
}
