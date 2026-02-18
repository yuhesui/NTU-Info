const STORAGE_KEY = 'ntuinfo.cgpa.v2';
const FGO_AU_CAP = 12;
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

function makeRow(course = { name: '', au: '', grade: 'A', eligible: false, apply: false }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="course-name" type="text" value="${course.name}" placeholder="e.g. MH1810"/></td>
    <td><input class="course-au" type="number" min="0" step="1" value="${course.au}" placeholder="3"/></td>
    <td><select class="course-grade">${grades.map((g) => `<option value="${g}" ${g === course.grade ? 'selected' : ''}>${g}</option>`).join('')}</select></td>
    <td><input class="course-eligible" type="checkbox" ${course.eligible ? 'checked' : ''} aria-label="Flexible grading allowed"/></td>
    <td><input class="course-apply" type="checkbox" ${course.apply ? 'checked' : ''} aria-label="Apply FGO to this course"/></td>
    <td><button class="btn btn-secondary remove-row" type="button">Remove</button></td>
  `;
  return tr;
}

function getRows() {
  return Array.from(document.querySelectorAll('#course-rows tr')).map((tr) => ({
    tr,
    name: tr.querySelector('.course-name').value.trim(),
    au: Number(tr.querySelector('.course-au').value),
    grade: tr.querySelector('.course-grade').value,
    eligible: tr.querySelector('.course-eligible').checked,
    apply: tr.querySelector('.course-apply').checked,
  }));
}

function saveState() {
  const state = {
    prevCgpa: document.getElementById('prev-cgpa').value,
    prevAus: document.getElementById('prev-aus').value,
    courses: getRows().map(({ tr, ...rest }) => rest),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function addRow(course) {
  document.getElementById('course-rows').appendChild(makeRow(course));
}

function updateFgoSummary() {
  const rows = getRows();
  let selectedAu = 0;
  rows.forEach(({ tr, au, eligible, apply }) => {
    const selected = eligible && apply;
    selectedAu += selected ? (Number.isFinite(au) ? au : 0) : 0;
    tr.classList.toggle('fgo-highlight', selected);
  });
  document.getElementById('fgo-summary').textContent = `FGO selected: ${selectedAu} AU / ${FGO_AU_CAP} AU`;
}

function validateRows(prevCgpa, prevAus) {
  const error = document.getElementById('form-error');
  error.textContent = '';

  if (Number.isNaN(prevCgpa) || prevCgpa < 0 || prevCgpa > 5 || Number.isNaN(prevAus) || prevAus < 0) {
    error.textContent = 'Enter a valid previous CGPA (0-5) and completed AUs.';
    return null;
  }

  const rows = getRows();
  if (!rows.length) {
    error.textContent = 'Add at least one course row.';
    return null;
  }

  for (const row of rows) {
    if (!row.name || Number.isNaN(row.au) || row.au <= 0 || !(row.grade in GRADE_POINTS)) {
      error.textContent = 'Every course row needs name, valid AU (> 0), and grade.';
      return null;
    }
  }

  const selectedAu = rows.reduce((sum, row) => sum + (row.eligible && row.apply ? row.au : 0), 0);
  if (selectedAu > FGO_AU_CAP) {
    error.textContent = `FGO cap exceeded. Select at most ${FGO_AU_CAP} AU.`;
    return null;
  }

  return rows;
}

function calculate() {
  const prevCgpa = Number(document.getElementById('prev-cgpa').value);
  const prevAus = Number(document.getElementById('prev-aus').value);
  const rows = validateRows(prevCgpa, prevAus);
  if (!rows) return;

  let semAus = 0;
  let semPoints = 0;

  rows.forEach((row) => {
    if (row.eligible && row.apply) return;
    semAus += row.au;
    semPoints += row.au * GRADE_POINTS[row.grade];
  });

  const semesterGpa = semAus > 0 ? semPoints / semAus : 0;
  const projectedCgpa = (prevAus + semAus) > 0 ? ((prevCgpa * prevAus) + semPoints) / (prevAus + semAus) : 0;

  document.getElementById('semester-gpa').textContent = semesterGpa.toFixed(2);
  document.getElementById('projected-cgpa').textContent = projectedCgpa.toFixed(2);
  updateFgoSummary();
  saveState();
}

function maximizeFgo() {
  const prevCgpa = Number(document.getElementById('prev-cgpa').value || 0);
  const prevAus = Number(document.getElementById('prev-aus').value || 0);
  const rows = getRows();

  const candidates = rows
    .map((row, i) => ({ ...row, index: i, delta: row.au * (GRADE_POINTS[row.grade] - prevCgpa) }))
    .filter((row) => row.eligible && row.au > 0 && row.delta < 0);

  const dp = Array.from({ length: candidates.length + 1 }, () => Array(FGO_AU_CAP + 1).fill(0));
  const keep = Array.from({ length: candidates.length + 1 }, () => Array(FGO_AU_CAP + 1).fill(false));

  for (let i = 1; i <= candidates.length; i += 1) {
    const item = candidates[i - 1];
    for (let cap = 0; cap <= FGO_AU_CAP; cap += 1) {
      dp[i][cap] = dp[i - 1][cap];
      if (item.au <= cap) {
        const gain = -item.delta;
        const candidateGain = dp[i - 1][cap - item.au] + gain;
        if (candidateGain > dp[i][cap]) {
          dp[i][cap] = candidateGain;
          keep[i][cap] = true;
        }
      }
    }
  }

  let cap = FGO_AU_CAP;
  const chosen = new Set();
  for (let i = candidates.length; i >= 1; i -= 1) {
    if (keep[i][cap]) {
      const item = candidates[i - 1];
      chosen.add(item.index);
      cap -= item.au;
    }
  }

  rows.forEach((row, idx) => {
    const applyInput = row.tr.querySelector('.course-apply');
    applyInput.checked = row.eligible && chosen.has(idx);
  });

  updateFgoSummary();
  calculate();
}

function clearFgoSelections() {
  getRows().forEach((row) => {
    row.tr.querySelector('.course-apply').checked = false;
  });
  updateFgoSummary();
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
  document.getElementById('fgo-summary').textContent = `FGO selected: 0 AU / ${FGO_AU_CAP} AU`;
  localStorage.removeItem(STORAGE_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();
  if (state?.courses?.length) {
    document.getElementById('prev-cgpa').value = state.prevCgpa || '';
    document.getElementById('prev-aus').value = state.prevAus || '';
    state.courses.forEach(addRow);
  } else {
    addRow();
  }

  document.getElementById('add-course').addEventListener('click', () => { addRow(); saveState(); });
  document.getElementById('course-rows').addEventListener('click', (e) => {
    if (!e.target.classList.contains('remove-row')) return;
    e.target.closest('tr')?.remove();
    if (!document.querySelector('#course-rows tr')) addRow();
    updateFgoSummary();
    saveState();
  });

  document.getElementById('course-rows').addEventListener('input', (e) => {
    if (e.target.classList.contains('course-apply')) {
      const row = e.target.closest('tr');
      const eligible = row.querySelector('.course-eligible');
      if (!eligible.checked) e.target.checked = false;
    }
    updateFgoSummary();
    saveState();
  });

  document.getElementById('calculate').addEventListener('click', calculate);
  document.getElementById('maximize-fgo').addEventListener('click', maximizeFgo);
  document.getElementById('clear-fgo').addEventListener('click', clearFgoSelections);
  document.getElementById('reset').addEventListener('click', resetAll);

  updateFgoSummary();
});
