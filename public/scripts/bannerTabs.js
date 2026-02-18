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

  if (tabs.length === 0 || panels.length === 0) return;

  let activeTabId = tabs[0].id;

  function hideAllPanels() {
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove('is-active');
    });
  }

  function showPanel(panelId) {
    panels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });
  }

  function setActive(tabId, { focusTab = false, persist = true, openPanel = true } = {}) {
    const tab = tabs.find((item) => item.id === tabId) || tabs[0];
    activeTabId = tab.id;
    const panelId = tab.getAttribute('aria-controls');

    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', selected ? 'true' : 'false');
      item.tabIndex = selected ? 0 : -1;
      item.classList.toggle('is-active', selected);
      item.classList.toggle('active', selected);
    });

    if (openPanel) {
      showPanel(panelId);
    } else {
      hideAllPanels();
    }

    if (persist) {
      localStorage.setItem(STORAGE_KEY, tab.id);
    }

    if (focusTab) tab.focus();
  }

  function sizePanelToTab(tab, panel) {
    if (!tab || !panel) return;
    const rect = tab.getBoundingClientRect();
    panel.style.minWidth = `${Math.max(200, Math.round(rect.width + 36))}px`;
  }

  function openForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    const panel = panels.find((item) => item.id === panelId);
    if (!panel) return;
    sizePanelToTab(tab, panel);
    setActive(tab.id, { persist: false, openPanel: true });
  }

  function closePanels() {
    setActive(activeTabId, { persist: false, openPanel: false });
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && tabs.some((tab) => tab.id === stored)) {
    activeTabId = stored;
  }
  setActive(activeTabId, { persist: false, openPanel: false });

  tabs.forEach((tab) => {
    const panelId = tab.getAttribute('aria-controls');
    const panel = panels.find((item) => item.id === panelId);
    if (!panel) return;

    createSafeTriangle({
      trigger: tab,
      panel,
      closeDelay: 280,
      onOpen: () => openForTab(tab),
      onClose: closePanels
    });

    tab.addEventListener('click', (event) => {
      event.preventDefault();
      openForTab(tab);
      setActive(tab.id, { persist: true, openPanel: true });
    });

    tab.addEventListener('keydown', (event) => {
      const currentIndex = tabs.indexOf(tab);

      if (isActivationKey(event)) {
        event.preventDefault();
        setActive(tab.id, { persist: true, openPanel: true });
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[clampIndex(currentIndex + delta, tabs.length)];
        setActive(next.id, { focusTab: true, persist: true, openPanel: true });
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setActive(tabs[0].id, { focusTab: true, persist: true, openPanel: true });
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        setActive(tabs[tabs.length - 1].id, { focusTab: true, persist: true, openPanel: true });
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closePanels();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const firstLink = panel.querySelector('a[href]:not([aria-disabled="true"])');
        if (firstLink) firstLink.focus();
      }
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
      closePanels();
      activeTab.focus();
    });
  });

  navRoot.addEventListener('focusout', (event) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && navRoot.contains(nextTarget)) return;
    closePanels();
  });
}
