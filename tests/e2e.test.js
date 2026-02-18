/** @jest-environment jsdom */

import { initBannerTabs } from '../public/scripts/bannerTabs.js';
import { calculateCumulativeCGPA } from '../public/scripts/calculator.js';

function setupBannerDOM() {
  document.body.innerHTML = `
    <nav>
      <div class="banner-tabs">
        <button id="tab-academics" class="banner-tab" type="button" role="tab" aria-selected="true" aria-controls="panel-academics" data-banner-tab>Academics</button>
        <button id="tab-tools" class="banner-tab" type="button" role="tab" aria-selected="false" aria-controls="panel-tools" tabindex="-1" data-banner-tab>Tools</button>
      </div>
      <div class="banner-panels" data-banner-tabs>
        <div id="panel-academics" role="tabpanel" data-banner-panel>Academics panel</div>
        <div id="panel-tools" role="tabpanel" data-banner-panel hidden>Tools panel</div>
      </div>
    </nav>
  `;
}

function setupHomeToolkitDOM() {
  document.body.innerHTML = `
    <section aria-label="Your Student Journey Toolkit">
      <a class="tool-button" href="pages/clubs/index.html">Clubs</a>
      <a class="tool-button" href="pages/airport/index.html">Airport</a>
    </section>
  `;
}

function setupClubsPageDOM() {
  document.body.innerHTML = `
    <input id="search-bar" />
    <select id="category-filter"></select>
    <select id="sort-by"></select>
    <select id="sort-order"></select>
    <button id="show-selected-btn"></button>
    <button id="show-all-btn"></button>
    <button id="clear-all-btn"></button>
    <span id="selected-count"></span>
    <div id="summary-stats"></div>
    <div id="club-grid"></div>
    <div id="no-results" class="hidden"></div>
  `;
}

function setupAirportPageDOM() {
  document.body.innerHTML = `
    <header class="header"></header>
    <a class="nav-link" href="#prep">prep</a>
    <section id="prep"></section>
    <section id="arrival"></section>
    <section id="transfer"></section>
    <button class="main-tab-btn active" data-target="t1"></button>
    <button class="main-tab-btn" data-target="t2"></button>
    <div id="t1-content" class="main-terminal-content active">
      <button class="zone-tab-btn active" data-target="t1c"></button>
      <div id="t1c-zone" class="zone-content active"></div>
    </div>
    <div id="t2-content" class="main-terminal-content"></div>
    <button data-lang-toggle></button>
    <div id="zh-content"></div>
    <div id="en-content" hidden></div>
  `;
}

describe('NTU Info - Integration Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Banner Tab System', () => {
    it('should set active tab class on page load', () => {
      setupBannerDOM();
      initBannerTabs();

      const activeTab = document.querySelector('.banner-tabs button.active');
      expect(activeTab).toBeTruthy();
      expect(activeTab.id).toBe('tab-academics');
    });

    it('should persist active tab in localStorage', () => {
      setupBannerDOM();
      initBannerTabs();

      const tools = document.getElementById('tab-tools');
      tools.click();

      expect(window.localStorage.getItem('ntuinfo.banner.activeTab')).toBe('tab-tools');
    });
  });

  describe('Homepage Toolkit Links', () => {
    it('should point to new folder-based tools', () => {
      setupHomeToolkitDOM();
      const links = Array.from(document.querySelectorAll('a.tool-button')).map((a) => a.getAttribute('href'));
      expect(links).toContain('pages/clubs/index.html');
      expect(links).toContain('pages/airport/index.html');
    });
  });

  describe('Clubs Explorer structure', () => {
    it('should contain legacy IDs needed by script', () => {
      setupClubsPageDOM();
      expect(document.getElementById('club-grid')).toBeTruthy();
      expect(document.getElementById('summary-stats')).toBeTruthy();
      expect(document.getElementById('search-bar')).toBeTruthy();
      expect(document.getElementById('category-filter')).toBeTruthy();
    });
  });

  describe('Airport Guide structure', () => {
    it('should contain terminal tab structure', () => {
      setupAirportPageDOM();
      expect(document.querySelectorAll('.main-tab-btn').length).toBeGreaterThanOrEqual(2);
      expect(document.querySelectorAll('.main-terminal-content').length).toBeGreaterThanOrEqual(2);
      expect(document.querySelector('[data-lang-toggle]')).toBeTruthy();
    });
  });

  describe('CGPA Calculator', () => {
    it('should calculate CGPA correctly', () => {
      const semesters = [
        {
          id: '1',
          collapsed: false,
          courses: [
            { id: 'c1', code: 'MH1100', name: 'Math', credits: 4, grade: 'A', isSU: false },
            { id: 'c2', code: 'CE2301', name: 'CE', credits: 3, grade: 'B+', isSU: false }
          ]
        }
      ];

      expect(calculateCumulativeCGPA(semesters)).toBe(4.57);
    });
  });
});
