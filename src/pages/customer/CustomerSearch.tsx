import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { restaurants, foodCategories } from '../../data/mockData';
import { SearchBar, Rating, Tabs } from '../../components/common';
import { ArrowLeft, Filter, MapPin, Clock, Star, Heart, SlidersHorizontal, X } from 'lucide-react';

// ============================================
// Search Page
// ============================================
export function CustomerSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState(searchParams.get('category') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const filtered = restaurants.filter(r => {
    const matchesQuery = !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !selectedCategory || r.cuisine.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesQuery || matchesCategory;
  });

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-20 px-4 pt-3 pb-3 border-b border-border-light">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
          <SearchBar placeholder="Search food, restaurants, cuisines..." value={query} onChange={v => { setQuery(v); setSelectedCategory(''); }} className="flex-1" />
        </div>
        <div className="flex gap-2 overflow-x-auto scroll-hidden">
          <button onClick={() => { setSelectedCategory(''); setQuery(''); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedCategory ? 'bg-brand-red text-white' : 'bg-bg-cream text-text-secondary border border-border'}`}
          >All</button>
          {foodCategories.map(cat => (
            <button key={cat.id} onClick={() => { setSelectedCategory(cat.name); setQuery(cat.name); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat.name ? 'bg-brand-red text-white' : 'bg-bg-cream text-text-secondary border border-border'}`}
            >{cat.name}</button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4">
        <p className="text-sm text-text-secondary mb-3">{filtered.length} restaurants found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(r => (
            <div key={r.id} onClick={() => navigate(`/customer/restaurants/${r.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {r.offer && <div className="absolute bottom-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-lg">{r.offer}</div>}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between mb-0.5">
                  <h3 className="text-sm font-bold text-text-primary line-clamp-1">{r.name}</h3>
                  <Rating rating={r.rating} />
                </div>
                <p className="text-xs text-text-secondary">{r.cuisine.join(' • ')}</p>
                <div className="flex items-center gap-3 text-xs text-text-tertiary mt-1.5">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.deliveryTime}</span>
                  <span>{r.distance}</span>
                  <span>{r.priceRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-bold text-text-primary">No restaurants found</p>
            <p className="text-sm text-text-secondary mt-1">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Restaurant Listing
// ============================================
export function RestaurantListing() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filterVeg, setFilterVeg] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  let filtered = restaurants.filter(r => {
    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'delivery') filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  else if (sortBy === 'distance') filtered.sort((a, b) => parseFloat(a.distance || '0') - parseFloat(b.distance || '0'));

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-20 px-4 pt-3 pb-3 border-b border-border-light">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold flex-1">Restaurants</h1>
        </div>
        <SearchBar placeholder="Search restaurants..." value={searchQuery} onChange={setSearchQuery} className="mb-3" />
        <div className="flex gap-2 overflow-x-auto scroll-hidden">
          {['recommended', 'rating', 'delivery', 'distance'].map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${sortBy === s ? 'bg-brand-red text-white' : 'bg-bg-cream text-text-secondary border border-border'}`}
            >{s === 'recommended' ? '⭐ Recommended' : s === 'rating' ? '🏆 Rating' : s === 'delivery' ? '⚡ Fast Delivery' : '📍 Nearest'}</button>
          ))}
          <button onClick={() => setFilterVeg(!filterVeg)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filterVeg ? 'bg-success text-white' : 'bg-bg-cream text-text-secondary border border-border'}`}
          >🥬 Veg Only</button>
        </div>
      </div>
      <div className="px-4 pt-4">
        <p className="text-sm text-text-secondary mb-3">{filtered.length} restaurants</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(r => (
            <div key={r.id} onClick={() => navigate(`/customer/restaurants/${r.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {r.offer && <div className="absolute bottom-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-lg">{r.offer}</div>}
                <button onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_FAVORITE', payload: r.id }); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                ><Heart className={`w-4 h-4 ${state.favoriteRestaurants.includes(r.id) ? 'fill-brand-red text-brand-red' : 'text-text-secondary'}`} /></button>
                {!r.isOpen && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-white text-sm font-bold px-4 py-2 rounded-xl">Closed</span></div>}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-bold text-text-primary line-clamp-1">{r.name}</h3>
                  <Rating rating={r.rating} />
                </div>
                <p className="text-xs text-text-secondary mb-2">{r.cuisine.join(' • ')}</p>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.deliveryTime}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.distance}</span>
                  <span>{r.priceRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
