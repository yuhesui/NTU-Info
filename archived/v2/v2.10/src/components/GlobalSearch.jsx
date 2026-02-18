import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0';

const GlobalSearch = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const searchRef = useRef(null);

    const suggestions = [
        { name: 'Clubs & Societies Explorer', category: 'Student Life' },
        { name: 'GPA Calculator', category: 'Academics' },
        { name: 'Room Layout Downloads', category: 'Quick Tools' },
        { name: 'Airport Arrival Guide', category: 'Student Life' },
        { name: 'MOOC Credit Transfer Guide', category: 'Academics' },
    ];
    
    const filteredSuggestions = query 
        ? suggestions.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={searchRef} className="relative w-full max-w-lg mx-auto">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search all features..."
                    className="w-full px-4 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-ntu-red-light focus:border-ntu-red-light focus:outline-none transition-shadow"
                    onFocus={() => setIsFocused(true)}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i data-lucide="search" className="w-5 h-5 text-gray-400"></i>
                </div>
            </div>
            
            {isFocused && (
                <div className="absolute z-20 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                        {query && filteredSuggestions.length > 0 && (
                             <div className="mb-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestions</h3>
                                <ul className="mt-2 space-y-1">
                                    {filteredSuggestions.map((item, index) => (
                                        <li key={index}>
                                            <a href="#" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">{item.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {query && filteredSuggestions.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-2">No results found for "{query}"</p>
                        )}
                        
                        <div className="border-t border-gray-200 pt-4">
                            <div className="mb-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:bg-ntu-blue focus:text-white focus:outline-none">Academic</button>
                                    <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:bg-ntu-blue focus:text-white focus:outline-none">Lifestyle</button>
                                    <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:bg-ntu-blue focus:text-white focus:outline-none">Tools</button>
                                    <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:bg-ntu-blue focus:text-white focus:outline-none">Guides</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200 focus:bg-green-600 focus:text-white focus:outline-none">Active</button>
                                    <button className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200 focus:bg-yellow-500 focus:text-white focus:outline-none">Beta</button>
                                    <button className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 focus:bg-blue-600 focus:text-white focus:outline-none">Coming Soon</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
