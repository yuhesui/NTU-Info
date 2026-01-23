# Setup

PROMPT_VERIFICATION: yhs

## Prerequisites

- Node.js 18+ is required to run build scripts (CI will run them).

> Note: In this workspace environment, `node`/`npm` may not be available in PATH. If you see “command not found”, install Node.js and ensure it’s on PATH.

## Build course dataset

The intended source is `courses.txt` (HTML format).

Paths checked by the builder:

- `./courses.txt`
- `./data/courses.txt`
- `./public/data/courses.txt`

Run:

```powershell
node src\scripts\build-courses.js --strict
```

### Temporary fallback (dev only)

If `courses.txt` is not available yet, you may use the archived v3 dataset as a stopgap:

```powershell
node src\scripts\build-courses.js --allow-archived-fallback
```

**Warning:** the archived dataset currently contains fewer than 100 courses and will not satisfy acceptance criteria.
