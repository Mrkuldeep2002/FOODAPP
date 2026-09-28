import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button, Input, Card, Select } from '../../components/common';
import { ArrowLeft, MapPin, CreditCard, Wallet, Banknote, Smartphone, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

export function CustomerCheckout() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedAddress, setSelectedAddress] = useState(state.addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const { cart } = state;
  if (!cart) { navigate('/customer/cart'); return null; }

  const address = state.addresses.find(a => a.id === selectedAddress);

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-new-${Date.now()}`,
        orderNumber: `RF-${10000 + Math.floor(Math.random() * 90000)}`,
        customerId: 'cust-1',
        customerName: state.userName,
        customerPhone: state.userPhone,
        customerAddress: address?.address || 'Raja Park, Jaipur',
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        restaurantImage: '',
        items: cart.items.map(item => ({
          foodItemId: item.foodItem.id, name: item.foodItem.name, price: item.foodItem.price,
          quantity: item.quantity, image: item.foodItem.image, isVeg: item.foodItem.isVeg,
          customizations: item.selectedCustomizations.map(c => c.selectedOptions.map(o => o.name).join(', ')).join(' | '),
        })),
        subtotal: cart.subtotal, deliveryFee: cart.deliveryFee, platformFee: cart.platformFee,
        taxes: cart.taxes, discount: cart.discount, total: cart.total,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wallet',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'placed',
        statusTimeline: [
          { status: 'placed', label: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isCompleted: false, isActive: true },
          { status: 'confirmed', label: 'Restaurant Accepted', isCompleted: false, isActive: false },
          { status: 'preparing', label: 'Preparing', isCompleted: false, isActive: false },
          { status: 'ready', label: 'Ready for Pickup', isCompleted: false, isActive: false },
          { status: 'rider_assigned', label: 'Rider Assigned', isCompleted: false, isActive: false },
          { status: 'picked_up', label: 'Picked Up', isCompleted: false, isActive: false },
          { status: 'on_the_way', label: 'Out for Delivery', isCompleted: false, isActive: false },
          { status: 'delivered', label: 'Delivered', isCompleted: false, isActive: false },
        ],
        estimatedDelivery: (() => { const d = new Date(); d.setMinutes(d.getMinutes() + 40); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); })(),
        deliveryInstructions: deliveryInstructions || undefined,
        couponCode: cart.couponCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        otp: String(Math.floor(1000 + Math.random() * 9000)),
      };
      dispatch({ type: 'PLACE_ORDER', payload: newOrder });
      navigate(`/customer/order-confirmed/${newOrder.id}`);
    }, 1500);
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-5 h-5" />, desc: 'Pay using any UPI app' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5" />, desc: 'Visa, Mastercard, RuPay' },
    { id: 'cod', name: 'Cash on Delivery', icon: <Banknote className="w-5 h-5" />, desc: 'Pay when food arrives' },
    { id: 'wallet', name: 'RasaFlow Wallet', icon: <Wallet className="w-5 h-5" />, desc: 'Balance: ₹240' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-32">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Checkout</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Delivery Address */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-red" /> Delivery Address</h3>
          <div className="space-y-2">
            {state.addresses.map(addr => (
              <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${selectedAddress === addr.id ? 'border-brand-red bg-brand-red-light' : 'border-border hover:border-brand-red/30'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedAddress === addr.id ? 'border-brand-red' : 'border-border'}`}>
                  {selectedAddress === addr.id && <div className="w-3 h-3 rounded-full bg-brand-red" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{addr.label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{addr.address}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Delivery Instructions */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-2">Delivery Instructions</h3>
          <textarea value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
            placeholder="E.g., Leave at door, call when near..."
            className="w-full bg-bg-cream border border-border rounded-xl px-3 py-2.5 text-sm resize-none h-16 focus:outline-none focus:border-brand-red"
          />
        </Card>

        {/* Payment Method */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-brand-red" /> Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map(pm => (
              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === pm.id ? 'border-brand-red bg-brand-red-light' : 'border-border hover:border-brand-red/30'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === pm.id ? 'bg-brand-red text-white' : 'bg-bg-cream text-text-secondary'}`}>
                  {pm.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-text-primary">{pm.name}</p>
                  <p className="text-xs text-text-secondary">{pm.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-brand-red' : 'border-border'}`}>
                  {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-brand-red" />}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Order Summary */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-3">Order Summary</h3>
          <div className="space-y-2">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-text-secondary">{item.foodItem.name} × {item.quantity}</span>
                <span className="font-medium">₹{item.totalPrice}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border-light space-y-1">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Subtotal</span><span>₹{cart.subtotal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Delivery</span><span className={cart.deliveryFee === 0 ? 'text-success font-medium' : ''}>{cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Platform Fee</span><span>₹{cart.platformFee}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Taxes</span><span>₹{cart.taxes}</span></div>
              {cart.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Discount</span><span>-₹{cart.discount}</span></div>}
            </div>
            <div className="flex justify-between pt-2 border-t border-border-light">
              <span className="font-bold text-text-primary">Total</span>
              <span className="font-bold text-lg">₹{cart.total}</span>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2 text-xs text-text-secondary px-2">
          <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>

      {/* Place Order */}
      <div className="fixed bottom-16 left-0 right-0 z-30 p-4 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent md:max-w-lg md:mx-auto">
        <Button fullWidth size="lg" loading={isPlacing} onClick={handlePlaceOrder}>
          {isPlacing ? 'Placing Order...' : `Place Order — ₹${cart.total}`}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Order Confirmation
// ============================================
export function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useApp();
  const orderId = window.location.pathname.split('/').pop();
  const order = state.orders.find(o => o.id === orderId);

  if (!order) {
    navigate('/customer/orders');
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>Order Confirmed!</h1>
        <p className="text-text-secondary">Your order has been placed successfully</p>
      </div>

      <Card className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' } as any}>
        <div className="text-center pb-3 border-b border-border-light mb-3">
          <p className="text-xs text-text-secondary">Order ID</p>
          <p className="text-lg font-bold text-text-primary">{order.orderNumber}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Restaurant</span><span className="font-medium">{order.restaurantName}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Items</span><span className="font-medium">{order.items.length} items</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Total</span><span className="font-bold text-base">₹{order.total}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Estimated Delivery</span><span className="font-medium text-success">{order.estimatedDelivery}</span></div>
        </div>
      </Card>

      <div className="mt-8 space-y-3 w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' } as any}>
        <Button fullWidth size="lg" onClick={() => navigate(`/customer/orders/${order.id}`)}>
          Track Order
        </Button>
        <Button fullWidth size="lg" variant="outline" onClick={() => navigate('/customer')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
