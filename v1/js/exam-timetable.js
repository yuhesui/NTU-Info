const MS_PER_DAY = 86400000;

function uuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let exams = [];
const examsContainer = document.getElementById('exams-container');
const timetableBody = document.getElementById('timetable-body');
const conflictContainer = document.getElementById('conflict-container');

function loadExams() {
  const saved = localStorage.getItem('ntuinfo_exam_data');
  exams = saved ? JSON.parse(saved) : [];
}

function saveExams() {
  localStorage.setItem('ntuinfo_exam_data', JSON.stringify(exams));
}

function sortExams() {
  exams.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.startTime}`);
    const dateB = new Date(`${b.date} ${b.startTime}`);
    return dateA - dateB;
  });
}

function addExam(examData = {}) {
  exams.push({
    id: uuid(),
    courseCode: examData.courseCode || '',
    courseName: examData.courseName || '',
    date: examData.date || '',
    startTime: examData.startTime || '',
    duration: examData.duration || 120,
    venue: examData.venue || ''
  });
  saveExams();
  render();
}

function removeExam(id) {
  exams = exams.filter(e => e.id !== id);
  saveExams();
  render();
}

function updateExam(id, field, value) {
  const exam = exams.find(e => e.id === id);
  if (!exam) return;
  exam[field] = value;
  saveExams();
  render();
}

function detectConflicts() {
  const conflicts = [];
  sortExams();
  for (let i = 0; i < exams.length - 1; i++) {
    const current = exams[i];
    const next = exams[i + 1];
    if (current.date !== next.date) continue;
    const start = new Date(`${current.date} ${current.startTime}`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + Number(current.duration));
    const nextStart = new Date(`${next.date} ${next.startTime}`);
    if (end > nextStart) {
      conflicts.push({ exam1: current, exam2: next });
    }
  }
  return conflicts;
}

function calculateStudyDays(examDate) {
  if (!examDate) return '-';
  const today = new Date();
  const exam = new Date(examDate);
  const diffTime = exam - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 0 : diffDays;
}

function renderExamsList() {
  examsContainer.innerHTML = '';
  exams.forEach(exam => {
    const row = document.createElement('div');
    row.className = 'exam-row';
    row.innerHTML = `
      <div class="form-field">
        <label>Course Code</label>
        <input type="text" value="${exam.courseCode}" aria-label="Course code">
      </div>
      <div class="form-field">
        <label>Course Name</label>
        <input type="text" value="${exam.courseName}" aria-label="Course name">
      </div>
      <div class="form-field">
        <label>Exam Date</label>
        <input type="date" value="${exam.date}" aria-label="Exam date">
      </div>
      <div class="form-field">
        <label>Start Time</label>
        <input type="time" value="${exam.startTime}" aria-label="Start time">
      </div>
      <div class="form-field short">
        <label>Duration</label>
        <select aria-label="Duration">
          <option value="60" ${exam.duration === 60 ? 'selected' : ''}>1 hr</option>
          <option value="90" ${exam.duration === 90 ? 'selected' : ''}>1.5 hrs</option>
          <option value="120" ${exam.duration === 120 ? 'selected' : ''}>2 hrs</option>
          <option value="150" ${exam.duration === 150 ? 'selected' : ''}>2.5 hrs</option>
          <option value="180" ${exam.duration === 180 ? 'selected' : ''}>3 hrs</option>
        </select>
      </div>
      <div class="form-field">
        <label>Venue</label>
        <input type="text" value="${exam.venue}" aria-label="Venue">
      </div>
      <button class="btn ghost danger" aria-label="Remove exam">Remove</button>
    `;

    const inputs = row.querySelectorAll('input, select');
    inputs[0].addEventListener('input', e => updateExam(exam.id, 'courseCode', e.target.value));
    inputs[1].addEventListener('input', e => updateExam(exam.id, 'courseName', e.target.value));
    inputs[2].addEventListener('input', e => updateExam(exam.id, 'date', e.target.value));
    inputs[3].addEventListener('input', e => updateExam(exam.id, 'startTime', e.target.value));
    inputs[4].addEventListener('change', e => updateExam(exam.id, 'duration', Number(e.target.value)));
    inputs[5].addEventListener('input', e => updateExam(exam.id, 'venue', e.target.value));

    const removeBtn = row.querySelector('button');
    removeBtn.addEventListener('click', () => removeExam(exam.id));

    examsContainer.appendChild(row);
  });
}

function renderTimetable() {
  sortExams();
  timetableBody.innerHTML = '';
  exams.forEach(exam => {
    const tr = document.createElement('tr');
    const end = new Date(`${exam.date} ${exam.startTime}`);
    if (exam.date && exam.startTime) end.setMinutes(end.getMinutes() + Number(exam.duration));
    const endTime = exam.date && exam.startTime ? `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}` : '-';
    const studyDays = calculateStudyDays(exam.date);

    tr.innerHTML = `
      <td>${exam.date || '-'}</td>
      <td>${exam.startTime ? `${exam.startTime}-${endTime}` : '-'}</td>
      <td>${exam.courseCode || ''}</td>
      <td>${exam.duration ? `${exam.duration} mins` : '-'}</td>
      <td>${exam.venue || ''}</td>
      <td><span class="study-days-badge ${studyDays > 7 ? 'study-days-safe' : studyDays >= 3 ? 'study-days-moderate' : 'study-days-urgent'}">${studyDays} days</span></td>
    `;
    timetableBody.appendChild(tr);
  });
}

function renderConflicts() {
  const conflicts = detectConflicts();
  conflictContainer.innerHTML = '';
  if (!conflicts.length) return;

  const div = document.createElement('div');
  div.className = 'conflict-warning';
  const listItems = conflicts.map(c => `<li>${c.exam1.courseCode || 'Exam 1'} (${c.exam1.date} ${c.exam1.startTime}) and ${c.exam2.courseCode || 'Exam 2'} (${c.exam2.date} ${c.exam2.startTime})</li>`).join('');
  div.innerHTML = `
    ⚠️ <strong>Exam Conflict Detected</strong>
    <p>The following exams have overlapping times:</p>
    <ul>${listItems}</ul>
    <p>Action: Contact your course coordinator immediately to resolve this conflict.</p>
  `;
  conflictContainer.appendChild(div);
}

function getExamPeriod() {
  if (!exams.length) return '-';
  const dates = exams.filter(e => e.date).map(e => new Date(e.date));
  if (!dates.length) return '-';
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const fmt = (d) => `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `${fmt(min)} - ${fmt(max)}`;
}

