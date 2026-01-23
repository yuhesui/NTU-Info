import { createApp } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = createApp();

    lucide.createIcons();
    
    initializeMobileMenu();
    initializeStatsCounter();
});

function initializeMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function initializeStatsCounter() {
    const counters = document.querySelectorAll('[data-counter-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.getAttribute('data-counter-target'), 10);
                
                const controls = window.framerAnimate(0, targetValue, {
                    duration: 2.5,
                    ease: "easeOut",
                    onUpdate: (latest) => {
                        counterElement.textContent = Math.round(latest).toLocaleString();
                    }
                });
                observer.unobserve(counterElement);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}
