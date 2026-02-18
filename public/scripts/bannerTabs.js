import { createSafeTriangle } from './safeTriangle.js';

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

  const navRoot = panelsRoot.closest('nav') || document;
  const tabs = Array.from(navRoot.querySelectorAll('[data-banner-tab]'));
  const panels = Array.from(panelsRoot.querySelectorAll('[data-banner-panel]'));
  if (!tabs.length || !panels.length) return;

  function setPanelsOpen(isOpen) {
    panelsRoot.classList.toggle('is-open', isOpen);
  }

  function hideAllPanels() {
    panels.forEach((p) => {
      p.hidden = true;
      p.classList.remove('is-active');
    });
    setPanelsOpen(false);
  }

  function showPanel(panelId) {
    panels.forEach((p) => {
      const isActive = p.id === panelId;
      p.hidden = !isActive;
      p.classList.toggle('is-active', isActive);
    });
    setPanelsOpen(true);
  }

  function setActive(tabId, { focusTab = false, persist = true, openPanel = true } = {}) {
    const tab = tabs.find((t) => t.id === tabId) || tabs[0];
    const panelId = tab.getAttribute('aria-controls');

    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      t.classList.toggle('is-active', selected);
      t.classList.toggle('active', selected);
    });

    if (openPanel) showPanel(panelId);
    else hideAllPanels();

    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, tab.id); } catch {}
    }

    if (focusTab) tab.focus();
  }

  function showPanelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;
    const rect = tab.getBoundingClientRect();
    panel.style.minWidth = `${Math.max(180, Math.round(rect.width) + 40)}px`;
    setActive(tab.id, { persist: false, openPanel: true });
  }

  const helpers = tabs.map((tab) => {
    const panel = panels.find((p) => p.id === tab.getAttribute('aria-controls'));
    if (!panel) return null;
    return createSafeTriangle({
      trigger: tab,
      panel,
      closeDelay: 300,
      onOpen: () => showPanelForTab(tab),
      onClose: () => setActive(tab.id, { persist: false, openPanel: false }),
    });
  });

  let initialId = 'tab-academics';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && tabs.some((t) => t.id === stored)) initialId = stored;
  } catch {}

  setActive(initialId, { persist: false, openPanel: false });

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      showPanelForTab(tab);
      setActive(tab.id);
    });

    tab.addEventListener('focus', () => showPanelForTab(tab));

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
        showPanelForTab(next);
        setActive(next.id, { focusTab: true });
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        showPanelForTab(tabs[0]);
        setActive(tabs[0].id, { focusTab: true });
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        const lastTab = tabs[tabs.length - 1];
        showPanelForTab(lastTab);
        setActive(lastTab.id, { focusTab: true });
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setActive(tab.id, { persist: false, openPanel: false });
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const panel = panels.find((p) => p.id === tab.getAttribute('aria-controls'));
        const firstLink = panel?.querySelector('a[href]:not([aria-disabled="true"])');
        if (firstLink) firstLink.focus();
      }
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      const selectedTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      setActive(selectedTab.id, { persist: false, openPanel: false, focusTab: true });
    });
  });

  document.addEventListener('click', (event) => {
    if (!navRoot.contains(event.target)) {
      const selectedTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      setActive(selectedTab.id, { persist: false, openPanel: false });
    }
  });

  navRoot.addEventListener('focusout', (event) => {
    const next = event.relatedTarget;
    if (!next || !navRoot.contains(next)) {
      const selectedTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      setActive(selectedTab.id, { persist: false, openPanel: false });
    }
  });

  return () => helpers.forEach((helper) => helper?.destroy());
}
