import { createApp } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    try {
        // Render the app
        appContainer.innerHTML = createApp();

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide icons not loaded');
        }

        // Initialize components
        initializeMobileMenu();
        initializeStatsCounter();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        appContainer.innerHTML = `
            <div class="min-h-screen bg-red-50 flex items-center justify-center">
                <div class="text-center p-8">
                    <div class="text-red-600 mb-4">
                        <i data-lucide="alert-circle" class="w-12 h-12 mx-auto"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-red-800 mb-2">Loading Error</h2>
                    <p class="text-red-600">There was an error loading the application. Please check the console for details.</p>
                </div>
            </div>
        `;
    }
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
    } else {
        console.warn('Mobile menu elements not found');
    }
}

function initializeStatsCounter() {
    const counters = document.querySelectorAll('[data-counter-target]');

    if (counters.length === 0) {
        console.warn('No counter elements found');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.getAttribute('data-counter-target'), 10);

                // Fallback animation if Framer Motion is not available
                if (typeof window.framerAnimate === 'undefined') {
                    // Simple counter animation
                    let current = 0;
                    const increment = targetValue / 100;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetValue) {
                            current = targetValue;
                            clearInterval(timer);
                        }
                        counterElement.textContent = Math.round(current).toLocaleString();
                    }, 20);
                } else {
                    // Use Framer Motion if available
                    try {
                        window.framerAnimate(0, targetValue, {
                            duration: 2.5,
                            ease: "easeOut",
                            onUpdate: (latest) => {
                                counterElement.textContent = Math.round(latest).toLocaleString();
                            }
                        });
                    } catch (error) {
                        console.warn('Framer Motion animation failed, using fallback');
                        counterElement.textContent = targetValue.toLocaleString();
                    }
                }

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