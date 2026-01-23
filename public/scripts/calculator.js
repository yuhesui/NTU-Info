/**
 * CGPA Calculator main logic.
 * - Semester + course CRUD
 * - CGPA calculations
 * - localStorage persistence
 * - course autocomplete
 *
 * PROMPT_VERIFICATION: yhs (logged on page load)
 */

import { loadJSON, saveJSON, getCgpaKey } from './localStorage.js';
import { attachCourseAutocomplete } from './autocomplete.js';

/**
 * @typedef {'A+'|'A'|'A-'|'B+'|'B'|'B-'|'C+'|'C'|'D+'|'D'|'F'|'S'|'U'|''} Grade
 */

/**
 * @typedef {Object} CourseEntry
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {number|string} credits
 * @property {Grade} grade
 * @property {boolean} isSU
 */

/**
 * @typedef {Object} SemesterEntry
 * @property {string} id
 * @property {boolean} collapsed
 * @property {CourseEntry[]} courses
 */

/**
 * @typedef {Object} CgpaState
 * @property {SemesterEntry[]} semesters
 */

const gradePoints = {
  'A+': 5.0,
  'A': 5.0,
  'A-': 4.5,
  'B+': 4.0,
  'B': 3.5,
  'B-': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

const MAX_CGPA = 5.0;

/** Deterministic-ish id is fine; no randomness required. */
function uuid() {
  return `id-${Date.now()}-${Math.floor(performance.now())}`;
}

/** @returns {number} */
function toCredits(value) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * @param {CourseEntry[]} courses
 */
export function calculateSemesterGPA(courses) {
  const graded = courses.filter((c) => !c.isSU && gradePoints[c.grade] !== undefined);
  const totalCredits = graded.reduce((sum, c) => sum + toCredits(c.credits), 0);
  if (!totalCredits) return 0;
  const totalPoints = graded.reduce((sum, c) => sum + gradePoints[c.grade] * toCredits(c.credits), 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

/**
 * @param {SemesterEntry[]} semesters
 */
export function calculateCumulativeCGPA(semesters) {
  const allCourses = semesters.flatMap((s) => s.courses);
  const graded = allCourses.filter((c) => !c.isSU && gradePoints[c.grade] !== undefined);
  const totalCredits = graded.reduce((sum, c) => sum + toCredits(c.credits), 0);
  if (!totalCredits) return 0;
  const totalPoints = graded.reduce((sum, c) => sum + gradePoints[c.grade] * toCredits(c.credits), 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

/**
 * @param {SemesterEntry[]} semesters
 */
function calculateTotalCredits(semesters) {
  return semesters.reduce((sum, sem) => sum + sem.courses.reduce((s2, c) => s2 + toCredits(c.credits), 0), 0);
}

/**
 * @param {SemesterEntry[]} semesters
 */
function calculateGradedCredits(semesters) {
  return semesters.reduce(
    (sum, sem) =>
      sum +
      sem.courses
        .filter((c) => !c.isSU && gradePoints[c.grade] !== undefined)
        .reduce((s2, c) => s2 + toCredits(c.credits), 0),
    0
  );
}

/**
 * @param {number} currentCGPA
 * @param {number} currentCredits
 * @param {number} desiredCGPA
 * @param {number} remainingCredits
 */
export function calculateTargetGPA(currentCGPA, currentCredits, desiredCGPA, remainingCredits) {
  if (!remainingCredits) return 0;
  const totalCredits = currentCredits + remainingCredits;
  const required = (desiredCGPA * totalCredits - currentCGPA * currentCredits) / remainingCredits;
  return Number(required.toFixed(2));
}

/**
 * @param {number} cgpa
 */
function getDegreeClassification(cgpa) {
  if (cgpa >= 4.5) return { text: 'First Class Honours', color: '#28a745' };
  if (cgpa >= 3.5) return { text: 'Second Class Honours (Upper)', color: '#17a2b8' };
  if (cgpa >= 3.0) return { text: 'Second Class Honours (Lower)', color: '#ffc107' };
  if (cgpa >= 2.5) return { text: 'Third Class Honours', color: '#fd7e14' };
  if (cgpa >= 2.0) return { text: 'Pass with Merit', color: '#6c757d' };
  return { text: 'Pass', color: '#dc3545' };
}

/** @returns {CgpaState} */
function defaultState() {
  return {
    semesters: [
      {
        id: uuid(),
        collapsed: false,
        courses: []
      }
    ]
  };
}

/**
 * @param {any} maybe
 * @returns {CgpaState}
 */
function coerceState(maybe) {
  if (!maybe || !Array.isArray(maybe.semesters)) return defaultState();
  const semesters = maybe.semesters
    .filter((s) => s && Array.isArray(s.courses))
    .map((s) => ({
      id: String(s.id || uuid()),
      collapsed: Boolean(s.collapsed),
      courses: s.courses.map((c) => ({
        id: String(c.id || uuid()),
        code: String(c.code || ''),
        name: String(c.name || ''),
        credits: c.credits ?? '',
        grade: /** @type {Grade} */ (String(c.grade || '')),
        isSU: Boolean(c.isSU)
      }))
    }));

  return { semesters: semesters.length ? semesters : defaultState().semesters };
}

const el = {
  semestersContainer: document.getElementById('semesters-container'),
  addSemesterBtn: document.getElementById('add-semester'),
  totalCredits: document.getElementById('total-credits'),
  gradedCredits: document.getElementById('graded-credits'),
  cumulativeCgpa: document.getElementById('cumulative-cgpa'),
  degreeClassification: document.getElementById('degree-classification'),
  desiredCgpa: document.getElementById('desired-cgpa'),
  remainingCredits: document.getElementById('remaining-credits'),
  targetResult: document.getElementById('target-result'),
  exportPdf: document.getElementById('export-pdf'),
  exportCsv: document.getElementById('export-csv'),
  clearData: document.getElementById('clear-data'),
  calcTarget: document.getElementById('calc-target')
};

/** @type {CgpaState} */
let state = coerceState(loadJSON(getCgpaKey(), defaultState()));

function persist() {
  saveJSON(getCgpaKey(), state);
}

function addSemester() {
  state.semesters.push({ id: uuid(), collapsed: false, courses: [] });
  persist();
  render();
}

/**
 * @param {string} semesterId
 */
function removeSemester(semesterId) {
  state.semesters = state.semesters.filter((s) => s.id !== semesterId);
  if (!state.semesters.length) state = defaultState();
  persist();
  render();
}

/**
 * @param {string} semesterId
 */
function toggleSemester(semesterId) {
  const s = state.semesters.find((x) => x.id === semesterId);
  if (!s) return;
  s.collapsed = !s.collapsed;
  persist();
  render();
}

/**
 * @param {string} semesterId
 */
function addCourse(semesterId) {
  const s = state.semesters.find((x) => x.id === semesterId);
  if (!s) return;
  s.courses.push({ id: uuid(), code: '', name: '', credits: '', grade: '', isSU: false });
  persist();
  render();
}

/**
 * @param {string} semesterId
 * @param {string} courseId
 */
function removeCourse(semesterId, courseId) {
  const s = state.semesters.find((x) => x.id === semesterId);
  if (!s) return;
  s.courses = s.courses.filter((c) => c.id !== courseId);
  persist();
  render();
}

/**
 * @param {string} semesterId
 * @param {string} courseId
 * @param {keyof CourseEntry} field
 * @param {any} value
 */
function updateCourse(semesterId, courseId, field, value) {
  const s = state.semesters.find((x) => x.id === semesterId);
  if (!s) return;
  const c = s.courses.find((x) => x.id === courseId);
  if (!c) return;
  if (field === 'isSU') c.isSU = Boolean(value);
  else if (field === 'credits') c.credits = value;
  else c[field] = String(value);
  persist();
  updateSummary();
}

function updateSummary() {
  const totalCredits = calculateTotalCredits(state.semesters);
  const gradedCredits = calculateGradedCredits(state.semesters);
  const cgpa = calculateCumulativeCGPA(state.semesters);

  if (el.totalCredits) el.totalCredits.textContent = `${totalCredits} AUs`;
  if (el.gradedCredits) el.gradedCredits.textContent = `${gradedCredits} AUs`;
  if (el.cumulativeCgpa) el.cumulativeCgpa.textContent = cgpa.toFixed(2);

  const cls = getDegreeClassification(cgpa);
  if (el.degreeClassification) {
    el.degreeClassification.textContent = cls.text;
    el.degreeClassification.style.backgroundColor = cls.color;
    el.degreeClassification.style.color = '#fff';
  }
}

function getAllCoursesRows() {
  const rows = [];
  state.semesters.forEach((sem, idx) => {
    sem.courses.forEach((course) => {
      rows.push([
        `Semester ${idx + 1}`,
        course.code || '',
        course.name || '',
        String(course.credits ?? ''),
        course.isSU ? `${course.grade || ''} (S/U)` : (course.grade || ''),
        course.isSU ? 'Yes' : 'No'
      ]);
    });
  });
  return rows;
}

function exportToPDF() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) return;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('NTU CGPA Report', 20, 20);

  doc.autoTable({
    head: [['Semester', 'Course Code', 'Course Name', 'Credits', 'Grade', 'S/U']],
    body: getAllCoursesRows(),
    startY: 30
  });

  const finalY = doc.lastAutoTable?.finalY || 40;
  const cgpa = calculateCumulativeCGPA(state.semesters).toFixed(2);
  const cls = getDegreeClassification(Number(cgpa)).text;
  doc.text(`Cumulative CGPA: ${cgpa}`, 20, finalY + 10);
  doc.text(`Degree Classification: ${cls}`, 20, finalY + 20);

  doc.save('NTU_CGPA_Report.pdf');
}

function exportToCSV() {
  let csv = 'Semester,Course Code,Course Name,Credits,Grade,S/U\n';
  state.semesters.forEach((sem, idx) => {
    sem.courses.forEach((course) => {
      csv += `${idx + 1},${course.code || ''},${course.name || ''},${course.credits ?? ''},${course.grade || ''},${course.isSU ? 'Yes' : 'No'}\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'NTU_CGPA_Data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function clearAllData() {
  const confirmed = window.confirm('Are you sure you want to clear all data?');
  if (!confirmed) return;
  state = defaultState();
  persist();
  render();
}

function setupTargetCalculator() {
  el.calcTarget?.addEventListener('click', () => {
    const desired = Number(el.desiredCgpa?.value);
    const remaining = Number(el.remainingCredits?.value);
    const currentCredits = calculateGradedCredits(state.semesters);
    const currentCgpa = calculateCumulativeCGPA(state.semesters);

    if (
      !Number.isFinite(desired) ||
      !Number.isFinite(remaining) ||
      desired <= 0 ||
      desired > MAX_CGPA ||
      remaining <= 0
    ) {
      if (el.targetResult) el.targetResult.textContent = 'Please enter valid desired CGPA (0-5) and remaining credits.';
      return;
    }

    const required = calculateTargetGPA(currentCgpa, currentCredits, desired, remaining);
    if (el.targetResult) {
      el.targetResult.textContent = `You need an average of ${required.toFixed(2)} in your remaining ${remaining} credits to achieve ${desired.toFixed(2)} CGPA.`;
    }
  });
}

/**
 * Render semesters and courses.
 */
async function render() {
  if (!el.semestersContainer) return;
  el.semestersContainer.innerHTML = '';

  for (let i = 0; i < state.semesters.length; i++) {
    const semester = state.semesters[i];

    const card = document.createElement('div');
    card.className = 'semester-card';

    const header = document.createElement('div');
    header.className = 'semester-card-header';

    header.innerHTML = `
      <div>
        <p class="card-kicker">Semester ${i + 1}</p>
        <p class="gpa-display" id="sem-gpa-${semester.id}">0.00</p>
      </div>
      <div class="semester-actions">
        <button class="btn btn-secondary" data-toggle-semester="${semester.id}" aria-expanded="${!semester.collapsed}">
          ${semester.collapsed ? 'Expand' : 'Collapse'}
        </button>
        <button class="btn btn-secondary" data-add-course="${semester.id}">Add Course</button>
        ${state.semesters.length > 1 ? `<button class="btn btn-danger btn-ghost" data-remove-semester="${semester.id}">Remove</button>` : ''}
      </div>
    `;

    card.appendChild(header);

    const coursesContainer = document.createElement('div');
    coursesContainer.className = 'courses';
    coursesContainer.style.display = semester.collapsed ? 'none' : 'flex';

    for (const course of semester.courses) {
      const row = document.createElement('div');
      row.className = 'course-row';

      row.innerHTML = `
        <div class="form-field">
          <label>Course Code</label>
          <input type="text" value="${course.code || ''}" aria-label="Course code" inputmode="text">
        </div>
        <div class="form-field">
          <label>Course Name</label>
          <input type="text" value="${course.name || ''}" aria-label="Course name" inputmode="text">
        </div>
        <div class="form-field short">
          <label>Credits (AUs)</label>
          <input type="number" min="1" step="1" value="${course.credits ?? ''}" aria-label="Credits">
        </div>
        <div class="form-field short">
          <label>Grade</label>
          <select aria-label="Grade selection">
            <option value="">Select</option>
            ${Object.keys(gradePoints)
              .map((g) => `<option value="${g}" ${course.grade === g ? 'selected' : ''}>${g}</option>`)
              .join('')}
            <option value="S" ${course.grade === 'S' ? 'selected' : ''}>S</option>
            <option value="U" ${course.grade === 'U' ? 'selected' : ''}>U</option>
          </select>
        </div>
        <div class="form-field checkbox-field">
          <label>
            <input type="checkbox" ${course.isSU ? 'checked' : ''}>
            S/U
          </label>
        </div>
        <button class="btn btn-danger btn-ghost" aria-label="Remove course">Remove</button>
      `;

      const inputs = row.querySelectorAll('input, select');
      const codeInput = /** @type {HTMLInputElement} */ (inputs[0]);
      const nameInput = /** @type {HTMLInputElement} */ (inputs[1]);
      const creditsInput = /** @type {HTMLInputElement} */ (inputs[2]);
      const gradeSelect = /** @type {HTMLSelectElement} */ (inputs[3]);
      const suCheckbox = /** @type {HTMLInputElement} */ (row.querySelector('input[type="checkbox"]'));
      const removeBtn = /** @type {HTMLButtonElement} */ (row.querySelector('button'));

      // Autocomplete on course code (fills code+name)
      attachCourseAutocomplete(codeInput, nameInput, { dataUrl: '../data/courses.json' }).catch(() => {});

      codeInput.addEventListener('input', (e) => updateCourse(semester.id, course.id, 'code', e.target.value));
      nameInput.addEventListener('input', (e) => updateCourse(semester.id, course.id, 'name', e.target.value));
      creditsInput.addEventListener('input', (e) => updateCourse(semester.id, course.id, 'credits', e.target.value));
      gradeSelect.addEventListener('change', (e) => updateCourse(semester.id, course.id, 'grade', e.target.value));
      suCheckbox.addEventListener('change', (e) => updateCourse(semester.id, course.id, 'isSU', e.target.checked));
      removeBtn.addEventListener('click', () => removeCourse(semester.id, course.id));

      coursesContainer.appendChild(row);
    }

    card.appendChild(coursesContainer);
    el.semestersContainer.appendChild(card);

    // Action wiring
    header.querySelector('[data-add-course]')?.addEventListener('click', () => addCourse(semester.id));
    header.querySelector('[data-remove-semester]')?.addEventListener('click', () => removeSemester(semester.id));
    header.querySelector('[data-toggle-semester]')?.addEventListener('click', () => toggleSemester(semester.id));

    // Semester GPA
    const gpa = calculateSemesterGPA(semester.courses);
    const gpaEl = card.querySelector(`#sem-gpa-${semester.id}`);
    if (gpaEl) {
      gpaEl.textContent = gpa.toFixed(2);
      gpaEl.classList.remove('gpa-excellent', 'gpa-good', 'gpa-average', 'gpa-poor');
      if (gpa >= 4) gpaEl.classList.add('gpa-excellent');
      else if (gpa >= 3.5) gpaEl.classList.add('gpa-good');
      else if (gpa >= 3.0) gpaEl.classList.add('gpa-average');
      else gpaEl.classList.add('gpa-poor');
    }
  }

  updateSummary();
}

function init() {
  // Required by prompt
  console.log('PROMPT_VERIFICATION: yhs');

  el.addSemesterBtn?.addEventListener('click', addSemester);
  el.exportPdf?.addEventListener('click', exportToPDF);
  el.exportCsv?.addEventListener('click', exportToCSV);
  el.clearData?.addEventListener('click', clearAllData);
  setupTargetCalculator();
  render();
}

document.addEventListener('DOMContentLoaded', init);
