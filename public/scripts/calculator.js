const STORAGE_KEY = 'ntuinfo.cgpa.v2';
const GRADE_POINTS = {
  'A+': 5.0,
  A: 5.0,
  'A-': 4.5,
  'B+': 4.0,
  B: 3.5,
  'B-': 3.0,
  'C+': 2.5,
  C: 2.0,
  'D+': 1.5,
  D: 1.0,
  F: 0,
};

const grades = Object.keys(GRADE_POINTS);

function makeRow(course = { name: '', au: '', grade: 'A' }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="course-name" type="text" value="${course.name}" placeholder="e.g. MH1810"/></td>
    <td><input class="course-au" type="number" min="0" step="1" value="${course.au}" placeholder="3"/></td>
    <td>
      <select class="course-grade">
        ${grades.map((grade) => `<option value="${grade}" ${grade === course.grade ? 'selected' : ''}>${grade}</option>`).join('')}
      </select>
    </td>
    <td><button class="btn btn-secondary remove-row" type="button">Remove</button></td>
  `;
  return tr;
}

function saveState() {
  const state = {
    prevCgpa: document.getElementById('prev-cgpa').value,
    prevAus: document.getElementById('prev-aus').value,
    courses: Array.from(document.querySelectorAll('#course-rows tr')).map((tr) => ({
      name: tr.querySelector('.course-name').value,
      au: tr.querySelector('.course-au').value,
      grade: tr.querySelector('.course-grade').value,
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!state || typeof state !== 'object') return null;
    return state;
  } catch {
    return null;
  }
}

function addRow(course) {
  const rows = document.getElementById('course-rows');
  rows.appendChild(makeRow(course));
}

function validateAndCompute() {
  const prevCgpa = Number(document.getElementById('prev-cgpa').value);
  const prevAus = Number(document.getElementById('prev-aus').value);
  const error = document.getElementById('form-error');
  error.textContent = '';

  if (Number.isNaN(prevCgpa) || prevCgpa < 0 || prevCgpa > 5 || Number.isNaN(prevAus) || prevAus < 0) {
    error.textContent = 'Enter a valid previous CGPA (0-5) and completed AUs.';
    return;
  }

  const rows = Array.from(document.querySelectorAll('#course-rows tr'));
  if (!rows.length) {
    error.textContent = 'Add at least one course row.';
    return;
  }

  let semPoints = 0;
  let semAus = 0;

  for (const row of rows) {
    const name = row.querySelector('.course-name').value.trim();
    const au = Number(row.querySelector('.course-au').value);
    const grade = row.querySelector('.course-grade').value;

    if (!name || Number.isNaN(au) || au <= 0 || !(grade in GRADE_POINTS)) {
      error.textContent = 'Every course row needs name, valid AU (> 0), and grade.';
      return;
    }

    semAus += au;
    semPoints += au * GRADE_POINTS[grade];
  }

  const semesterGpa = semPoints / semAus;
  const projectedCgpa = ((prevCgpa * prevAus) + semPoints) / (prevAus + semAus);

  document.getElementById('semester-gpa').textContent = semesterGpa.toFixed(2);
  document.getElementById('projected-cgpa').textContent = projectedCgpa.toFixed(2);
  saveState();
}

function resetAll() {
  document.getElementById('prev-cgpa').value = '';
  document.getElementById('prev-aus').value = '';
  document.getElementById('course-rows').innerHTML = '';
  addRow();
  document.getElementById('semester-gpa').textContent = '-';
  document.getElementById('projected-cgpa').textContent = '-';
  document.getElementById('form-error').textContent = '';
  localStorage.removeItem(STORAGE_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
  const restored = loadState();
  if (restored) {
    document.getElementById('prev-cgpa').value = restored.prevCgpa || '';
    document.getElementById('prev-aus').value = restored.prevAus || '';
    const rows = document.getElementById('course-rows');
    rows.innerHTML = '';
    (restored.courses?.length ? restored.courses : [{}]).forEach(addRow);
  } else {
    addRow();
  }

  document.getElementById('add-course').addEventListener('click', () => {
    addRow();
    saveState();
  });

  document.getElementById('course-rows').addEventListener('click', (event) => {
    if (!event.target.classList.contains('remove-row')) return;
    event.target.closest('tr')?.remove();
    if (!document.querySelector('#course-rows tr')) addRow();
    saveState();
  });

  document.getElementById('main-content').addEventListener('input', (event) => {
    if (event.target.matches('input, select')) saveState();
  });

  document.getElementById('calculate').addEventListener('click', validateAndCompute);
  document.getElementById('reset').addEventListener('click', resetAll);
});
