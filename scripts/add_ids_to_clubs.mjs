import fs from 'fs';
import path from 'path';

const clubsPath = path.resolve('public', 'data', 'clubs.json');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'unknown';
}

function idFromName(name) {
  return `club-${slugify(name)}`;
}

function run() {
  const raw = fs.readFileSync(clubsPath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.error('clubs.json does not contain an array');
    process.exit(1);
  }
  const out = data.map((c, idx) => ({
    id: c.id || idFromName(c.name || String(idx)),
    ...c
  }));
  fs.writeFileSync(clubsPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote ids to', clubsPath);
}

run();
