import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { EmptyState } from '../../components/common';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket, X } from 'lucide-react';
import { mockCoupons } from '../../data/mockData';

export function CustomerCart() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const { cart } = state;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary font-sans">
        <header className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b border-border/80">
          <button onClick={() => navigate('/customer')} className="p-1.5 rounded-full hover:bg-bg-cream">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-text-primary">Your Cart</h1>
          <div className="w-8" />
        </header>

        <EmptyState
          icon={<ShoppingBag className="w-16 h-16 text-brand-red/60" />}
          title="Your cart is waiting for something delicious"
          description="Browse authentic biryanis and signature dishes to get started"
          action={
            <button
              onClick={() => navigate('/customer')}
              className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-float"
            >
              Explore Signature Dishes
            </button>
          }
        />
      </div>
    );
  }

  const handleApplyCoupon = (code: string) => {
    const coupon = mockCoupons.find(c => c.code === code);
    if (coupon) {
      let discount = coupon.discountAmount || 0;
      if (coupon.discountPercentage) {
        discount = Math.min(Math.round(cart.subtotal * coupon.discountPercentage / 100), coupon.maxDiscount || 100);
      }
      const minAmt = coupon.minOrderAmount || coupon.minOrder || 0;
      if (cart.subtotal >= minAmt) {
        dispatch({ type: 'APPLY_COUPON', payload: { code, discount } });
        dispatch({ type: 'SHOW_TOAST', payload: { message: `Coupon applied! You save ₹${discount}`, type: 'success' } });
        setShowCoupons(false);
      } else {
        dispatch({ type: 'SHOW_TOAST', payload: { message: `Minimum order ₹${minAmt} required`, type: 'error' } });
      }
    } else {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Invalid coupon code', type: 'error' } });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-36 font-sans">
      {/* Header (Matching Screen 3 Dribbble) */}
      <header className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b border-border/80 shadow-xs">
        <button onClick={() => navigate('/customer')} className="p-1.5 rounded-full hover:bg-bg-cream">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <h1 className="text-base font-extrabold text-text-primary">Your Cart</h1>
        <button
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
          className="text-xs font-bold text-brand-red hover:underline"
        >
          Edit
        </button>
      </header>

      <div className="px-4 pt-4 space-y-4">

        {/* Cart Items List (Matching Screen 3 Dribbble) */}
        <div className="bg-white rounded-3xl p-4 border border-border/70 shadow-card space-y-4">
          {cart.items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 ${i > 0 ? 'pt-4 border-t border-border/50' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text-primary truncate">{item.foodItem.name}</h3>
                  <p className="text-sm font-extrabold text-text-primary mt-0.5">₹{item.totalPrice}</p>
                </div>
              </div>

              {/* Action & Quantity Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                  className="w-8 h-8 rounded-full border border-brand-red/30 text-brand-red flex items-center justify-center hover:bg-brand-red-light transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 bg-bg-cream/70 px-2 py-1 rounded-full border border-border/60">
                  <button
                    onClick={() => dispatch({
                      type: 'UPDATE_CART_QUANTITY',
                      payload: { cartItemId: item.id, quantity: Math.max(0, item.quantity - 1) }
                    })}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black text-text-primary w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({
                      type: 'UPDATE_CART_QUANTITY',
                      payload: { cartItemId: item.id, quantity: item.quantity + 1 }
                    })}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="bg-white rounded-2xl p-3.5 border border-border/70 shadow-card">
          {cart.couponCode ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-red" />
                <div>
                  <p className="text-xs font-extrabold text-brand-red">{cart.couponCode} Applied</p>
                  <p className="text-[10px] text-text-secondary">You save ₹{cart.discount}</p>
                </div>
              </div>
              <button onClick={() => dispatch({ type: 'REMOVE_COUPON' })} className="text-xs text-text-tertiary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowCoupons(true)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-bold text-text-primary">Apply Coupon Code (BIRI20)</span>
              </div>
              <span className="text-xs font-bold text-brand-red">Select →</span>
            </button>
          )}
        </div>

        {/* Bill Summary (Matching Screen 3 Dribbble) */}
        <div className="bg-white rounded-3xl p-4 border border-border/70 shadow-card space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary font-medium">Subtotal</span>
            <span className="font-extrabold text-text-primary">₹{cart.subtotal}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary font-medium">Delivery Fee</span>
            <div className="flex items-center gap-1">
              <span className="text-text-tertiary line-through">₹40</span>
              <span className="font-bold text-success">FREE</span>
            </div>
          </div>
          {cart.discount > 0 && (
            <div className="flex justify-between text-xs text-brand-red">
              <span className="font-medium">Coupon Discount</span>
              <span className="font-extrabold">-₹{cart.discount}</span>
            </div>
          )}

          <div className="pt-2 border-t border-border/60 flex justify-between items-center">
            <span className="text-sm font-extrabold text-text-primary">Total</span>
            <span className="text-xl font-black text-brand-red">₹{cart.total}</span>
          </div>
        </div>

      </div>

      {/* Coupon Modal */}
      {showCoupons && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={() => setShowCoupons(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 animate-slide-up space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-text-primary">Coupons & Offers</h3>
              <button onClick={() => setShowCoupons(false)}><X className="w-5 h-5 text-text-tertiary" /></button>
            </div>

            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter BIRI20"
                className="flex-1 bg-bg-primary border border-border/80 rounded-full px-4 py-2 text-xs font-bold uppercase"
              />
              <button
                onClick={() => handleApplyCoupon(couponInput)}
                className="bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-full"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2">
              {mockCoupons.map(coupon => (
                <div key={coupon.code} className="border border-border/80 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-brand-red">{coupon.code}</span>
                    <p className="text-[11px] text-text-secondary">{coupon.description}</p>
                  </div>
                  <button
                    onClick={() => handleApplyCoupon(coupon.code)}
                    className="text-xs font-bold text-brand-red border border-brand-red/40 px-3 py-1 rounded-full hover:bg-brand-red-light"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Full-width Red Action Button (Matching Screen 3 Dribbble) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 p-4 max-w-lg mx-auto bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent">
        <button
          onClick={() => navigate('/customer/checkout')}
          className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black py-4 rounded-full shadow-float flex items-center justify-center gap-2 tracking-wide transition-all active:scale-[0.98]"
        >
          PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
