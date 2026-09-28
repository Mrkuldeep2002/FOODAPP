import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { mockCategories, mockMenuItems, mockRestaurants } from '../../data/mockData';
import { ArrowLeft, Search, Plus, Check } from 'lucide-react';
import { MenuItem } from '../../types';

export function CustomerMenu() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [activeCategory, setActiveCategory] = useState('biryani');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const handleAddToCart = (item: MenuItem) => {
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

  const filteredMenuItems = mockMenuItems.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-28 font-sans">
      {/* Header (Matching Screen 2) */}
      <header className="px-4 py-3 bg-white border-b border-border/80 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <button onClick={() => navigate('/customer')} className="p-1.5 rounded-full hover:bg-bg-cream">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <h1 className="text-base font-extrabold text-text-primary tracking-tight">Menu</h1>
        <button onClick={() => navigate('/customer/search')} className="p-1.5 rounded-full hover:bg-bg-cream">
          <Search className="w-5 h-5 text-text-primary" />
        </button>
      </header>

      {/* Category Pills (Matching Screen 2) */}
      <div className="px-4 pt-4 pb-2 bg-bg-primary sticky top-[53px] z-20">
        <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1">
          {mockCategories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'bg-white text-text-secondary border border-border/80 hover:border-brand-red'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-3 mt-3">
        {filteredMenuItems.map(item => {
          const isAdded = addedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 border border-border/70 shadow-card flex gap-3 items-center hover:shadow-soft transition-all"
            >
              {/* Circular Food Image */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.isBestseller && (
                  <span className="absolute top-1.5 left-1.5 bg-brand-red text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
                  <h3 className="text-sm font-bold text-text-primary truncate">{item.name}</h3>
                </div>

                <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-text-primary">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs line-through text-text-tertiary">₹{item.originalPrice}</span>
                    )}
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-1">
                      ★ {item.rating}
                    </span>
                  </div>

                  {/* Circular Plus Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isAdded
                        ? 'bg-success text-white scale-110'
                        : item.isVeg
                        ? 'bg-brand-olive hover:opacity-90 text-white shadow-sm'
                        : 'bg-brand-red hover:bg-brand-red-hover text-white shadow-sm'
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
