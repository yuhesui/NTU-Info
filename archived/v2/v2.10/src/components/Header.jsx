import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import GlobalSearch from './GlobalSearch.jsx';

const navigationLinks = [
    { name: 'Home', href: '#' },
    { name: 'Student Life', href: '#' },
    { name: 'Academics', href: '#' },
    { name: 'Quick Tools', href: '#' },
    { name: 'Resources', href: '#' },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        lucide.createIcons();
    });

    return (
        <header className="sticky top-0 z-30 w-full navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" className="text-2xl font-bold hero-gradient-text">
                            NTUinfo
                        </a>
                    </div>

                    <div className="hidden md:block md:w-2/5 lg:w-1/2">
                         <GlobalSearch />
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <nav className="flex space-x-1 lg:space-x-2">
                           {navigationLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                    
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <i data-lucide={isMenuOpen ? 'x' : 'menu'} className="h-6 w-6"></i>
                        </button>
                    </div>
                </div>

                <div className="md:hidden pb-4">
                    <GlobalSearch />
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigationLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
