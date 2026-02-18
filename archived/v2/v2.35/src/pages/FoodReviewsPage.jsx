import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18.2.0';
import { Search, Plus, SearchX, Star, Send, LogIn } from 'https://esm.sh/lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
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

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    stallName: '',
    rating: 5,
    review: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.stallName.trim() && formData.review.trim()) {
      onSubmit(formData);
      setFormData({ stallName: '', rating: 5, review: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Your Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Stall Name
            </label>
            <input
              type="text"
              value={formData.stallName}
              onChange={(e) => setFormData({...formData, stallName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter stall name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`p-1 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({...formData, review: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your experience..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FoodReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [canteens, setCanteens] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setCanteens(foodData.canteens);
  }, []);

  const handleReviewSubmit = (reviewData) => {
    const newReview = {
      id: Date.now(),
      stallName: reviewData.stallName,
      rating: reviewData.rating,
      review: reviewData.review,
      author: user?.name || 'Anonymous User',
      date: new Date().toLocaleDateString()
    };
    setUserReviews(prev => [newReview, ...prev]);
    setShowReviewForm(false);
  };

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
        {isAuthenticated ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex-shrink-0 w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Your Review
          </button>
        ) : (
          <div className="flex-shrink-0 w-full sm:w-auto bg-gray-100 text-gray-600 font-semibold py-2 px-6 rounded-full shadow-md flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" />
            Sign in to Review
          </div>
        )}
      </div>

      {userReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-green-200 pb-2 mb-6">Your Recent Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userReviews.map(review => (
              <div key={review.id} className="bg-green-50 border-2 border-green-200 rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg text-slate-800">{review.stallName}</h3>
                <div className="flex items-center mt-1 text-sm text-slate-600">
                  <span className="text-amber-500 font-bold">{review.rating.toFixed(1)}★</span>
                  <span className="mx-2">|</span>
                  <span>by {review.author}</span>
                </div>
                <blockquote className="mt-3 text-sm text-slate-500 border-l-4 border-green-300 pl-3 italic">
                  "{review.review}"
                </blockquote>
                <div className="mt-2 text-xs text-gray-400">
                  {review.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default FoodReviewsPage;
