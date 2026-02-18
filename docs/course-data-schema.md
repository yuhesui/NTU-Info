# Course Data Schema Documentation

## Overview
This document defines the data structure and format for the NTU course database (`public/data/courses.json`).

## JSON Schema

### Root Object
```json
{
  "courses": [...]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courses` | Array | ✓ | Array of course objects |

---

## Course Object Schema

### Required Fields

```json
{
  "code": "MH1100",
  "name": "Calculus I",
  "credits": 4,
  "school": "SPMS",
  "category": "Ordinary"
}
```

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `code` | String | ✓ | Unique course code (alphanumeric, uppercase) | `"MH1100"`, `"CY1601"`, `"CE1104"` |
| `name` | String | ✓ | Full course name (title case) | `"Calculus I"`, `"Linear Algebra II"` |
| `credits` | Number | ✓ | Course credit units (integer) | `4`, `3`, `2` |
| `school` | String | ✓ | School/college offering course | `"SPMS"`, `"SCSE"`, `"CEE"` |
| `category` | String | ✓ | Course category/type | `"Ordinary"`, `"GER/BDE"`, `"Non-Math Majors"` |

### Optional Fields

```json
{
  "description": "Introduction to fundamental mathematical concepts...",
  "prerequisite": ["MH1100"],
  "mutuallyExclusive": ["MH1101", "MH1800"],
  "availability": "Every Semester"
}
```

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `description` | String | ✗ | Detailed course description | `"Introduction to fundamental mathematical..."` |
| `prerequisite` | Array | ✗ | List of prerequisite course codes | `["MH1100"]`, `["MH1100", "MH1200"]` |
| `mutuallyExclusive` | Array | ✗ | List of courses that cannot be taken together | `["MH1101", "MH1800"]` |
| `availability` | String | ✗ | When course is offered | `"Every Semester"`, `"Odd Semesters"` |

---

## Complete Example

### Single Course Entry
```json
{
  "code": "MH1100",
  "name": "Calculus I",
  "credits": 4,
  "school": "SPMS",
  "category": "Ordinary",
  "description": "Introduction to the fundamental mathematical concepts (functions, limits, continuity, derivatives and integrals). Computation of derivatives (sum, product and quotient formulas, chain rule and implicit differentiation), and application of derivatives to optimization problems and related rates of change problems will also be discussed.",
  "prerequisite": [],
  "mutuallyExclusive": ["MH110S", "MH1800", "MH1801", "MH1802", "MH1805", "MH1810", "MH1811", "CY1601"],
  "availability": "Every Semester"
}
```

### Complete courses.json Structure
```json
{
  "courses": [
    {
      "code": "MH1100",
      "name": "Calculus I",
      "credits": 4,
      "school": "SPMS",
      "category": "Ordinary",
      "description": "Introduction to fundamental mathematical concepts...",
      "prerequisite": [],
      "mutuallyExclusive": ["MH1101", "MH1800"],
      "availability": "Every Semester"
    },
    {
      "code": "MH1101",
      "name": "Calculus II",
      "credits": 4,
      "school": "SPMS",
      "category": "Ordinary",
      "description": "Development of definite integrals and applications...",
      "prerequisite": ["MH1100"],
      "mutuallyExclusive": ["MH1100", "MH1800"],
      "availability": "Every Semester"
    }
  ]
}
```

---

## Validation Rules

### Code Field
- **Format**: `[A-Z]{1,3}\d{4}[A-Z]{0,1}` (e.g., MH1100, CY1601, RE1001)
- **Uniqueness**: MUST be unique across all courses
- **Case**: MUST be uppercase

### Name Field
- **Format**: Title case (first letter of each word capitalized)
- **Length**: 3-100 characters
- **Allowed Characters**: Letters, numbers, hyphens, parentheses

### Credits Field
- **Type**: Integer (no decimal values)
- **Range**: 1-12 AU
- **Common Values**: 2, 3, 4, 6 AU

### School Field
- **Allowed Values**: `SPMS`, `SCSE`, `CEE`, `NBS`, `WKW`, `ADM`, `ENG`, `LMS`, `DRI`

### Category Field
- **Allowed Values**:
  - `Ordinary`
  - `Non-Math Majors`
  - `Projects and Internships`
  - `Supervised Study`
  - `Special Topics`
  - `GER/BDE`
  - `Graduate-Level`

