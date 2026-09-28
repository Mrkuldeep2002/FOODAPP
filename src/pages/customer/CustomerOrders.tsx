import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button, Tabs, StatusBadge, Card, EmptyState, OrderTimeline } from '../../components/common';
import { ArrowLeft, Package, Clock, Phone, MessageCircle, MapPin, Navigation } from 'lucide-react';
import { Order } from '../../types';

// ============================================
// Orders List
// ============================================
export function CustomerOrders() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = state.orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = state.orders.filter(o => o.status === 'delivered');
  const cancelledOrders = state.orders.filter(o => o.status === 'cancelled');

  const currentOrders = activeTab === 'active' ? activeOrders : activeTab === 'completed' ? completedOrders : cancelledOrders;

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-10 px-4 pt-3 border-b border-border-light">
        <h1 className="text-lg font-bold mb-3">My Orders</h1>
        <Tabs
          tabs={[
            { id: 'active', label: 'Active', count: activeOrders.length },
            { id: 'completed', label: 'Completed', count: completedOrders.length },
            { id: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="px-4 pt-4 space-y-3">
        {currentOrders.length === 0 ? (
          <EmptyState
            icon={<Package className="w-16 h-16" />}
            title={activeTab === 'active' ? 'No active orders' : activeTab === 'completed' ? 'No completed orders yet' : 'No cancelled orders'}
            description="Your orders will appear here"
            action={<Button onClick={() => navigate('/customer')}>Order Now</Button>}
          />
        ) : (
          currentOrders.map(order => (
            <Card key={order.id} onClick={() => navigate(`/customer/orders/${order.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-text-primary">{order.restaurantName}</p>
                  <p className="text-xs text-text-secondary">{order.orderNumber}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-text-secondary mb-2">
                <span>{order.items.length} items</span>
                <span>•</span>
                <span>₹{order.total}</span>
                <span>•</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-xs bg-bg-cream px-2 py-0.5 rounded-full text-text-secondary">{item.name}</span>
                ))}
                {order.items.length > 3 && <span className="text-xs bg-bg-cream px-2 py-0.5 rounded-full text-text-secondary">+{order.items.length - 3} more</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); navigate(`/customer/orders/${order.id}`); }}>
                  {order.status === 'delivered' ? 'View Order' : 'Track Order'}
                </Button>
                {order.status === 'delivered' && (
                  <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); navigate(`/customer/restaurants/${order.restaurantId}`); }}>Reorder</Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// Order Tracking
// ============================================
export function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [order, setOrder] = useState<Order | undefined>(state.orders.find(o => o.id === id));

  // Simulate order progress
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const statusFlow: Order['status'][] = ['placed', 'confirmed', 'preparing', 'ready', 'rider_assigned', 'picked_up', 'on_the_way', 'delivered'];
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx < statusFlow.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusFlow[currentIdx + 1];
        const newTimeline = order.statusTimeline.map(step => {
          if (step.status === order.status) return { ...step, isActive: false, isCompleted: true, time: step.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          if (step.status === nextStatus) return { ...step, isActive: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          return step;
        });
        setOrder(prev => prev ? { ...prev, status: nextStatus, statusTimeline: newTimeline } : prev);
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: id!, status: nextStatus } });
      }, 8000 + Math.random() * 7000);
      return () => clearTimeout(timer);
    }
  }, [order?.status]);

  if (!order) {
    return <div className="p-8 text-center"><EmptyState title="Order not found" action={<Button onClick={() => navigate('/customer/orders')}>View Orders</Button>} /></div>;
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="text-base font-bold">Order #{order.orderNumber}</h1>
          <p className="text-xs text-text-secondary">{order.restaurantName}</p>
        </div>
        <StatusBadge status={order.status} size="md" />
      </div>

      {/* Mock Map */}
      {!['delivered', 'cancelled'].includes(order.status) && (
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-border-light bg-bg-cream h-48 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-40 h-24">
                {/* Simple mock map with markers */}
                <div className="absolute top-2 left-4 flex flex-col items-center">
                  <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center text-white text-[10px] shadow-md">🏪</div>
                  <div className="w-0.5 h-3 bg-brand-orange/40" />
                  <span className="text-[9px] text-text-secondary">Restaurant</span>
                </div>
                <svg className="absolute top-4 left-12 right-12 w-20" viewBox="0 0 100 20">
                  <path d="M5 10 Q50 -5 95 10" stroke="#D92720" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                </svg>
                {['on_the_way', 'picked_up', 'rider_assigned'].includes(order.status) && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
                    <div className="w-7 h-7 bg-brand-red rounded-full flex items-center justify-center text-white text-xs shadow-lg">🏍️</div>
                  </div>
                )}
                <div className="absolute top-2 right-4 flex flex-col items-center">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-[10px] shadow-md">📍</div>
                  <div className="w-0.5 h-3 bg-success/40" />
                  <span className="text-[9px] text-text-secondary">You</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1.5 text-xs">
            <Clock className="w-3 h-3 text-brand-red" />
            <span className="font-bold text-text-primary">ETA: {order.estimatedDelivery}</span>
          </div>
        </div>
      )}

      <div className="px-4 pt-4 space-y-3">
        {/* Timeline */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-4">Order Status</h3>
          <OrderTimeline timeline={order.statusTimeline} />
        </Card>

        {/* Delivery Partner */}
        {order.deliveryPartnerName && !['delivered', 'cancelled', 'placed', 'confirmed', 'preparing'].includes(order.status) && (
          <Card>
            <h3 className="text-sm font-bold text-text-primary mb-3">Delivery Partner</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-olive-light rounded-full flex items-center justify-center text-brand-olive font-bold">
                  {order.deliveryPartnerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{order.deliveryPartnerName}</p>
                  <p className="text-xs text-text-secondary">{order.deliveryPartnerPhone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 bg-success/10 rounded-full flex items-center justify-center text-success"><Phone className="w-4 h-4" /></button>
                <button className="w-9 h-9 bg-brand-red-light rounded-full flex items-center justify-center text-brand-red"><MessageCircle className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        )}

        {/* OTP */}
        {order.otp && ['on_the_way', 'picked_up'].includes(order.status) && (
          <Card className="bg-warning-light border-warning/20">
            <p className="text-xs text-text-secondary text-center">Share this OTP with delivery partner</p>
            <p className="text-3xl font-black text-text-primary text-center mt-1 tracking-[0.3em]">{order.otp}</p>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-3">Order Details</h3>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 border rounded-sm flex items-center justify-center ${item.isVeg ? 'border-success' : 'border-brand-red'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-success' : 'bg-brand-red'}`} />
                  </span>
                  <span className="text-text-primary">{item.name} × {item.quantity}</span>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border-light flex justify-between font-bold">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-text-primary">Delivery Address</p>
              <p className="text-xs text-text-secondary mt-0.5">{order.customerAddress}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
