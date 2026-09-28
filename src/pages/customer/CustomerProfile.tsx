import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button, Card, Input, Toggle, Modal } from '../../components/common';
import { ArrowLeft, ChevronRight, User, MapPin, Heart, CreditCard, Package, Bell, HelpCircle, Settings, LogOut, Plus, Trash2, Edit, Phone, Mail } from 'lucide-react';

export function CustomerProfile() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: 'My Orders', path: '/customer/orders', color: 'text-brand-red' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Saved Addresses', path: '/customer/addresses', color: 'text-brand-orange' },
    { icon: <Heart className="w-5 h-5" />, label: 'Favourites', path: '/customer/favorites', color: 'text-error' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', color: 'text-success' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', color: 'text-warning' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', color: 'text-brand-olive' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/customer/settings', color: 'text-text-secondary' },
  ];

  const handleLogin = () => {
    if (!otpSent) {
      setOtpSent(true);
    } else {
      dispatch({ type: 'LOGIN', payload: { role: 'customer', name: 'Rahul Sharma' } });
      setShowLogin(false);
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Logged in successfully!', type: 'success' } });
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-border-light">
        {state.isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {state.userName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{state.userName}</h2>
              <p className="text-sm text-text-secondary">{state.userPhone}</p>
              <button className="text-xs text-brand-red font-medium mt-0.5">Edit Profile</button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-1">Your Profile</h2>
            <p className="text-sm text-text-secondary mb-3">Login to access your orders, addresses, and more</p>
            <Button onClick={() => setShowLogin(true)}>Login / Sign Up</Button>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-1">
        {menuItems.map((item, i) => (
          <button key={i}
            onClick={() => item.path ? navigate(item.path) : dispatch({ type: 'SHOW_TOAST', payload: { message: 'Coming soon!', type: 'info' } })}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-bg-cream transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl bg-bg-cream flex items-center justify-center ${item.color}`}>{item.icon}</div>
            <span className="flex-1 text-sm font-medium text-text-primary text-left">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
        ))}

        {/* Role Switcher for demo */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-2">Demo: Switch Role</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/restaurant')} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-brand-red transition-colors">🏪 Restaurant</button>
            <button onClick={() => navigate('/delivery')} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-brand-red transition-colors">🏍️ Delivery</button>
            <button onClick={() => navigate('/admin')} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-brand-red transition-colors">👨‍💼 Admin</button>
            <button onClick={() => { dispatch({ type: 'LOGOUT' }); navigate('/'); }} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-error text-error transition-colors">🚪 Logout</button>
          </div>
        </div>

        {/* Partner Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-2">Partner With Us</p>
          <Link to="/restaurant/register" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-bg-cream transition-colors">
            <span className="text-2xl">🏪</span>
            <div className="flex-1"><p className="text-sm font-medium text-text-primary">Register Your Restaurant</p><p className="text-xs text-text-secondary">Grow your business with RasaFlow</p></div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </Link>
          <Link to="/delivery/register" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-bg-cream transition-colors">
            <span className="text-2xl">🏍️</span>
            <div className="flex-1"><p className="text-sm font-medium text-text-primary">Become a Delivery Partner</p><p className="text-xs text-text-secondary">Earn by delivering great food</p></div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={() => { setShowLogin(false); setOtpSent(false); }} title="Login to RasaFlow" size="sm">
        <div className="p-5">
          {!otpSent ? (
            <>
              <p className="text-sm text-text-secondary mb-4">Enter your phone number to continue</p>
              <Input label="Phone Number" placeholder="+91 98765 43210" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} icon={<Phone className="w-4 h-4" />} />
              <Button fullWidth className="mt-4" onClick={handleLogin} disabled={phoneInput.length < 5}>Send OTP</Button>
              <div className="mt-4 flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-xs text-text-secondary">or</span><div className="flex-1 h-px bg-border" /></div>
              <button onClick={() => { dispatch({ type: 'LOGIN', payload: { role: 'customer' } }); setShowLogin(false); }}
                className="w-full mt-4 flex items-center justify-center gap-2 p-3 border border-border rounded-xl hover:bg-bg-cream transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-4">Enter the OTP sent to {phoneInput || '+91 98765 43210'}</p>
              <Input label="OTP" placeholder="Enter 4-digit OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} maxLength={4} />
              <p className="text-xs text-text-secondary mt-2">Demo: Enter any 4 digits</p>
              <Button fullWidth className="mt-4" onClick={handleLogin} disabled={otpInput.length < 4}>Verify OTP</Button>
              <button onClick={() => setOtpSent(false)} className="w-full mt-3 text-sm text-brand-red font-medium">Change Number</button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// Favorites
// ============================================
export function CustomerFavorites() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const favRestaurants = restaurants.filter(r => state.favoriteRestaurants.includes(r.id));

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Favourites</h1>
      </div>
      <div className="px-4 pt-4">
        {favRestaurants.length === 0 ? (
          <EmptyState icon={<Heart className="w-16 h-16" />} title="No favourites yet" description="Save your favourite restaurants for quick access" action={<Button onClick={() => navigate('/customer/restaurants')}>Explore Restaurants</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favRestaurants.map(r => (
              <Card key={r.id} onClick={() => navigate(`/customer/restaurants/${r.id}`)} padding={false}>
                <img src={r.image} alt={r.name} className="w-full h-36 object-cover rounded-t-2xl" />
                <div className="p-3">
                  <h3 className="text-sm font-bold">{r.name}</h3>
                  <p className="text-xs text-text-secondary">{r.cuisine.join(' • ')}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Need to import restaurants and EmptyState
import { restaurants } from '../../data/mockData';
import { EmptyState } from '../../components/common';