### Prerequisite Field
- **Type**: Array of course codes
- **Validation**: Each code MUST exist in courses database
- **Empty**: Use `[]` if no prerequisites

### Mutually Exclusive Field
- **Type**: Array of course codes
- **Validation**: Each code MUST exist in courses database
- **Empty**: Use `[]` if no mutually exclusive courses

---

## Data Quality Checks

### Mandatory Validations
- [ ] All required fields present for each course
- [ ] `code` is unique (no duplicates)
- [ ] `code` matches regex pattern
- [ ] `name` is non-empty and reasonable length
- [ ] `credits` is positive integer
- [ ] `school` is from allowed values
- [ ] `category` is from allowed values
- [ ] All arrays (prerequisite, mutuallyExclusive) contain valid course codes

### Data Integrity Checks
- [ ] Prerequisite codes exist in database
- [ ] Mutually exclusive codes exist in database
- [ ] No circular prerequisite chains
- [ ] Description field has minimum 20 characters (if provided)
- [ ] No duplicate courses by (code, name)

---

## Categories Breakdown

### 1. Ordinary Courses
Standard undergraduate mathematics courses
- Examples: MH1100, MH1200, MH2200
- Typically 4 AU

### 2. Non-Math Majors
Math courses for students outside SPMS
- Examples: CE1104, CZ1104, SC1004
- For engineering, chemistry, computer science students
- Typically 3-4 AU

### 3. Projects and Internships
FYP, internships, research projects
- Examples: MH4791, MH4792
- Variable credits (2-4 AU)

### 4. Supervised Study
Independent study and special topics
- Variable credits

### 5. GER/BDE Courses
General Education Requirement / Broadening and Deepening Electives
- Examples: MH5301, MH5401
- Typically 3 AU

### 6. Graduate-Level
Master's level courses
- Examples: MH8100, MH8200
- Typically 3-4 AU

---

## Schools Reference

| Code | School/College |
|------|-----------------|
| SPMS | School of Physical & Mathematical Sciences |
| SCSE | School of Computer Science & Engineering |
| CEE | School of Civil & Environmental Engineering |
| NBS | Nanyang Business School |
| WKW | Wee Kim Wee School of Communication & Information |
| ADM | College of Humanities, Arts, & Social Sciences |
| ENG | Engineering Cluster |
| LMS | Lee Kong Chian School of Medicine |
| DRI | Dramatics & Performing Arts Cluster |

---

## Implementation Notes

### Loading in JavaScript
```javascript
// Fetch courses data
async function loadCourses() {
  const response = await fetch('/data/courses.json');
  const data = await response.json();
  return data.courses;
}

// Search functionality
function searchCourses(query, courses) {
  const q = query.toLowerCase();
  return courses.filter(course => 
    course.code.toLowerCase().includes(q) ||
    course.name.toLowerCase().includes(q)
  );
}
```

### Validation Example
```javascript
function validateCourse(course) {
  const required = ['code', 'name', 'credits', 'school', 'category'];
  for (const field of required) {
    if (!course[field]) return false;
  }
  
  // Code format: [A-Z]{1,3}\d{4}[A-Z]{0,1}
  if (!/^[A-Z]{1,3}\d{4}[A-Z]{0,1}$/.test(course.code)) {
    return false;
  }
  
  if (typeof course.credits !== 'number' || course.credits < 1) {
    return false;
  }
  
  return true;
}
```

---

## Size & Performance

- **Target Size**: < 500KB (uncompressed JSON)
- **Number of Courses**: 100-200 entries
- **Load Time**: < 200ms on 3G connection
- **Memory Usage**: < 5MB in browser

---

## Future Extensions

Possible enhancements to schema:
- `semesters`: Array of semesters when course is offered
- `instructor`: Course instructor name
- `location`: Campus/building location
- `gradeDistribution`: Historical grade distribution data
- `difficulty`: Difficulty rating (1-5)
- `workload`: Expected hours per week
- `reviews`: Link to student reviews

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-23 | Initial schema definition |

---

## Contact & Questions

For schema updates or questions:
- Check existing courses.json for examples
- Review validation rules before adding new fields
- Test schema changes against sample data before deployment
