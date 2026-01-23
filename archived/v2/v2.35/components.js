import { navLinks, featureCardsData } from './data.js';

const createNavbar = () => {
    const navItems = navLinks.map(link => `
        <li>
            <a href="${link.href}" class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-ntu-red transition-colors duration-200 py-2">
                <i data-lucide="${link.icon}" class="w-4 h-4"></i>
                <span>${link.name}</span>
            </a>
        </li>
    `).join('');

    return `
        <header id="main-header" class="sticky top-0 z-50 w-full border-b border-gray-200/80 navbar">
            <nav class="container mx-auto px-4 md:px-6">
                <div class="flex items-center justify-between h-16">
                    <a href="#" class="flex items-center gap-2">
                        <span class="w-8 h-8 bg-ntu-blue text-white flex items-center justify-center rounded-lg font-bold text-lg">N</span>
                        <span class="font-bold text-lg text-gray-800 hidden sm:inline">NTU<span class="font-light">Hub</span></span>
                    </a>
                    
                    <div class="hidden md:flex items-center">
                        <ul class="flex items-center space-x-6">
                            ${navItems}
                        </ul>
                    </div>

                    <div class="flex md:hidden items-center">
                        <button id="mobile-menu-button" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-ntu-red hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ntu-red" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <i data-lucide="menu" class="block h-6 w-6"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile menu, show/hide based on menu state. -->
            <div class="hidden md:hidden" id="mobile-menu">
                <ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    ${navItems}
                </ul>
            </div>
        </header>
    `;
};

const createHero = () => {
    return `
        <section class="py-16 md:py-24 bg-white">
            <div class="container mx-auto px-4 md:px-6 text-center">
                <div class="max-w-3xl mx-auto">
                    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        Your Essential <span class="hero-gradient-text">NTU Campus Hub</span>
                    </h1>
                    <p class="mt-4 md:mt-6 text-lg text-gray-600">
                        Streamlining your university journey with powerful tools, essential guides, and centralized resources. All in one place.
                    </p>
                </div>
                
                <div class="mt-8 md:mt-12 max-w-xl mx-auto">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
                        </div>
                        <input type="search" placeholder="Search for tools, guides, or resources..." class="w-full py-4 pl-12 pr-4 text-base text-gray-900 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-ntu-blue focus:border-ntu-blue transition-shadow duration-200">
                    </div>
                </div>

                <div class="mt-12">
                    <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Featured Tools Carousel (Coming Soon)</div>
                    <div class="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                         <p class="text-gray-400">Carousel Placeholder</p>
                    </div>
                </div>
            </div>
        </section>
    `;
};

const createStatsCounter = () => {
    return `
        <div class="bg-ntu-blue text-white py-12">
            <div class="container mx-auto px-4 md:px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                    <div class="stat-item">
                        <span class="text-5xl font-bold" data-counter-target="113">0</span>
                        <p class="mt-2 text-lg text-blue-200">Clubs Analyzed</p>
                    </div>
                    <div class="stat-item">
                        <span class="text-5xl font-bold" data-counter-target="1000" id="students-helped">0</span>
                        <p class="mt-2 text-lg text-blue-200">1,000+ Students Helped</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const createFeatureCard = (card) => {
    return `
        <div class="feature-card bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div class="p-6 flex-grow">
                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center ${card.iconBg}">
                        <i data-lucide="${card.icon}" class="${card.iconColor}"></i>
                    </div>
                    <div class="status-badge status-coming-soon">Coming Soon</div>
                </div>
                <h3 class="text-lg font-bold text-gray-900">${card.title}</h3>
                <p class="mt-2 text-sm text-gray-600 line-clamp-2">${card.description}</p>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <a href="#" class="font-semibold text-sm text-ntu-blue hover:text-ntu-red transition-colors duration-200 flex items-center gap-1">
                    Learn More <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
    `;
};

const createQuickAccessGrid = () => {
    const cardsHtml = featureCardsData.map(createFeatureCard).join('');
    return `
        <section class="py-16 md:py-24 bg-gray-50">
            <div class="container mx-auto px-4 md:px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Quick Access Tools</h2>
                    <p class="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                        Essential tools and resources at your fingertips. More features are on the way.
                    </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${cardsHtml}
                </div>
            </div>
        </section>
    `;
};

const createFooter = () => {
  const year = new Date().getFullYear();
  return `
    <footer class="bg-white border-t border-gray-200">
      <div class="container mx-auto px-4 md:px-6 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div class="col-span-2 lg:col-span-2">
            <a href="#" class="flex items-center gap-2">
              <span class="w-8 h-8 bg-ntu-blue text-white flex items-center justify-center rounded-lg font-bold text-lg">N</span>
              <span class="font-bold text-lg text-gray-800">NTU Campus Hub</span>
            </a>
            <p class="mt-4 text-sm text-gray-600">
              A student-led project to enhance the NTU experience. Not an official university website.
            </p>
          </div>
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigation</h3>
            <ul class="mt-4 space-y-2">
              ${navLinks.map(link => `
                <li>
                  <a href="${link.href}" class="text-sm text-gray-600 hover:text-ntu-red">${link.name}</a>
                </li>`).join('')}
            </ul>
          </div>
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="https://www.ntu.edu.sg" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 hover:text-ntu-red">Official NTU Website</a></li>
              <li><a href="#" class="text-sm text-gray-600 hover:text-ntu-red">Feedback</a></li>
              <li><a href="#" class="text-sm text-gray-600 hover:text-ntu-red">FAQ</a></li>
            </ul>
          </div>
          <div class="col-span-2 md:col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
            <p class="mt-4 text-sm text-gray-600">Provide feedback or contribute to the project on GitHub.</p>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            &copy; ${year} NTU Campus Hub. All Rights Reserved.
            &nbsp;&bull;&nbsp;Built by
            <a href="https://qrsntu.org"
               class="text-blue-600 hover:text-blue-700 underline font-medium"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Visit QRS@NTU website">
              QRS@NTU
            </a>
          </p>
        </div>
      </div>
    </footer>
  `;
};



export const createApp = () => `
    ${createNavbar()}
    <main>
        ${createHero()}
        ${createQuickAccessGrid()}
        ${createStatsCounter()}
    </main>
    ${createFooter()}
`;
