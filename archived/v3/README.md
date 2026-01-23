# NTU Info V3.0

A comprehensive student information portal for Nanyang Technological University featuring academic tools, study resources, and campus life guides.

## 🆕 New Features

### Academic Tools
- **CGPA Calculator**: Track semester grades and cumulative GPA with NTU's 5-point scale
  - Multi-semester tracking with S/U support
  - Target GPA calculator
  - Degree classification estimator
  - Export to PDF/CSV with localStorage persistence

- **Exam Timetable Generator**: Build personalized exam schedules
  - Conflict detection and chronological sorting
  - Study day countdown and planner
  - Export to iCalendar (Google Calendar/Outlook) and PDF
  - Print-friendly view and text import helper

### Study Resources
- Direct integration with [QRS@NTU Math Notes](https://qrsntu.org/math_notes)
- Access to curated revision materials, past papers, and cheatsheets

### Campus Life
- NTU Clubs & Societies Explorer with advanced filtering and analytics
- Singapore Airport Entry Guide for incoming students

## Usage

### CGPA Calculator
1. Open `cgpa-calculator.html`.
2. Add semesters and courses, including credits and grades.
3. Toggle S/U for applicable courses to exclude from GPA.
4. Review cumulative CGPA, degree classification, and target GPA guidance.
5. Export your data to PDF or CSV for backups.

### Exam Timetable
1. Open `exam-timetable.html`.
2. Add exam details (course, date, time, venue, duration).
3. Review automatic conflict detection and study-day badges.
4. Export to calendar (`.ics`) or PDF, or print directly.
5. Paste text schedules to import multiple exams at once.

## Technology Stack
- Static HTML/CSS/JavaScript
- localStorage for data persistence
- jsPDF for PDF generation
- ics.js for calendar export
- No backend required

## Credits
Developed by [QRS@NTU](https://qrsntu.org/) (Quantitative Research Society @ Nanyang Technological University)

## License
MIT License - Built by students, for students
