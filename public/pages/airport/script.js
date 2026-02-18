// Airport Guide (legacy structure port)
// Adapted from archived/v3/Airport Guide/v2/script.js

function toggleLanguageInternal() {
  const zh = document.getElementById('zh-content');
  const en = document.getElementById('en-content');
  if (!zh || !en) return;

  const isZhVisible = !zh.hasAttribute('hidden');
  if (isZhVisible) {
    zh.setAttribute('hidden', '');
    en.removeAttribute('hidden');
  } else {
    en.setAttribute('hidden', '');
    zh.removeAttribute('hidden');
  }

  const indicator = document.getElementById('lang-indicator');
  if (indicator) indicator.textContent = isZhVisible ? '🌐 English | 中文' : '🌐 中文 | English';
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[PAGE] Loaded successfully:', document.title);

  // Language toggle
  const langBtn = document.querySelector('[data-lang-toggle]');
  langBtn?.addEventListener('click', toggleLanguageInternal);

  // Nav highlight
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();

  // Main terminal tabs
  const mainTerminalTabs = document.querySelectorAll('.main-tab-btn');
  const mainTerminalContents = document.querySelectorAll('.main-terminal-content');

  mainTerminalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      mainTerminalTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      mainTerminalContents.forEach((content) => {
        content.classList.remove('active');
        if (content.id === `${targetId}-content`) {
          content.classList.add('active');

          // Reset zone to first
          const firstZoneBtn = content.querySelector('.zone-tab-btn');
          const allZoneBtns = content.querySelectorAll('.zone-tab-btn');
          const allZoneContents = content.querySelectorAll('.zone-content');

          if (firstZoneBtn && allZoneBtns.length > 0) {
            allZoneBtns.forEach((btn) => btn.classList.remove('active'));
            firstZoneBtn.classList.add('active');

            const firstTargetId = firstZoneBtn.dataset.target;
            allZoneContents.forEach((zoneContent) => {
              zoneContent.classList.remove('active');
              if (zoneContent.id === `${firstTargetId}-zone`) zoneContent.classList.add('active');
            });
          }
        }
      });
    });
  });

  // Zone tabs (delegated)
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (!t.classList.contains('zone-tab-btn')) return;

    const targetId = t.dataset.target;
    const parentContent = t.closest('.main-terminal-content');

    if (!parentContent) return;

    const zoneBtns = parentContent.querySelectorAll('.zone-tab-btn');
    const zoneContents = parentContent.querySelectorAll('.zone-content');

    zoneBtns.forEach((btn) => btn.classList.remove('active'));
    t.classList.add('active');

    zoneContents.forEach((content) => {
      content.classList.remove('active');
      if (content.id === `${targetId}-zone`) content.classList.add('active');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (ev) {
      ev.preventDefault();
      const href = this.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (!target) return;
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  // Verification log
  console.log('[PAGE] Steps visible:', document.querySelectorAll('section').length);
});
