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
  const panelsRoot = document.querySelector('[data-banner-tabs]');
  if (!panelsRoot) return;

  // The tablist sits next to the panels root.
  const navRoot = panelsRoot.closest('nav') || document;
  const tabs = Array.from(navRoot.querySelectorAll('[data-banner-tab]'));
  const panels = Array.from(panelsRoot.querySelectorAll('[data-banner-panel]'));

  if (tabs.length === 0 || panels.length === 0) return;

  function hideAllPanels() {
    panels.forEach((p) => {
      p.hidden = true;
      p.classList.remove('is-active');
    });
  }

  function showPanel(panelId) {
    panels.forEach((p) => {
      const isActive = p.id === panelId;
      p.hidden = !isActive;
      p.classList.toggle('is-active', isActive);
    });
  }

  function setActive(tabId, { focusTab = false, persist = true, openPanel = true } = {}) {
    const tab = tabs.find((t) => t.id === tabId) || tabs[0];
    const panelId = tab.getAttribute('aria-controls');

    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      t.classList.toggle('is-active', selected);
    });

    if (openPanel) {
      showPanel(panelId);
    } else {
      hideAllPanels();
    }

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

  function focusFirstLink(panelId) {
    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;
    const firstLink = panel.querySelector('a[href]:not([aria-disabled="true"])');
    if (firstLink) firstLink.focus();
  }

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
        e.preventDefault();
        // Collapse panel content but keep selected highlight.
        setActive(tab.id, { persist: false, openPanel: false });
      }

      if (e.key === 'ArrowDown') {
        // Optional convenience: move into panel.
        e.preventDefault();
        const panelId = tab.getAttribute('aria-controls');
        focusFirstLink(panelId);
      }
    });
  });

  // Let users press Escape while focus is inside the panel to collapse it.
  panels.forEach((panel) => {
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      const selectedTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      setActive(selectedTab.id, { persist: false, openPanel: false, focusTab: true });
    });
  });
}
