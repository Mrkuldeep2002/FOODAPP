import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { mockRestaurants, mockMenuItems } from '../../data/mockData';
import { Rating, VegIndicator, QuantityControl, Button, BottomSheet, Card } from '../../components/common';
import { ArrowLeft, Heart, Share2, Clock, MapPin, Star, Plus, ChevronRight, Info, X } from 'lucide-react';
import { FoodItem, SelectedCustomization, CustomizationOption } from '../../types';

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [customizationQuantity, setCustomizationQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, CustomizationOption[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const restaurant = mockRestaurants.find(r => r.id === id) || mockRestaurants[0];

  const restaurantCategories = restaurant.categories && restaurant.categories.length > 0
    ? restaurant.categories
    : [{ id: 'all', name: 'Menu Specials', items: mockMenuItems.filter(i => i.restaurantId === restaurant.id) }];

  const isFavorite = state.favoriteRestaurants.includes(restaurant.id);
  const cartItemCount = state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const isCartFromThisRestaurant = state.cart?.restaurantId === restaurant.id;

  useEffect(() => {
    if (restaurantCategories.length > 0 && !activeCategory) {
      setActiveCategory(restaurantCategories[0].id);
    }
  }, [restaurantCategories, activeCategory]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = (item: FoodItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setSelectedFood(item);
      setCustomizationQuantity(1);
      setSelectedCustomizations({});
      setSpecialInstructions('');
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { foodItem: item, quantity: 1, customizations: [] },
      });
      dispatch({ type: 'SHOW_TOAST', payload: { message: `${item.name} added to cart`, type: 'success' } });
    }
  };

  const handleAddCustomizedToCart = () => {
    if (!selectedFood) return;
    const customizations: SelectedCustomization[] = Object.entries(selectedCustomizations).map(([custId, options]) => {
      const cust = selectedFood.customizations?.find(c => c.id === custId);
      return { customizationId: custId, customizationName: cust?.name || '', selectedOptions: options };
    });

    dispatch({
      type: 'ADD_TO_CART',
      payload: { foodItem: selectedFood, quantity: customizationQuantity, customizations, specialInstructions: specialInstructions || undefined },
    });
    dispatch({ type: 'SHOW_TOAST', payload: { message: `${selectedFood.name} added to cart`, type: 'success' } });
    setSelectedFood(null);
  };

  const toggleCustomizationOption = (custId: string, option: CustomizationOption, maxSelect: number) => {
    setSelectedCustomizations(prev => {
      const current = prev[custId] || [];
      const exists = current.find(o => o.id === option.id);
      if (exists) {
        return { ...prev, [custId]: current.filter(o => o.id !== option.id) };
      } else {
        if (maxSelect === 1) return { ...prev, [custId]: [option] };
        if (current.length >= maxSelect) return prev;
        return { ...prev, [custId]: [...current, option] };
      }
    });
  };

  const getCustomizationTotal = () => {
    if (!selectedFood) return 0;
    let total = selectedFood.price;
    Object.values(selectedCustomizations).forEach(options => {
      options.forEach(opt => { total += opt.price; });
    });
    return total * customizationQuantity;
  };

  return (
    <div className="pb-28 font-sans">
      {/* Restaurant Header Banner */}
      <div className="relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-52 sm:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: restaurant.id })}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-brand-red text-brand-red' : 'text-text-primary'}`} />
            </button>
            <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${restaurant.isOpen ? 'bg-success text-white' : 'bg-error text-white'}`}>
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="px-4 pt-4 pb-4 bg-white border-b border-border/80 shadow-xs">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-extrabold text-text-primary">{restaurant.name}</h1>
            <p className="text-xs text-text-secondary mt-0.5">{restaurant.cuisine.join(' • ')}</p>
          </div>
          <div className="bg-success text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-text-secondary">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-red" />{restaurant.deliveryTime}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-olive" />{restaurant.distance || '1.5 km'}</span>
          <span>{restaurant.priceRange}</span>
        </div>
        {restaurant.offer && (
          <div className="mt-3 flex items-center gap-2 bg-brand-red-light rounded-xl px-3 py-2 text-xs border border-brand-red/20">
            <span className="text-brand-red font-bold">🎉 {restaurant.offer}</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-border/80 shadow-xs overflow-x-auto scroll-hidden">
        <div className="flex px-4">
          {restaurantCategories.map(cat => (
            <button key={cat.id} onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                activeCategory === cat.id ? 'border-brand-red text-brand-red' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="px-4 pt-4">
        {restaurantCategories.map(cat => (
          <div key={cat.id} ref={el => { categoryRefs.current[cat.id] = el; }} className="mb-6">
            <h2 className="text-sm font-extrabold text-text-primary mb-3 flex items-center gap-2">
              {cat.name}
              <span className="text-xs font-normal text-text-tertiary">({cat.items.length})</span>
            </h2>
            <div className="space-y-3">
              {cat.items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-border/70 p-3 flex gap-3 hover:shadow-soft transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
                      {item.isBestseller && (
                        <span className="text-[10px] font-extrabold text-white bg-brand-red px-2 py-0.5 rounded-full">Bestseller</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-text-primary truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-extrabold text-text-primary">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-text-tertiary line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-text-secondary">{item.rating} ({item.totalRatings || 120})</span>
                      </div>
                    )}
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-1 shadow-card">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-white border-2 border-brand-red text-brand-red rounded-full px-5 py-1.5 text-xs font-extrabold hover:bg-brand-red hover:text-white transition-all -mt-4 shadow-md relative z-[1]"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar */}
      {state.cart && state.cart.items.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-30 max-w-lg mx-auto">
          <button onClick={() => navigate('/customer/cart')}
            className="w-full bg-brand-red text-white rounded-full px-5 py-3 flex items-center justify-between shadow-float hover:bg-brand-red-hover transition-all"
          >
            <span className="text-xs font-bold">
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''} | ₹{state.cart.total}
            </span>
            <span className="text-xs font-extrabold flex items-center gap-1">
              {isCartFromThisRestaurant ? 'View Cart' : `From ${state.cart.restaurantName}`} <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      )}

      {/* Food Customization Bottom Sheet */}
      <BottomSheet isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} title="Customize Your Order">
        {selectedFood && (
          <div className="p-5 font-sans">
            <div className="flex gap-3 mb-4">
              <img src={selectedFood.image} alt={selectedFood.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={selectedFood.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
                </div>
                <h3 className="text-base font-extrabold text-text-primary">{selectedFood.name}</h3>
                <p className="text-sm font-extrabold text-text-primary mt-0.5">₹{selectedFood.price}</p>
                <p className="text-xs text-text-secondary mt-1">{selectedFood.description}</p>
              </div>
            </div>

            {selectedFood.customizations?.map(cust => (
              <div key={cust.id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-extrabold text-text-primary">{cust.name}</h4>
                  {cust.required && <span className="text-[10px] font-bold text-brand-red bg-brand-red-light px-2 py-0.5 rounded-full">Required</span>}
                </div>
                <div className="space-y-2">
                  {cust.options.map(opt => {
                    const isSelected = (selectedCustomizations[cust.id] || []).find(o => o.id === opt.id);
                    return (
                      <button key={opt.id} onClick={() => toggleCustomizationOption(cust.id, opt, cust.maxSelect)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isSelected ? 'border-brand-red bg-brand-red-light' : 'border-border/80 hover:border-brand-red/30'
                        }`}
                      >
                        <span className="text-xs font-bold text-text-primary">{opt.name}</span>
                        <span className="text-xs font-medium text-text-secondary">{opt.price > 0 ? `+₹${opt.price}` : 'Free'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t border-border/80">
              <QuantityControl quantity={customizationQuantity} onChange={setCustomizationQuantity} min={1} />
              <Button onClick={handleAddCustomizedToCart} size="lg">
                Add — ₹{getCustomizationTotal()}
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
