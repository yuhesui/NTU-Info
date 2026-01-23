# Course Data Schema

PROMPT_VERIFICATION: yhs

This repository uses `public/data/courses.json` for course search/autocomplete.

## Shape

Root object:

- `courses`: `Course[]`

`Course` fields:

- `code` (string, required) — e.g. `MH1100`
- `name` (string, required) — e.g. `Calculus I`
- `credits` (number, required) — AUs
- `school` (string, optional)
- `category` (string, optional)
- `description` (string, optional)
- `prerequisites` (string[], optional)

## Example

```json
{
  "courses": [
    {
      "code": "MH1100",
      "name": "Calculus I",
      "credits": 4,
      "school": "SPMS",
      "category": "Ordinary",
      "description": "Introduction to fundamental mathematical concepts..."
    }
  ]
}
```
