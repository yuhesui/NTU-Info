import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18.2.0';
import { Search, Plus, SearchX } from 'https://esm.sh/lucide-react';
import foodData from '../data/food.json';

const FoodStallCard = ({ stall }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{stall.name}</h3>
        <div className="flex items-center mt-1 text-sm text-slate-600">
          <span className="text-amber-500 font-bold">{stall.rating.toFixed(1)}★</span>
          <span className="mx-2">|</span>
          <span>{stall.reviews} Reviews</span>
        </div>
        <blockquote className="mt-3 text-sm text-slate-500 border-l-4 border-slate-200 pl-3 italic">
          "{stall.sampleReview}"
        </blockquote>
      </div>
    </div>
  );
};

const FoodReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [canteens, setCanteens] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call.
    // For now, we just use the imported JSON data.
    setCanteens(foodData.canteens);
  }, []);

  const filteredCanteens = useMemo(() => {
    if (!searchTerm) {
      return canteens;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return canteens.map(canteen => {
      const filteredStalls = canteen.stalls.filter(stall => 
        stall.name.toLowerCase().includes(lowercasedFilter)
      );
      return { ...canteen, stalls: filteredStalls };
    }).filter(canteen => canteen.stalls.length > 0);

  }, [searchTerm, canteens]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Food Reviews & Ratings</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500">Discover the best eats on campus. Filter by name or browse by canteen.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full max-w-md">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
          <input
            type="text"
            placeholder="Search for a food stall..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="flex-shrink-0 w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            Add Your Review
        </button>
      </div>
      
      {filteredCanteens.length > 0 ? (
        <div className="space-y-12">
          {filteredCanteens.map(canteen => (
            <section key={canteen.id}>
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-6">{canteen.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {canteen.stalls.map(stall => (
                  <FoodStallCard key={stall.id} stall={stall} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <SearchX className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
                We couldn't find any stalls matching "{searchTerm}". Try a different search.
            </p>
        </div>
      )}
    </div>
  );
};

export default FoodReviewsPage;
