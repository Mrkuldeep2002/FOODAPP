import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { mockSignatureDishes, mockMenuItems, mockCategories, mockRestaurants } from '../../data/mockData';
import { SearchBar } from '../../components/common';
import { MapPin, Bell, User, Star, Heart, Clock, ArrowRight, Plus, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Restaurant, MenuItem } from '../../types';

export function CustomerHome() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'top' | 'veg' | 'fast' | 'offers'>('all');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const cartItemCount = state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  const handleAddToCart = (item: MenuItem, restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        foodItem: item,
        quantity: 1,
        customizations: [],
      },
    });

    setAddedItemIds(prev => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== item.id));
    }, 1500);
  };

  // Filter restaurants dynamically
  const filteredRestaurants = mockRestaurants.filter(r => {
    if (activeFilter === 'top') return r.rating >= 4.7;
    if (activeFilter === 'veg') return r.isPureVeg;
    if (activeFilter === 'fast') return parseInt(r.deliveryTime) <= 25;
    if (activeFilter === 'offers') return Boolean(r.offer);
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-28 font-sans">

      {/* ============================================ */}
      {/* MULTI-RESTAURANT HEADER                      */}
      {/* ============================================ */}
      <header className="px-4 pt-3 pb-2 sticky top-0 bg-bg-primary/95 backdrop-blur-md z-30">
        <div className="flex items-center justify-between mb-3">
          {/* Location Selector */}
          <button
            onClick={() => navigate('/location')}
            className="flex items-center gap-2 text-left min-w-0 flex-1 mr-2"
          >
            <div className="w-9 h-9 rounded-full bg-brand-red-light flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-brand-red" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-text-primary truncate">
                  {state.selectedLocation || 'Raja Park, Jaipur'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
              </div>
              <p className="text-[10px] text-text-secondary truncate">Delivering to your doorstep</p>
            </div>
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/customer/offers')}
              className="w-9 h-9 rounded-full bg-white border border-border/80 flex items-center justify-center text-text-primary hover:bg-bg-cream transition-colors relative shadow-card"
            >
              <Bell className="w-4 h-4 text-text-secondary" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-red text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </button>
            <button
              onClick={() => navigate('/customer/profile')}
              className="w-9 h-9 rounded-full bg-brand-red text-white font-bold text-xs flex items-center justify-center shadow-card hover:bg-brand-red-hover transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search for restaurants, biryani, pizza..."
          value={searchQuery}
          onChange={setSearchQuery}
          onFocus={() => navigate('/customer/search')}
        />
      </header>

      {/* ============================================ */}
      {/* HERO OFFER BANNER                            */}
      {/* ============================================ */}
      <section className="px-4 mt-2">
        <div className="bg-gradient-to-br from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D5] rounded-3xl p-4 sm:p-5 border border-border/60 shadow-soft relative overflow-hidden">
          <span className="font-cursive text-2xl font-bold text-brand-olive block mb-0.5">
            Today's Special Offer
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight">
            Get <span className="text-brand-red">50% OFF</span> <br />
            on Top Restaurants
          </h2>

          <p className="text-[11px] text-text-secondary mt-1">Use Code : <span className="font-bold text-brand-red">FOOD50</span></p>

          <button
            onClick={() => navigate('/customer/search')}
            className="mt-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-float flex items-center gap-1.5 transition-all"
          >
            EXPLORE RESTAURANTS <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="absolute -right-3 -bottom-3 w-36 h-36 opacity-90 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80"
              alt="Food Offer"
              className="w-full h-full object-cover rounded-tl-full shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOD CATEGORIES CAROUSEL                     */}
      {/* ============================================ */}
      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-text-primary">What are you craving?</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto scroll-hidden pb-2 -mx-4 px-4">
          {mockCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/customer/search?category=${cat.name}`)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-brand-red transition-all shadow-card bg-white p-1">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="text-[11px] font-bold text-text-secondary group-hover:text-brand-red transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* SIGNATURE TOP DISHES (Dribbble 3-Card Style) */}
      {/* ============================================ */}
      <section className="mt-7 px-4">
        <div className="text-center mb-3">
          <h2 className="font-cursive text-2.5xl font-bold text-text-primary inline-flex items-center gap-2">
            <span>🌿</span> Top Trending Dishes <span>🌿</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {mockSignatureDishes.map(dish => {
            const matchedItem = mockMenuItems.find(m => m.name.toLowerCase() === dish.name.toLowerCase()) || mockMenuItems[0];
            const matchedRestaurant = mockRestaurants.find(r => r.id === matchedItem.restaurantId) || mockRestaurants[0];
            const isAdded = addedItemIds.includes(matchedItem.id);

            return (
              <div
                key={dish.id}
                className={`${dish.bgTint} rounded-2xl p-2.5 border border-border/50 shadow-card flex flex-col justify-between transition-all hover:-translate-y-0.5`}
              >
                <div>
                  <div className="w-full h-20 rounded-xl overflow-hidden mb-2 relative">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-xs">
                      ₹{dish.price}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-text-primary line-clamp-1">{dish.name}</h3>
                  <p className="text-[9px] text-text-secondary line-clamp-1">{dish.restaurantName}</p>
                </div>

                <button
                  onClick={e => handleAddToCart(matchedItem, matchedRestaurant, e)}
                  className={`w-full text-white text-[10px] font-bold py-1.5 rounded-full transition-all mt-2 ${
                    isAdded ? 'bg-success' : 'bg-brand-red hover:bg-brand-red-hover'
                  }`}
                >
                  {isAdded ? 'ADDED ✓' : 'ORDER NOW'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* MULTI-RESTAURANTS SECTION                    */}
      {/* ============================================ */}
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-text-primary">Featured Restaurants ({filteredRestaurants.length})</h2>
          <button onClick={() => navigate('/customer/search')} className="text-xs font-bold text-brand-red hover:underline">
            View All →
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex gap-2 overflow-x-auto scroll-hidden mb-4 pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'all' ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border/80'
            }`}
          >
            All Restaurants
          </button>
          <button
            onClick={() => setActiveFilter('top')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'top' ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border/80'
            }`}
          >
            ⭐ Top Rated (4.7+)
          </button>
          <button
            onClick={() => setActiveFilter('veg')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'veg' ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border/80'
            }`}
          >
            🥬 Pure Veg
          </button>
          <button
            onClick={() => setActiveFilter('fast')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'fast' ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border/80'
            }`}
          >
            ⚡ Express (&lt;25 min)
          </button>
          <button
            onClick={() => setActiveFilter('offers')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'offers' ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border/80'
            }`}
          >
            🏷️ Offers
          </button>
        </div>

        {/* Multi-Restaurant Cards Grid */}
        <div className="space-y-4">
          {filteredRestaurants.map(restaurant => {
            const isFav = state.favoriteRestaurants.includes(restaurant.id);
            return (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-border/70 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer group"
              >
                {/* Image Header */}
                <div className="relative h-44 w-full overflow-hidden bg-bg-cream">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Offer Badge */}
                  {restaurant.offer && (
                    <div className="absolute bottom-3 left-3 bg-brand-red text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                      {restaurant.offer}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={e => handleToggleFavorite(restaurant.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-brand-red text-brand-red' : 'text-text-tertiary'}`} />
                  </button>

                  {/* Pure Veg Tag */}
                  {restaurant.isPureVeg && (
                    <div className="absolute top-3 left-3 bg-success text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      PURE VEG 🥬
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-text-primary group-hover:text-brand-red transition-colors">
                        {restaurant.name}
                      </h3>
                      {restaurant.tagline && (
                        <p className="text-xs text-text-secondary mt-0.5">{restaurant.tagline}</p>
                      )}
                    </div>

                    {/* Rating Badge */}
                    <div className="bg-success text-white text-xs font-extrabold px-2 py-1 rounded-lg flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>

                  {/* Cuisines */}
                  <p className="text-xs text-text-tertiary mt-2">
                    {restaurant.cuisine.join(' • ')}
                  </p>

                  {/* Meta Details */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-brand-red" />
                      <span>{restaurant.deliveryTime}</span>
                      <span>•</span>
                      <span>{restaurant.distance || '1.5 km'}</span>
                    </div>
                    <span className="font-extrabold text-text-primary">{restaurant.priceRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-16 left-4 right-4 max-w-lg mx-auto z-30 animate-slide-up">
          <div
            onClick={() => navigate('/customer/cart')}
            className="bg-brand-red text-white rounded-full px-5 py-3 flex items-center justify-between shadow-float cursor-pointer hover:bg-brand-red-hover transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </div>
              <span className="text-xs font-bold tracking-wide">Items in Cart ({cartItemCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold">View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
