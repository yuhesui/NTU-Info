/** Site-wide initialization for banner tabs, floating promo banner, and external link accessibility labels. */

import { initBannerTabs } from './bannerTabs.js';
import { initFloatingPromoBanner } from './floatingPromoBanner.js';

// Ensure external links have accessible labels
document.addEventListener('DOMContentLoaded', () => {
  initBannerTabs();
  initFloatingPromoBanner();

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (link.getAttribute('aria-label')) return;
    const text = (link.textContent || '').trim() || 'External link';
    link.setAttribute('aria-label', `${text} (opens in new tab)`);
  });
});
