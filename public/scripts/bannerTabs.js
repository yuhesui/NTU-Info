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
      // Required by prompt: CSS selector expects `.active`
      t.classList.toggle('active', selected);
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
  // Start with panels collapsed on initial load so they only expand when the user clicks a tab.
  setActive(initialId, { persist: false, openPanel: false });

  // Diagnostics required by prompt
  const activeButton = /** @type {HTMLButtonElement|null} */ (navRoot.querySelector('.banner-tabs button.active'));
  if (activeButton) {
    console.log('Active tab on load:', (activeButton.textContent || '').trim());
    console.log('[BANNER] Active tab:', window.localStorage.getItem(STORAGE_KEY));
    console.log('[BANNER] Active button styling:', window.getComputedStyle(activeButton).borderBottom);
  }

  function focusFirstLink(panelId) {
    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;
    const firstLink = panel.querySelector('a[href]:not([aria-disabled="true"])');
    if (firstLink) firstLink.focus();
  }

  // Click/tap
  let hideTimer = null;
  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function showPanelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;

    // Size the panel to be similar to the tab width (min-width) so it doesn't appear overly wide.
    try {
      const rect = tab.getBoundingClientRect();
      // Use min-width so content can grow if needed but base width matches the tab.
      panel.style.minWidth = `${Math.max(160, Math.round(rect.width))}px`;
    } catch (e) {
      // ignore in older browsers
    }

    setActive(tab.id, { persist: false, openPanel: true });
  }

  function hidePanelForTab(tab) {
    const tabId = tab.id;
    setActive(tabId, { persist: false, openPanel: false });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(tab.id);
    });

    // Hover behavior: show when mouse enters, hide shortly after leaving.
    tab.addEventListener('mouseenter', () => {
      clearHideTimer();
      showPanelForTab(tab);
    });

    tab.addEventListener('mouseleave', () => {
      // Delay hiding slightly to allow moving into the panel without flicker
      clearHideTimer();
      hideTimer = setTimeout(() => hidePanelForTab(tab), 180);
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

    // Hover support on the panel itself so it remains open when the pointer moves from the tab into the panel
    panel.addEventListener('mouseenter', () => {
      clearHideTimer();
      // Keep the currently selected tab's panel open
      const selectedTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      // Ensure the panel width follows the selected tab
      const tab = tabs.find((t) => t.getAttribute('aria-controls') === panel.id) || selectedTab;
      showPanelForTab(tab);
    });

    panel.addEventListener('mouseleave', () => {
      clearHideTimer();
      // Find the tab that controls this panel to hide it
      const tab = tabs.find((t) => t.getAttribute('aria-controls') === panel.id);
      hideTimer = setTimeout(() => {
        if (tab) hidePanelForTab(tab);
      }, 160);
    });
  });
}
