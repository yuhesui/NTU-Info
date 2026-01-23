/**
 * Banner tabs controller (accessible + persistent).
 *
 * Contract:
 * - Expects markup:
 *   - [data-banner-tabs] element containing buttons [data-banner-tab] with role="tab"
 *   - Panels [data-banner-panel] with role="tabpanel" and id referenced by aria-controls
 * - Persists active tab id in localStorage key: ntuinfo.banner.activeTab
 */

const STORAGE_KEY = 'ntuinfo.banner.activeTab';

function isActivationKey(event) {
  return event.key === 'Enter' || event.key === ' ';
}

function clampIndex(idx, length) {
  if (length <= 0) return 0;
  return (idx + length) % length;
}

export function initBannerTabs() {
  const root = document.querySelector('[data-banner-tabs]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('[data-banner-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-banner-panel]'));

  if (tabs.length === 0 || panels.length === 0) return;

  function setActive(tabId, { focusTab = false, persist = true } = {}) {
    const tab = tabs.find((t) => t.id === tabId) || tabs[0];
    const panelId = tab.getAttribute('aria-controls');

    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      t.classList.toggle('is-active', selected);
    });

    panels.forEach((p) => {
      const isActive = p.id === panelId;
      p.hidden = !isActive;
      p.classList.toggle('is-active', isActive);
    });

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, tab.id);
      } catch {
        // ignore
      }
    }

    if (focusTab) tab.focus();
  }

  // Restore last selection.
  let initialId = 'tab-academics';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && tabs.some((t) => t.id === stored)) initialId = stored;
  } catch {
    // ignore
  }

  // Ensure DOM state matches.
  setActive(initialId, { persist: false });

  // Click/tap
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(tab.id);
    });

    tab.addEventListener('keydown', (e) => {
      const currentIndex = tabs.indexOf(tab);

      if (isActivationKey(e)) {
        e.preventDefault();
        setActive(tab.id);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[clampIndex(currentIndex + delta, tabs.length)];
        setActive(next.id, { focusTab: true });
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        setActive(tabs[0].id, { focusTab: true });
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        setActive(tabs[tabs.length - 1].id, { focusTab: true });
        return;
      }

      if (e.key === 'Escape') {
        // "Close" panel by collapsing content, but keep selected state visible.
        // Implemented by hiding all panels.
        e.preventDefault();
        panels.forEach((p) => {
          p.hidden = true;
          p.classList.remove('is-active');
        });
      }
    });
  });
}
