document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function changeNavOnScroll() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', changeNavOnScroll);

    function setupFilter(containerId, buttonClass, contentClass, defaultTarget) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const buttons = container.querySelectorAll('.' + buttonClass);
        const contents = container.querySelectorAll('.' + contentClass);

        function activateTab(targetId) {
            buttons.forEach(button => {
                if (button.dataset.target === targetId) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });

            contents.forEach(content => {
                const contentId = targetId + '-content';
                if (content.id === contentId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                if (target) {
                    activateTab(target);
                }
            });
        });

        if (defaultTarget) {
            activateTab(defaultTarget);
        }
    }

    setupFilter('terminal-filter-container', 'terminal-filter-btn', 'terminal-content', 't1');
    setupFilter('transport-filter-container', 'transport-filter-btn', 'transport-content', 'mrt');
});
