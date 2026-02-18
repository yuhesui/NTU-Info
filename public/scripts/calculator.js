const STORAGE_KEY = 'ntuinfo.cgpa.v2';
const FGO_CAP_AU = 12;

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

function makeRow(course = { name: '', au: '', grade: 'A', fgoEligible: false, applyFgo: false }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="course-name" type="text" value="${course.name}" placeholder="e.g. MH1810"></td>
    <td><input class="course-au" type="number" min="0" step="1" value="${course.au}" placeholder="3"></td>
    <td><select class="course-grade">${grades.map((grade) => `<option value="${grade}" ${grade === course.grade ? 'selected' : ''}>${grade}</option>`).join('')}</select></td>
    <td class="center"><input class="fgo-eligible" type="checkbox" ${course.fgoEligible ? 'checked' : ''}></td>
    <td class="center"><input class="fgo-apply" type="checkbox" ${course.applyFgo ? 'checked' : ''}></td>
    <td><button class="btn btn-secondary remove-row" type="button">Remove</button></td>
  `;
  return tr;
}

function getRows() {
  return Array.from(document.querySelectorAll('#course-rows tr'));
}

function getCourses() {
  return getRows().map((row) => ({
    row,
    name: row.querySelector('.course-name').value.trim(),
    au: Number(row.querySelector('.course-au').value),
    grade: row.querySelector('.course-grade').value,
    fgoEligible: row.querySelector('.fgo-eligible').checked,
    applyFgo: row.querySelector('.fgo-apply').checked,
  }));
}

function saveState() {
  const state = {
    prevCgpa: document.getElementById('prev-cgpa').value,
    prevAus: document.getElementById('prev-aus').value,
    courses: getCourses().map(({ name, au, grade, fgoEligible, applyFgo }) => ({ name, au, grade, fgoEligible, applyFgo })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return state && typeof state === 'object' ? state : null;
  } catch {
    return null;
  }
}

function refreshFgoSummary() {
  const courses = getCourses();
  let au = 0;
  courses.forEach((course) => {
    const selected = course.fgoEligible && course.applyFgo && course.au > 0;
    if (selected) au += course.au;
    course.row.classList.toggle('fgo-selected', selected);
  });
  document.getElementById('fgo-summary').textContent = `FGO selected: ${au} AU / ${FGO_CAP_AU} AU`;
  return au;
}

function validateCourses(prevCgpa, prevAus) {
  const error = document.getElementById('form-error');
  error.textContent = '';

  if (Number.isNaN(prevCgpa) || prevCgpa < 0 || prevCgpa > 5 || Number.isNaN(prevAus) || prevAus < 0) {
    error.textContent = 'Enter a valid previous CGPA (0-5) and completed AUs.';
    return null;
  }

  const courses = getCourses();
  if (!courses.length) {
    error.textContent = 'Add at least one course row.';
    return null;
  }

  for (const course of courses) {
    if (!course.name || Number.isNaN(course.au) || course.au <= 0 || !(course.grade in GRADE_POINTS)) {
      error.textContent = 'Every row needs course name, AU (> 0), and valid grade.';
      return null;
    }
  }

  const selectedAu = refreshFgoSummary();
  if (selectedAu > FGO_CAP_AU) {
    error.textContent = `FGO selection exceeds ${FGO_CAP_AU} AU cap.`;
    return null;
  }

  return courses;
}

function compute(courses, prevCgpa, prevAus) {
  const included = courses.filter((course) => !(course.fgoEligible && course.applyFgo));
  const semAus = included.reduce((sum, c) => sum + c.au, 0);
  const semPoints = included.reduce((sum, c) => sum + c.au * GRADE_POINTS[c.grade], 0);

  const semesterGpa = semAus > 0 ? semPoints / semAus : 0;
  const projectedCgpa = prevAus + semAus > 0 ? ((prevCgpa * prevAus) + semPoints) / (prevAus + semAus) : prevCgpa;

  document.getElementById('semester-gpa').textContent = semesterGpa.toFixed(2);
  document.getElementById('projected-cgpa').textContent = projectedCgpa.toFixed(2);
}

function calculate() {
  const prevCgpa = Number(document.getElementById('prev-cgpa').value);
  const prevAus = Number(document.getElementById('prev-aus').value);
  const courses = validateCourses(prevCgpa, prevAus);
  if (!courses) return;
  compute(courses, prevCgpa, prevAus);
  saveState();
}

function maximizeFgo() {
  const prevCgpa = Number(document.getElementById('prev-cgpa').value);
  const prevAus = Number(document.getElementById('prev-aus').value);
  const courses = validateCourses(prevCgpa, prevAus);
  if (!courses) return;

  const eligible = courses.map((course, idx) => ({ ...course, idx })).filter((c) => c.fgoEligible);
  const n = eligible.length;
  const maxAu = FGO_CAP_AU;

  const dp = Array.from({ length: n + 1 }, () => Array(maxAu + 1).fill(-Infinity));
  const take = Array.from({ length: n + 1 }, () => Array(maxAu + 1).fill(false));
  dp[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    const au = eligible[i - 1].au;
    const gain = au * (5 - GRADE_POINTS[eligible[i - 1].grade]);
    for (let cap = 0; cap <= maxAu; cap++) {
      dp[i][cap] = dp[i - 1][cap];
      if (au <= cap && dp[i - 1][cap - au] > -Infinity) {
        const candidate = dp[i - 1][cap - au] + gain;
        if (candidate > dp[i][cap]) {
          dp[i][cap] = candidate;
          take[i][cap] = true;
        }
      }
    }
  }

  let bestCap = 0;
  for (let cap = 1; cap <= maxAu; cap++) {
    if (dp[n][cap] > dp[n][bestCap]) bestCap = cap;
  }

  const chosen = new Set();
  for (let i = n, cap = bestCap; i > 0; i--) {
    if (take[i][cap]) {
      chosen.add(eligible[i - 1].idx);
      cap -= eligible[i - 1].au;
    }
  }

  courses.forEach((course, idx) => {
    const apply = chosen.has(idx) && course.fgoEligible;
    course.row.querySelector('.fgo-apply').checked = apply;
  });

  refreshFgoSummary();
  calculate();
}

function clearFgo() {
  getRows().forEach((row) => {
    row.querySelector('.fgo-apply').checked = false;
    row.classList.remove('fgo-selected');
  });
  refreshFgoSummary();
  saveState();
}

function addRow(course) {
  document.getElementById('course-rows').appendChild(makeRow(course));
}

function resetAll() {
  document.getElementById('prev-cgpa').value = '';
  document.getElementById('prev-aus').value = '';
  document.getElementById('course-rows').innerHTML = '';
  addRow();
  clearFgo();
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
    document.getElementById('course-rows').innerHTML = '';
    (restored.courses?.length ? restored.courses : [{}]).forEach(addRow);
  } else {
    addRow();
  }

  document.getElementById('add-course').addEventListener('click', () => {
    addRow();
    saveState();
  });
  document.getElementById('calculate').addEventListener('click', calculate);
  document.getElementById('maximize-fgo').addEventListener('click', maximizeFgo);
  document.getElementById('clear-fgo').addEventListener('click', clearFgo);
  document.getElementById('reset').addEventListener('click', resetAll);

  document.getElementById('course-rows').addEventListener('click', (event) => {
    if (!event.target.classList.contains('remove-row')) return;
    event.target.closest('tr')?.remove();
    if (!getRows().length) addRow();
    refreshFgoSummary();
    saveState();
  });

  document.getElementById('course-rows').addEventListener('change', (event) => {
    if (!event.target.classList.contains('fgo-eligible') && !event.target.classList.contains('fgo-apply')) {
      saveState();
      return;
    }

    const row = event.target.closest('tr');
    const eligible = row.querySelector('.fgo-eligible').checked;
    const applyBox = row.querySelector('.fgo-apply');

    if (!eligible) applyBox.checked = false;
    if (applyBox.checked && !eligible) applyBox.checked = false;

    refreshFgoSummary();
    saveState();
  });

  document.getElementById('main-content').addEventListener('input', (event) => {
    if (event.target.matches('input, select')) {
      refreshFgoSummary();
      saveState();
    }
  });

  refreshFgoSummary();
});
