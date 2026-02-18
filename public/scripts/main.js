/** Main JS for shared header and global interactions. */

import { initBannerTabs } from './bannerTabs.js';

function getStudentLinksHref() {
  const path = window.location.pathname;
  if (path.includes('/pages/clubs/') || path.includes('/pages/airport/')) return '../student-links.html';
  if (path.includes('/pages/')) return 'student-links.html';
  return 'pages/student-links.html';
}

function normalizeHeaderBrand() {
  document.querySelectorAll('.logo-title').forEach((title) => {
    title.textContent = 'ntu info.com';
  });
  document.querySelectorAll('.logo-subtitle').forEach((subtitle) => subtitle.remove());
}

function ensureStudentLinksNav() {
  const href = getStudentLinksHref();
  document.querySelectorAll('#panel-guides .banner-panel-list').forEach((list) => {
    if (list.querySelector('a[href*="student-links.html"]')) return;
    const item = document.createElement('li');
    item.innerHTML = `<a href="${href}">Student Links</a>`;
    list.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  normalizeHeaderBrand();
  ensureStudentLinksNav();
  initBannerTabs();

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (link.getAttribute('aria-label')) return;
    const text = (link.textContent || '').trim() || 'External link';
    link.setAttribute('aria-label', `${text} (opens in new tab)`);
  });
});