function renderPlanner() {
  const total = exams.length;
  const period = getExamPeriod();
  const daysArray = exams.map(e => calculateStudyDays(e.date)).filter(d => typeof d === 'number');
  const avg = daysArray.length ? (daysArray.reduce((a, b) => a + b, 0) / daysArray.length).toFixed(1) : 0;

  document.getElementById('total-exams').textContent = total;
  document.getElementById('exam-period').textContent = period;
  document.getElementById('avg-study').textContent = `${avg} days/exam`;
  document.getElementById('busiest-week').textContent = getBusiestWeek();
}

function getBusiestWeek() {
  if (!exams.length) return '-';
  const weeks = {};
  exams.forEach(exam => {
    if (!exam.date) return;
    const date = new Date(exam.date);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil((((date - onejan) / MS_PER_DAY) + onejan.getDay() + 1) / 7);
    weeks[week] = (weeks[week] || 0) + 1;
  });
  const entries = Object.entries(weeks);
  if (!entries.length) return '-';
  entries.sort((a, b) => b[1] - a[1]);
  return `Week ${entries[0][0]} (${entries[0][1]} exams)`;
}

function render() {
  renderExamsList();
  renderTimetable();
  renderConflicts();
  renderPlanner();
}

function exportICS() {
  if (!exams.length) return;
  const { createEvents } = window.ics;
  const events = exams.map(exam => {
    if (!exam.date || !exam.startTime) return null;
    const [year, month, day] = exam.date.split('-').map(Number);
    const [hour, minute] = exam.startTime.split(':').map(Number);
    return {
      start: [year, month, day, hour, minute],
      duration: { minutes: Number(exam.duration) || 0 },
      title: `${exam.courseCode || 'Exam'} Final Exam`,
      description: exam.courseName || '',
      location: exam.venue || '',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      alarms: [{ action: 'display', trigger: { hours: 24, before: true } }]
    };
  }).filter(Boolean);

  createEvents(events, (error, value) => {
    if (error) {
      console.error(error);
      alert('Failed to generate calendar. Please check your inputs and try again.');
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NTU_Exam_Timetable.ics';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function exportTimetablePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('NTU Exam Timetable', 20, 20);

  const tableData = exams.map(exam => [
    exam.date || '',
    exam.startTime || '',
    exam.courseCode || '',
    `${exam.duration || 0} mins`,
    exam.venue || ''
  ]);

  doc.autoTable({
    head: [['Date', 'Time', 'Course', 'Duration', 'Venue']],
    body: tableData,
    startY: 30
  });

  const finalY = doc.lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total Exams: ${exams.length}`, 20, finalY + 15);
  doc.text(`Exam Period: ${getExamPeriod()}`, 20, finalY + 25);

  doc.save('NTU_Exam_Timetable.pdf');
}

function parseTextInput(text) {
  const lines = text.split('\n');
  const parsed = [];
  // pattern: CODE DD/MM/YYYY HH:MM Xhrs VENUE
  const pattern1 = /([A-Za-z0-9]+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})\s+(\d+\.?\d*)hrs?\s+([A-Za-z0-9-]+)/i;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const match = trimmed.match(pattern1);
    if (match) {
      const [, code, date, time, duration, venue] = match;
      const isoDate = date.split('/').reverse().join('-');
      parsed.push({
        courseCode: code,
        courseName: '',
        date: isoDate,
        startTime: time,
        duration: Number(duration) * 60,
        venue
      });
    }
  });
  return parsed;
}

function importFromText() {
  const text = document.getElementById('import-text').value;
  const parsed = parseTextInput(text);
  parsed.forEach(item => addExam(item));
}

function clearAll() {
  const confirmed = window.confirm('Clear all exam entries?');
  if (!confirmed) return;
  exams = [];
  saveExams();
  render();
}

function bindActions() {
  document.getElementById('add-exam').addEventListener('click', () => addExam());
  document.getElementById('import-btn').addEventListener('click', importFromText);
  document.getElementById('export-ics').addEventListener('click', exportICS);
  document.getElementById('export-exam-pdf').addEventListener('click', exportTimetablePDF);
  document.getElementById('print-timetable').addEventListener('click', () => window.print());
  document.getElementById('clear-exams').addEventListener('click', clearAll);
}

function initExams() {
  loadExams();
  if (!exams.length) addExam();
  bindActions();
  render();
}

document.addEventListener('DOMContentLoaded', initExams);
