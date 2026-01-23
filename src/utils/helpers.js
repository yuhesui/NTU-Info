/**
 * Shared helpers for node scripts.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} p
 */
export function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} startDir
 * @param {string[]} fileNames
 * @returns {string|null}
 */
export function findFirstExisting(startDir, fileNames) {
  for (const name of fileNames) {
    const cand = path.resolve(startDir, name);
    if (exists(cand)) return cand;
  }
  return null;
}
