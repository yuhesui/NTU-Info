const gradePoints = {
  'A+': 5.0, 'A': 5.0, 'A-': 4.5, 'B+': 4.0, 'B': 3.5, 'B-': 3.0,
  'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
};

const MAX_CGPA = 5.0;

function uuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let allData = { semesters: [] };

const semestersContainer = document.getElementById('semesters-container');
const addSemesterBtn = document.getElementById('add-semester');
const totalCreditsEl = document.getElementById('total-credits');
const gradedCreditsEl = document.getElementById('graded-credits');
const cumulativeCgpaEl = document.getElementById('cumulative-cgpa');
const degreeClassificationEl = document.getElementById('degree-classification');
const desiredCgpaInput = document.getElementById('desired-cgpa');
const remainingCreditsInput = document.getElementById('remaining-credits');
const targetResultEl = document.getElementById('target-result');

function calculateSemesterGPA(courses) {
  const graded = courses.filter(c => !c.isSU && gradePoints[c.grade] !== undefined);
  const totalCredits = graded.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  if (!totalCredits) return 0;
  const totalPoints = graded.reduce((sum, c) => sum + gradePoints[c.grade] * Number(c.credits || 0), 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

function calculateCumulativeCGPA(semesters) {
  const allCourses = semesters.flatMap(s => s.courses);
  const graded = allCourses.filter(c => !c.isSU && gradePoints[c.grade] !== undefined);
  const totalCredits = graded.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  if (!totalCredits) return 0;
  const totalPoints = graded.reduce((sum, c) => sum + gradePoints[c.grade] * Number(c.credits || 0), 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

function calculateTotalCredits() {
  return allData.semesters.reduce((sum, sem) => sum + sem.courses.reduce((cSum, c) => cSum + Number(c.credits || 0), 0), 0);
}

function calculateGradedCredits() {
  return allData.semesters.reduce((sum, sem) => sum + sem.courses.filter(c => !c.isSU && gradePoints[c.grade] !== undefined).reduce((cSum, c) => cSum + Number(c.credits || 0), 0), 0);
}

function calculateTargetGPA(currentCGPA, currentCredits, desiredCGPA, remainingCredits) {
  const totalCredits = currentCredits + remainingCredits;
  if (!remainingCredits) return 0;
  const required = (desiredCGPA * totalCredits - currentCGPA * currentCredits) / remainingCredits;
  return Number(required.toFixed(2));
}

function getDegreeClassification(cgpa) {
  if (cgpa >= 4.50) return { class: 'First Class Honours', color: '#28a745' };
  if (cgpa >= 3.50) return { class: 'Second Class Honours (Upper)', color: '#17a2b8' };
  if (cgpa >= 3.00) return { class: 'Second Class Honours (Lower)', color: '#ffc107' };
  if (cgpa >= 2.50) return { class: 'Third Class Honours', color: '#fd7e14' };
  if (cgpa >= 2.00) return { class: 'Pass with Merit', color: '#6c757d' };
  return { class: 'Pass', color: '#dc3545' };
}

function saveToLocalStorage() {
  localStorage.setItem('ntuinfo_cgpa_data', JSON.stringify(allData));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('ntuinfo_cgpa_data');
  return saved ? JSON.parse(saved) : null;
}

function addSemester() {
  allData.semesters.push({
    id: uuid(),
    courses: []
  });
  saveToLocalStorage();
  renderSemesters();
}

function addCourse(semesterId) {
  const semester = allData.semesters.find(s => s.id === semesterId);
  if (!semester) return;
  semester.courses.push({
    id: uuid(),
    code: '',
    name: '',
    credits: '',
    grade: '',
    isSU: false
  });
  saveToLocalStorage();
  renderSemesters();
}

function removeCourse(semesterId, courseId) {
  const semester = allData.semesters.find(s => s.id === semesterId);
  if (!semester) return;
  semester.courses = semester.courses.filter(c => c.id !== courseId);
  saveToLocalStorage();
  renderSemesters();
}

function removeSemester(semesterId) {
  allData.semesters = allData.semesters.filter(s => s.id !== semesterId);
  if (!allData.semesters.length) addSemester();
  saveToLocalStorage();
  renderSemesters();
}

function handleCourseChange(semesterId, courseId, field, value) {
  const semester = allData.semesters.find(s => s.id === semesterId);
  if (!semester) return;
  const course = semester.courses.find(c => c.id === courseId);
  if (!course) return;
  course[field] = field === 'isSU' ? Boolean(value) : value;
  saveToLocalStorage();
  renderSemesters();
}

function renderSemesters() {
  semestersContainer.innerHTML = '';
  allData.semesters.forEach((semester, index) => {
    const card = document.createElement('div');
    card.className = 'semester-card';

    const header = document.createElement('div');
    header.className = 'semester-card-header';
    header.innerHTML = `
      <div>
        <p class="card-kicker">Semester ${index + 1}</p>
        <p class="gpa-display" id="sem-gpa-${semester.id}">0.00</p>
      </div>
      <div class="semester-actions">
        <button class="btn secondary" data-add-course="${semester.id}">Add Course</button>
        ${allData.semesters.length > 1 ? `<button class="btn danger ghost" data-remove-semester="${semester.id}">Remove</button>` : ''}
      </div>
    `;
    card.appendChild(header);

    const coursesContainer = document.createElement('div');
    coursesContainer.className = 'courses';
    semester.courses.forEach(course => {
      const row = document.createElement('div');
      row.className = 'course-row';
      row.innerHTML = `
        <div class="form-field">
          <label>Course Code</label>
          <input type="text" value="${course.code || ''}" aria-label="Course code">
        </div>
        <div class="form-field">
          <label>Course Name</label>
          <input type="text" value="${course.name || ''}" aria-label="Course name">
        </div>
        <div class="form-field short">
          <label>Credits (AUs)</label>
          <input type="number" min="1" step="1" value="${course.credits || ''}" aria-label="Credits">
        </div>
        <div class="form-field short">
          <label>Grade</label>
          <select aria-label="Grade selection">
            <option value="">Select</option>
            ${Object.keys(gradePoints).map(g => `<option value="${g}" ${course.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
            <option value="S" ${course.grade === 'S' ? 'selected' : ''}>S</option>
            <option value="U" ${course.grade === 'U' ? 'selected' : ''}>U</option>
          </select>
        </div>
        <div class="form-field checkbox-field">
          <label><input type="checkbox" ${course.isSU ? 'checked' : ''}> S/U Option</label>
        </div>
        <button class="btn ghost danger" aria-label="Remove course">Remove</button>
      `;

      const [codeInput, nameInput, creditsInput, gradeSelect] = row.querySelectorAll('input, select');
      const checkbox = row.querySelector('input[type="checkbox"]');
      const removeBtn = row.querySelector('button');

      codeInput.addEventListener('input', e => handleCourseChange(semester.id, course.id, 'code', e.target.value));
      nameInput.addEventListener('input', e => handleCourseChange(semester.id, course.id, 'name', e.target.value));
      creditsInput.addEventListener('input', e => handleCourseChange(semester.id, course.id, 'credits', e.target.value));
      gradeSelect.addEventListener('change', e => handleCourseChange(semester.id, course.id, 'grade', e.target.value));
      checkbox.addEventListener('change', e => handleCourseChange(semester.id, course.id, 'isSU', e.target.checked));
      removeBtn.addEventListener('click', () => removeCourse(semester.id, course.id));

      coursesContainer.appendChild(row);
    });

    const addBtn = header.querySelector('[data-add-course]');
    addBtn?.addEventListener('click', () => addCourse(semester.id));
    const removeSemBtn = header.querySelector('[data-remove-semester]');
    removeSemBtn?.addEventListener('click', () => removeSemester(semester.id));

    card.appendChild(coursesContainer);
    semestersContainer.appendChild(card);

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
  });

  updateSummary();
}

function updateSummary() {
  const totalCredits = calculateTotalCredits();
  const gradedCredits = calculateGradedCredits();
  const cgpa = calculateCumulativeCGPA(allData.semesters);

  totalCreditsEl.textContent = `${totalCredits} AUs`;
  gradedCreditsEl.textContent = `${gradedCredits} AUs`;
  cumulativeCgpaEl.textContent = cgpa.toFixed(2);

  const classification = getDegreeClassification(cgpa);
  degreeClassificationEl.textContent = classification.class;
  degreeClassificationEl.style.backgroundColor = classification.color;
  degreeClassificationEl.style.color = '#fff';
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('NTU CGPA Report', 20, 20);

  doc.autoTable({
    head: [['Semester', 'Course Code', 'Course Name', 'Credits', 'Grade', 'S/U']],
    body: getAllCoursesData(),
    startY: 30
  });

  const finalY = doc.lastAutoTable.finalY || 40;
  const cgpa = calculateCumulativeCGPA(allData.semesters).toFixed(2);
  const classification = getDegreeClassification(Number(cgpa)).class;
  doc.text(`Cumulative CGPA: ${cgpa}`, 20, finalY + 10);
  doc.text(`Degree Classification: ${classification}`, 20, finalY + 20);

  doc.save('NTU_CGPA_Report.pdf');
}

function exportToCSV() {
  let csv = 'Semester,Course Code,Course Name,Credits,Grade,S/U\n';
  allData.semesters.forEach((sem, idx) => {
    sem.courses.forEach(course => {
      csv += `${idx + 1},${course.code || ''},${course.name || ''},${course.credits || ''},${course.grade || ''},${course.isSU ? 'Yes' : 'No'}\n`;
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

function getAllCoursesData() {
  const rows = [];
  allData.semesters.forEach((sem, idx) => {
    sem.courses.forEach(course => {
      rows.push([
        `Semester ${idx + 1}`,
        course.code || '',
        course.name || '',
        course.credits || '',
        course.isSU ? `${course.grade || 'S/U'} (S/U)` : (course.grade || ''),
        course.isSU ? 'Yes' : 'No'
      ]);
    });
  });
  return rows;
}

function clearData() {
  const confirmed = window.confirm('Are you sure you want to clear all data?');
  if (!confirmed) return;
  allData = { semesters: [] };
  addSemester();
}

function setupTargetCalculator() {
  document.getElementById('calc-target').addEventListener('click', () => {
    const desired = Number(desiredCgpaInput.value);
    const remaining = Number(remainingCreditsInput.value);
    const currentCredits = calculateGradedCredits();
    const currentCgpa = calculateCumulativeCGPA(allData.semesters);

    if (Number.isNaN(desired) || Number.isNaN(remaining) || desired <= 0 || desired > MAX_CGPA || remaining <= 0) {
      targetResultEl.textContent = 'Please enter valid desired CGPA (0-5) and remaining credits.';
      return;
    }

    const required = calculateTargetGPA(currentCgpa, currentCredits, desired, remaining);
    targetResultEl.textContent = `You need an average of ${required.toFixed(2)} in your remaining ${remaining} credits to achieve ${desired.toFixed(2)} CGPA.`;
  });
}

function init() {
  const saved = loadFromLocalStorage();
  if (saved?.semesters?.length) {
    allData = saved;
  } else {
    addSemester();
  }

  addSemesterBtn.addEventListener('click', addSemester);
  document.getElementById('export-pdf').addEventListener('click', exportToPDF);
  document.getElementById('export-csv').addEventListener('click', exportToCSV);
  document.getElementById('clear-data').addEventListener('click', () => {
    clearData();
    saveToLocalStorage();
    renderSemesters();
  });
  setupTargetCalculator();
  renderSemesters();
}

document.addEventListener('DOMContentLoaded', init);
