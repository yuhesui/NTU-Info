const STORAGE_KEY = 'ntuinfo.cgpa.v2';

const GRADE_POINTS = {
  'A+': 5,
  A: 5,
  'A-': 4.5,
  'B+': 4,
  B: 3.5,
  'B-': 3,
  'C+': 2.5,
  C: 2,
  'D+': 1.5,
  D: 1,
  F: 0
};

const gradeOptions = Object.keys(GRADE_POINTS);

const els = {
  prevCgpa: document.getElementById('prev-cgpa'),
  prevAus: document.getElementById('prev-aus'),
  addCourse: document.getElementById('add-course'),
  body: document.getElementById('courses-body'),
  calc: document.getElementById('calculate'),
  reset: document.getElementById('reset'),
  error: document.getElementById('form-error'),
  semesterGpa: document.getElementById('semester-gpa'),
  projectedCgpa: document.getElementById('projected-cgpa')
};

function createRow(course = { name: '', aus: '', grade: 'A' }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="e.g. MH1810" value="${course.name}"></td>
    <td><input type="number" min="0" step="1" value="${course.aus}"></td>
    <td>
      <select>
        ${gradeOptions.map((grade) => `<option value="${grade}" ${course.grade === grade ? 'selected' : ''}>${grade}</option>`).join('')}
      </select>
    </td>
    <td><button type="button" class="remove-course" aria-label="Remove course">Remove</button></td>
  `;

  tr.querySelector('.remove-course').addEventListener('click', () => {
    tr.remove();
    if (els.body.children.length === 0) createRow();
    persist();
  });

  tr.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('input', persist);
    input.addEventListener('change', persist);
  });

  els.body.appendChild(tr);
}

function getCourses() {
  return Array.from(els.body.querySelectorAll('tr')).map((row) => {
    const [nameInput, auInput] = row.querySelectorAll('input');
    const grade = row.querySelector('select').value;
    return {
      name: nameInput.value.trim(),
      aus: Number(auInput.value),
      grade
    };
  });
}

function persist() {
  const state = {
    prevCgpa: els.prevCgpa.value,
    prevAus: els.prevAus.value,
    courses: getCourses()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrate() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    createRow();
    return;
  }

  const state = JSON.parse(saved);
  els.prevCgpa.value = state.prevCgpa || '';
  els.prevAus.value = state.prevAus || '';
  els.body.innerHTML = '';
  (state.courses?.length ? state.courses : [{}]).forEach((course) => createRow(course));
}

function showError(message = '') {
  els.error.textContent = message;
}

function calculate() {
  showError();
  const prevCgpa = Number(els.prevCgpa.value);
  const prevAus = Number(els.prevAus.value);

  if (!Number.isFinite(prevCgpa) || prevCgpa < 0 || prevCgpa > 5 || !Number.isInteger(prevAus) || prevAus < 0) {
    showError('Please enter a valid previous CGPA (0-5.00) and total AUs (integer).');
    return;
  }

  const courses = getCourses();
  if (!courses.length) {
    showError('Add at least one course.');
    return;
  }

  let semesterQuality = 0;
  let semesterAus = 0;

  for (const course of courses) {
    if (!course.name || !Number.isFinite(course.aus) || course.aus <= 0 || !GRADE_POINTS.hasOwnProperty(course.grade)) {
      showError('Each course needs a name, positive AUs, and a valid grade.');
      return;
    }
    semesterAus += course.aus;
    semesterQuality += GRADE_POINTS[course.grade] * course.aus;
  }

  const semesterGpa = semesterQuality / semesterAus;
  const projectedCgpa = ((prevCgpa * prevAus) + semesterQuality) / (prevAus + semesterAus);

  els.semesterGpa.textContent = semesterGpa.toFixed(2);
  els.projectedCgpa.textContent = projectedCgpa.toFixed(2);
  persist();
}

function resetAll() {
  els.prevCgpa.value = '';
  els.prevAus.value = '';
  els.body.innerHTML = '';
  createRow();
  els.semesterGpa.textContent = '0.00';
  els.projectedCgpa.textContent = '0.00';
  showError();
  localStorage.removeItem(STORAGE_KEY);
}

els.addCourse?.addEventListener('click', () => {
  createRow();
  persist();
});
els.calc?.addEventListener('click', calculate);
els.reset?.addEventListener('click', resetAll);
els.prevCgpa?.addEventListener('input', persist);
els.prevAus?.addEventListener('input', persist);

hydrate();
