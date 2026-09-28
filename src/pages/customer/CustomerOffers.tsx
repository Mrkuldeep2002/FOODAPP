import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { mockCoupons, mockWhyChooseUs } from '../../data/mockData';
import { ArrowLeft, Tag, Copy, Check, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

export function CustomerOffers() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount: 50 } });
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const iconsMap: Record<string, any> = {
    '1': Truck,
    '2': ShieldCheck,
    '3': RefreshCw,
    '4': Headphones,
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-28 font-sans">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-border/80 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <button onClick={() => navigate('/customer')} className="p-1.5 rounded-full hover:bg-bg-cream">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <h1 className="text-base font-extrabold text-text-primary tracking-tight">Offers</h1>
        <div className="w-8" />
      </header>

      <div className="px-4 pt-4 space-y-6">
        {/* Today's Special Offer Banner (Matching Screen 3 Dribbble) */}
        <div className="bg-[#FAF6F0] rounded-3xl p-5 border border-border/70 shadow-soft relative overflow-hidden">
          <span className="font-cursive text-2xl font-bold text-brand-olive leading-none block mb-1">
            Today's Special Offer
          </span>

          <h2 className="text-2xl font-black text-text-primary leading-snug">
            Get <span className="text-brand-red">20% OFF</span> <br />
            on all orders
          </h2>

          {/* Code Dashed Pill Box */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-dashed border-brand-olive/80">
            <span className="text-xs font-bold text-text-primary">Use Code :</span>
            <span className="text-xs font-black text-brand-red tracking-wider">BIRI20</span>
            <button
              onClick={() => handleCopy('BIRI20')}
              className="ml-1 text-[10px] font-bold text-brand-olive hover:underline flex items-center gap-1"
            >
              {copiedCode === 'BIRI20' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              {copiedCode === 'BIRI20' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Circular 20% OFF Badge */}
          <div className="absolute top-3 right-3 w-12 h-12 bg-brand-red text-white rounded-full flex flex-col items-center justify-center font-extrabold text-[10px] shadow-md border-2 border-white">
            <span>20%</span>
            <span className="text-[8px] font-bold">OFF</span>
          </div>

          {/* Dish Photo */}
          <div className="mt-4 w-full h-36 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
              alt="Special Offer Dish"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us Grid (Matching Screen 3 Dribbble) */}
        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-3">Why Choose Us</h2>
          <div className="grid grid-cols-4 gap-2">
            {mockWhyChooseUs.map(item => {
              const IconComp = iconsMap[item.id] || Truck;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-2.5 border border-border/60 text-center flex flex-col items-center justify-center shadow-card"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-olive-light flex items-center justify-center text-brand-olive mb-1.5">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-[11px] font-bold text-text-primary leading-tight">{item.title}</h3>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-tight">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Available Coupons */}
        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-3">All Available Coupons</h2>
          <div className="space-y-3">
            {mockCoupons.map(coupon => (
              <div
                key={coupon.code}
                className="bg-white rounded-2xl p-4 border border-border/80 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-brand-red uppercase">{coupon.code}</span>
                    <p className="text-xs font-semibold text-text-primary">{coupon.description}</p>
                    <p className="text-[10px] text-text-tertiary">Min Order: ₹{coupon.minOrderAmount}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="bg-brand-red text-white text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-brand-red-hover transition-colors"
                >
                  {copiedCode === coupon.code ? 'Applied!' : 'APPLY'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
