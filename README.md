# NTU Info

A static, student-built portal of NTU tools and guides (no backend required).

## Features

- **CGPA Calculator**: Track modules by semester and compute CGPA (NTU 5-point scale).
- **Banner tab navigation**: Accessible tabs (keyboard + touch) with persistent selection via `localStorage`.
- **Student Journey Toolkit (production-ready)**
  - **Clubs & Societies Explorer**: Search, filter, and save club selections.
  - **Airport Arrival Guide**: Step-by-step Changi arrival guide with terminal/zone tabs and language toggle.

## Student Journey Toolkit

These are first-class tools and live under dedicated page folders:

- **Clubs & Societies Explorer**
  - Path: `public/pages/clubs/index.html`
  - What it does: Browse the NTU clubs database with search, category filters, sorting, and a “selected clubs” view.
  - Data: `public/data/clubs.json`

- **Airport Arrival Guide**
  - Path: `public/pages/airport/index.html`
  - What it does: A guided arrival flow with sections, terminal tabs, zone tabs, and a bilingual (ZH/EN) toggle.
  - Data: (content is currently embedded; future structured data should live in `public/data/`)

## Project Layout

```text
public/
  index.html
  styles/
    variables.css
    shared.css
    main.css
    clubs-legacy.css
  scripts/
    main.js
    bannerTabs.js
    calculator.js
    ...
  data/
    clubs.json
    courses.json
    cca_data.js
  pages/
    clubs/
      index.html
      style.css
      script.js
    airport/
      index.html
      style.css
      script.js
    calculator.html
    timetable.html
    math-notes.html
    mooc-mapping.html
    canteens.html
    about.html
```

### Notes

- **Complex tools live in `public/pages/<tool>/`** (own HTML + CSS + JS).
- **Data remains in `public/data/`**.
- **No runtime dependency on `./archived/`**. Archived content is reference-only.
- **No external CDN libraries** (fonts/icons/scripts). This keeps the site deterministic and offline-friendly.

## Development

This is a static site. You can serve `public/` with any static server.

If you have Node installed, you can optionally run unit tests (Jest/jsdom) under `tests/`.

## License

See repository license (if present).
