/** Main JS for homepage interactions (small + deterministic). */

import { initBannerTabs } from './bannerTabs.js';

// Ensure external links have accessible labels
document.addEventListener('DOMContentLoaded', () => {
  initBannerTabs();

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (link.getAttribute('aria-label')) return;
    const text = (link.textContent || '').trim() || 'External link';
    link.setAttribute('aria-label', `${text} (opens in new tab)`);
  });
});
