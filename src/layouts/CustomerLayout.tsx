import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Home, UtensilsCrossed, Tag, ShoppingBag, User } from 'lucide-react';

export function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();

  const cartItemCount = state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navItems = [
    { path: '/customer', label: 'Home', icon: Home },
    { path: '/customer/menu', label: 'Menu', icon: UtensilsCrossed },
    { path: '/customer/offers', label: 'Offers', icon: Tag },
    { path: '/customer/cart', label: 'Cart', icon: ShoppingBag, badge: cartItemCount },
    { path: '/customer/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/customer') return location.pathname === '/customer';
    return location.pathname.startsWith(path);
  };

  const hideBottomNav = location.pathname.includes('/order-confirmed') ||
    location.pathname.includes('/checkout');

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-bg-primary relative pb-20 font-sans">
      <Outlet />

      {/* Dribbble Style Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/80 shadow-soft z-40 max-w-lg mx-auto pb-safe">
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center py-1 transition-all relative ${
                    active ? 'text-brand-red font-semibold' : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                    {item.badge ? (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-brand-red text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className={`text-[11px] mt-1 tracking-tight ${active ? 'font-bold text-brand-red' : 'font-medium text-text-secondary'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
