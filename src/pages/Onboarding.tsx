import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Search, Navigation, MapPin, Clock, X, ChevronRight } from 'lucide-react';

// ============================================
// Splash Screen
// ============================================
export function SplashScreen() {
  const navigate = useNavigate();
  const { state } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.hasCompletedOnboarding && state.selectedLocation) {
        navigate('/customer');
      } else {
        navigate('/location');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate, state.hasCompletedOnboarding, state.selectedLocation]);

  return (
    <div className="fixed inset-0 bg-bg-primary flex flex-col items-center justify-center animate-fade-in font-sans">
      {/* Logo */}
      <div className="mb-6 animate-fade-in-up text-center" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center shadow-float mb-4 mx-auto text-white">
          <span className="text-4xl font-black">❖</span>
        </div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">
          Rasa<span className="text-brand-red">Flow</span>
        </h1>
        <p className="text-xs font-bold text-text-secondary tracking-widest uppercase mt-1">
          Good Food. Good Mood.
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Location Selection
// ============================================
export function LocationSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const savedLocations = [
    { id: 'loc-1', name: 'Raja Park', address: 'Raja Park, Jaipur, Rajasthan' },
    { id: 'loc-2', name: 'C-Scheme', address: 'C-Scheme, Jaipur, Rajasthan' },
  ];

  const searchResults = [
    { id: 'loc-3', name: 'Malviya Nagar', address: 'Malviya Nagar, Jaipur, Rajasthan' },
    { id: 'loc-4', name: 'Vaishali Nagar', address: 'Vaishali Nagar, Jaipur, Rajasthan' },
    { id: 'loc-5', name: 'Mansarovar', address: 'Mansarovar, Jaipur, Rajasthan' },
    { id: 'loc-6', name: 'Tonk Road', address: 'Tonk Road, Jaipur, Rajasthan' },
    { id: 'loc-7', name: 'Sodala', address: 'Sodala, Jaipur, Rajasthan' },
    { id: 'loc-8', name: 'Jagatpura', address: 'Jagatpura, Jaipur, Rajasthan' },
  ].filter(l => searchQuery ? l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.address.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const selectLocation = (name: string) => {
    dispatch({ type: 'SET_LOCATION', payload: name });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate('/customer');
  };

  const useCurrentLocation = () => {
    selectLocation('Raja Park, Jaipur');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary max-w-lg mx-auto flex flex-col font-sans px-5 py-6">

      {/* Brand Header */}
      <header className="flex items-center justify-between mb-8 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-sm">
            <span className="text-xl font-black">❖</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-text-primary uppercase leading-tight">
              Rasa<span className="text-brand-red">Flow</span>
            </h1>
            <p className="text-[9px] font-bold text-text-secondary tracking-widest uppercase">
              FOOD DELIVERY PLATFORM
            </p>
          </div>
        </div>

        <button
          onClick={() => selectLocation('Jaipur')}
          className="text-xs font-bold text-brand-red hover:underline"
        >
          Skip →
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h2 className="text-2xl font-black text-text-primary leading-snug tracking-tight mb-1">
          Where are you <br />
          <span className="text-brand-red">ordering from?</span>
        </h2>
        <p className="text-xs text-text-secondary mb-6">
          We'll show top restaurants and express delivery near you.
        </p>

        {/* Current Location Button Card */}
        <button
          onClick={useCurrentLocation}
          className="w-full bg-brand-red-light border border-brand-red/30 rounded-3xl p-4 flex items-center gap-3.5 hover:bg-brand-red-light/80 transition-all shadow-card group text-left mb-5"
        >
          <div className="w-11 h-11 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-brand-red">Use Current Location</h3>
            <p className="text-[11px] text-text-secondary truncate mt-0.5">Using GPS • Fast & Precise</p>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-red flex-shrink-0" />
        </button>

        {/* Search Input Box */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search for area, street, city..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="w-full bg-white border border-border/80 rounded-2xl pl-11 pr-10 py-3.5 text-xs font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 shadow-card transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearch(false); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-tertiary hover:bg-bg-cream"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results or Recent Locations */}
        {showSearch && searchQuery ? (
          <div className="animate-fade-in space-y-3">
            <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">Search Results</p>
            <div className="space-y-2">
              {searchResults.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => selectLocation(loc.name + ', Jaipur')}
                  className="w-full bg-white border border-border/70 rounded-2xl p-3.5 flex items-center gap-3 hover:border-brand-red hover:shadow-card transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-bg-cream text-text-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-text-primary truncate">{loc.name}</h4>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Recent Locations */}
            <div>
              <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider mb-2.5">Recent Locations</p>
              <div className="space-y-2">
                {savedLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => selectLocation(loc.name + ', Jaipur')}
                    className="w-full bg-white border border-border/70 rounded-2xl p-3.5 flex items-center gap-3 hover:border-brand-red hover:shadow-card transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-olive-light text-brand-olive flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-text-primary truncate">{loc.name}</h4>
                      <p className="text-[10px] text-text-secondary truncate mt-0.5">{loc.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Cities */}
            <div>
              <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider mb-2.5">Popular Cities</p>
              <div className="grid grid-cols-3 gap-2">
                {['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'].map(city => (
                  <button
                    key={city}
                    onClick={() => selectLocation(city)}
                    className="py-2.5 px-3 bg-white border border-border/80 rounded-2xl text-xs font-bold text-text-primary hover:border-brand-red hover:text-brand-red transition-all text-center shadow-xs"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
