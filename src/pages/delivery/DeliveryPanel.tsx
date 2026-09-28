import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { mockDeliveryPartners, mockDeliveryRequests, mockEarnings, mockOrders, revenueChartData } from '../../data/mockData';
import { Button, Card, StatCard, StatusBadge, Toggle, EmptyState, OrderTimeline, Input, Select } from '../../components/common';
import { Home, Package, DollarSign, User, MapPin, Phone, MessageCircle, Navigation, Clock, Check, X, ArrowLeft, ChevronRight, Bike, Shield, Wallet, History, Power } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================
// Delivery Layout
// ============================================
export function DeliveryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const partner = mockDeliveryPartners[0];

  const navItems = [
    { path: '/delivery', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/delivery/orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
    { path: '/delivery/earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/delivery/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-primary pb-20 max-w-lg mx-auto">
      <Routes>
        <Route index element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="orders/:id" element={<DeliveryOrderDetail />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Routes>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light flex z-30 max-w-lg mx-auto">
        {navItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2.5 text-[11px] font-medium transition-colors ${isActive(item.path) ? 'text-brand-red' : 'text-text-secondary'}`}
          >
            {item.icon}
            <span className="mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Dashboard
// ============================================
function DeliveryDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const partner = mockDeliveryPartners[0];
  const [requests, setRequests] = useState(mockDeliveryRequests);

  const acceptRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Delivery accepted!', type: 'success' } });
    navigate(`/delivery/orders/${id}`);
  };

  const rejectRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-border-light">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/customer" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-sm">R</div>
              <span className="font-bold text-text-primary text-sm">Rasa<span className="text-brand-red">Flow</span></span>
            </Link>
          </div>
          <Toggle checked={state.deliveryOnlineStatus} onChange={val => dispatch({ type: 'SET_DELIVERY_STATUS', payload: val })} label={state.deliveryOnlineStatus ? 'Online' : 'Offline'} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-olive-light rounded-2xl flex items-center justify-center text-brand-olive font-bold text-lg">
            {partner.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Hi, {partner.name.split(' ')[0]}!</h2>
            <p className="text-xs text-text-secondary">{partner.vehicle} • {partner.vehicleNumber}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Today's Earnings" value={`₹${partner.todayEarnings}`} color="green" />
          <StatCard title="Today's Deliveries" value={partner.todayDeliveries || 0} color="olive" />
        </div>

        {/* Active Delivery */}
        {state.deliveryOnlineStatus && (
          <>
            <h3 className="text-base font-bold text-text-primary">Available Requests</h3>
            {requests.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-4xl mb-3">🏍️</p>
                <p className="text-sm font-bold text-text-primary">No delivery requests</p>
                <p className="text-xs text-text-secondary mt-1">New requests will appear here</p>
              </Card>
            ) : (
              requests.map(req => (
                <Card key={req.id} className="border-l-4 border-l-brand-red">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-text-primary">{req.restaurantName}</p>
                    <span className="text-sm font-bold text-success">₹{req.estimatedEarnings}</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-brand-orange rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">Pickup</p>
                        <p className="text-sm text-text-primary">{req.restaurantAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-success rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">Drop</p>
                        <p className="text-sm text-text-primary">{req.customerAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                    <span>{req.distance}</span>
                    <span>•</span>
                    <span>{req.estimatedTime}</span>
                    <span>•</span>
                    <span>{req.items} items</span>
                    <span>•</span>
                    <span>₹{req.orderAmount}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button fullWidth onClick={() => acceptRequest(req.id)}>Accept</Button>
                    <Button variant="ghost" fullWidth onClick={() => rejectRequest(req.id)}>Reject</Button>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {!state.deliveryOnlineStatus && (
          <Card className="text-center py-12">
            <Power className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-lg font-bold text-text-primary">You're Offline</p>
            <p className="text-sm text-text-secondary mt-1">Go online to start accepting deliveries</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================
// Delivery Orders
// ============================================
function DeliveryOrders() {
  const navigate = useNavigate();
  const activeOrders = mockOrders.filter(o => ['on_the_way', 'picked_up', 'rider_assigned'].includes(o.status)).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="bg-white px-4 py-3 border-b border-border-light">
        <h1 className="text-lg font-bold">My Deliveries</h1>
      </div>
      <div className="px-4 pt-4 space-y-3">
        {activeOrders.length === 0 ? (
          <EmptyState title="No active deliveries" description="Accept delivery requests from the home screen" icon={<Package className="w-16 h-16" />} />
        ) : (
          activeOrders.map(order => (
            <Card key={order.id} onClick={() => navigate(`/delivery/orders/${order.id}`)}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">{order.orderNumber}</p>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-text-primary">{order.restaurantName}</p>
              <p className="text-xs text-text-secondary mt-1">{order.customerAddress}</p>
              <div className="flex items-center gap-3 text-xs text-text-secondary mt-2">
                <span>{order.items.length} items</span>
                <span>•</span>
                <span>₹{order.total}</span>
              </div>
            </Card>
          ))
        )}
        <button onClick={() => navigate('/delivery/history')} className="w-full text-center text-sm text-brand-red font-medium py-3">
          View Delivery History →
        </button>
      </div>
    </div>
  );
}

// ============================================
// Delivery Order Detail
// ============================================
function DeliveryOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [otpInput, setOtpInput] = useState('');

  const steps = ['Accepted', 'Reached Restaurant', 'Picked Up', 'On the Way', 'Reached Customer', 'Delivered'];
  const order = mockOrders[0];

  const advanceStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      dispatch({ type: 'SHOW_TOAST', payload: { message: `Status: ${steps[currentStep + 1]}`, type: 'success' } });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-base font-bold flex-1">Delivery #{order.orderNumber}</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Status Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold">Delivery Status</p>
            <span className="text-xs text-brand-red font-bold bg-brand-red-light px-2 py-1 rounded-full">{steps[currentStep]}</span>
          </div>
          <div className="flex gap-1 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? 'bg-brand-red' : 'bg-border'}`} />
            ))}
          </div>
          {currentStep < steps.length - 1 && (
            <Button fullWidth onClick={advanceStep}>
              {currentStep === 4 ? 'Verify & Deliver' : `Mark as ${steps[currentStep + 1]}`}
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-success mx-auto mb-2" />
              <p className="text-base font-bold text-success">Delivery Completed!</p>
            </div>
          )}
        </Card>

        {/* OTP Verification */}
        {currentStep === 4 && (
          <Card className="border-warning border">
            <h3 className="text-sm font-bold mb-2">OTP Verification</h3>
            <p className="text-xs text-text-secondary mb-3">Ask customer for the delivery OTP</p>
            <div className="flex gap-2">
              <Input placeholder="Enter OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} maxLength={4} className="text-center text-lg tracking-[0.5em]" />
              <Button onClick={() => { if (otpInput.length === 4) { setCurrentStep(5); dispatch({ type: 'SHOW_TOAST', payload: { message: 'Delivery completed!', type: 'success' } }); } }}>Verify</Button>
            </div>
          </Card>
        )}

        {/* Pickup & Drop */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-brand-orange" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Pickup from</p>
                <p className="text-sm font-bold">{order.restaurantName}</p>
                <p className="text-xs text-text-secondary">M.I. Road, Jaipur</p>
              </div>
              <button className="p-2 bg-brand-olive-light rounded-full"><Navigation className="w-4 h-4 text-brand-olive" /></button>
            </div>
            <div className="w-px h-4 bg-border ml-4" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Deliver to</p>
                <p className="text-sm font-bold">{order.customerName}</p>
                <p className="text-xs text-text-secondary">{order.customerAddress}</p>
              </div>
              <button className="p-2 bg-brand-olive-light rounded-full"><Navigation className="w-4 h-4 text-brand-olive" /></button>
            </div>
          </div>
        </Card>

        {/* Customer Contact */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bg-cream rounded-full flex items-center justify-center font-bold text-text-secondary">{order.customerName.charAt(0)}</div>
              <div>
                <p className="text-sm font-bold">{order.customerName}</p>
                <p className="text-xs text-text-secondary">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center"><Phone className="w-4 h-4 text-success" /></button>
              <button className="w-10 h-10 bg-brand-red-light rounded-full flex items-center justify-center"><MessageCircle className="w-4 h-4 text-brand-red" /></button>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card>
          <h3 className="text-sm font-bold mb-2">Order Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border-light last:border-0">
              <span className="text-text-secondary">{item.name} × {item.quantity}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-2">
            <span>Total</span><span>₹{order.total}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// Delivery Earnings
// ============================================
function DeliveryEarnings() {
  const todayEarnings = mockEarnings[0];
  const weeklyTotal = mockEarnings.slice(0, 7).reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="animate-fade-in">
      <div className="bg-white px-4 py-3 border-b border-border-light">
        <h1 className="text-lg font-bold">Earnings</h1>
      </div>
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard title="Today" value={`₹${todayEarnings.total}`} color="green" />
          <StatCard title="This Week" value={`₹${weeklyTotal}`} color="olive" />
          <StatCard title="This Month" value="₹28,400" color="red" />
        </div>

        {/* Breakdown */}
        <Card>
          <h3 className="text-sm font-bold mb-3">Today's Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Base Earnings</span><span>₹{todayEarnings.baseEarnings}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Distance Bonus</span><span className="text-success">+₹{todayEarnings.distanceBonus}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Peak Bonus</span><span className="text-success">+₹{todayEarnings.peakBonus}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Tips</span><span className="text-success">+₹{todayEarnings.tips}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-border-light"><span>Total</span><span>₹{todayEarnings.total}</span></div>
          </div>
        </Card>

        {/* Chart */}
        <Card>
          <h3 className="text-sm font-bold mb-3">Weekly Earnings</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockEarnings.slice(0, 7).reverse().map(e => ({ name: new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short' }), total: e.total }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#687044" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily History */}
        <Card>
          <h3 className="text-sm font-bold mb-3">Recent Earnings</h3>
          {mockEarnings.map((earning, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border-light last:border-0">
              <div>
                <p className="text-sm font-medium">{new Date(earning.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}</p>
                <p className="text-xs text-text-secondary">{earning.deliveries} deliveries</p>
              </div>
              <p className="text-sm font-bold text-success">₹{earning.total}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function DeliveryHistory() {
  const navigate = useNavigate();
  const completedOrders = mockOrders.filter(o => o.status === 'delivered').slice(0, 10);
  return (
    <div className="animate-fade-in">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Delivery History</h1>
      </div>
      <div className="px-4 pt-4 space-y-2">
        {completedOrders.map(order => (
          <Card key={order.id}>
            <div className="flex justify-between mb-1"><span className="text-sm font-bold">{order.orderNumber}</span><span className="text-sm font-bold text-success">₹{Math.round(order.total * 0.08)}</span></div>
            <p className="text-xs text-text-secondary">{order.restaurantName} → {order.customerName}</p>
            <p className="text-xs text-text-tertiary mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DeliveryProfile() {
  const navigate = useNavigate();
  const partner = mockDeliveryPartners[0];
  return (
    <div className="animate-fade-in">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-border-light">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-olive rounded-2xl flex items-center justify-center text-white text-xl font-bold">{partner.name.charAt(0)}</div>
          <div>
            <h2 className="text-lg font-bold">{partner.name}</h2>
            <p className="text-sm text-text-secondary">{partner.phone}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-success font-medium"><Shield className="w-3 h-3" /> KYC Verified</div>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center"><p className="text-xl font-bold">{partner.totalDeliveries}</p><p className="text-xs text-text-secondary">Deliveries</p></Card>
          <Card className="text-center"><p className="text-xl font-bold">⭐ {partner.rating}</p><p className="text-xs text-text-secondary">Rating</p></Card>
          <Card className="text-center"><p className="text-xl font-bold">{partner.vehicle}</p><p className="text-xs text-text-secondary">{partner.vehicleNumber}</p></Card>
        </div>
        <Card><h3 className="text-sm font-bold mb-3">Vehicle Details</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-text-secondary">Vehicle</span><span>{partner.vehicle}</span></div><div className="flex justify-between"><span className="text-text-secondary">Number</span><span>{partner.vehicleNumber}</span></div></div></Card>
        <div className="space-y-1">
          <button onClick={() => navigate('/delivery/history')} className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-bg-cream transition-colors">
            <History className="w-5 h-5 text-text-secondary" /><span className="flex-1 text-sm font-medium text-left">Delivery History</span><ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-bg-cream transition-colors">
            <Wallet className="w-5 h-5 text-text-secondary" /><span className="flex-1 text-sm font-medium text-left">Bank Details</span><ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Demo: Switch Role</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/customer')} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-brand-red transition-colors">🏠 Customer</button>
            <button onClick={() => navigate('/admin')} className="p-3 bg-white rounded-xl border border-border text-sm font-medium hover:border-brand-red transition-colors">👨‍💼 Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Delivery Registration
// ============================================
export function DeliveryRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 5;

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-5 animate-scale-in"><Check className="w-10 h-10 text-white" /></div>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-display)' }}>Application Submitted!</h1>
        <p className="text-text-secondary text-center mb-8">Your application is under verification. We'll notify you once approved.</p>
        <Button onClick={() => navigate('/customer')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold flex-1">Become a Delivery Partner</h1>
        <span className="text-sm text-text-secondary">{step}/{totalSteps}</span>
      </div>
      <div className="h-1 bg-bg-cream"><div className="h-full bg-brand-red transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {step === 1 && (<><h2 className="text-lg font-bold">Personal Details</h2><Input label="Full Name" placeholder="Enter your name" /><Input label="Phone Number" placeholder="+91" /><Input label="Email" placeholder="email@example.com" /><Input label="Address" placeholder="Your address" /></>)}
        {step === 2 && (<><h2 className="text-lg font-bold">Vehicle Details</h2><Select label="Vehicle Type" options={[{ value: 'bike', label: 'Bike' }, { value: 'scooter', label: 'Scooter' }, { value: 'bicycle', label: 'Bicycle' }]} value="" onChange={() => {}} /><Input label="Vehicle Number" placeholder="RJ-14-XX-0000" /><Input label="Driving License No." placeholder="License number" /></>)}
        {step === 3 && (<><h2 className="text-lg font-bold">KYC Documents</h2><Input label="Aadhaar Number" placeholder="0000 0000 0000" /><Input label="PAN Number" placeholder="ABCDE1234F" /><div className="border-2 border-dashed border-border rounded-xl p-8 text-center"><p className="text-sm text-text-secondary">Upload Aadhaar & PAN</p></div></>)}
        {step === 4 && (<><h2 className="text-lg font-bold">Bank Details</h2><Input label="Account Holder" placeholder="Name" /><Input label="Bank Name" placeholder="Bank" /><Input label="Account Number" placeholder="Account number" /><Input label="IFSC Code" placeholder="IFSC" /><p className="text-xs text-text-secondary">Or add UPI ID:</p><Input label="UPI ID" placeholder="name@upi" /></>)}
        {step === 5 && (<><h2 className="text-lg font-bold">Review & Submit</h2><Card><p className="text-sm text-text-secondary">Review your application before submitting.</p></Card></>)}
        <div className="flex gap-3 pt-4">
          {step > 1 && <Button variant="ghost" fullWidth onClick={() => setStep(step - 1)}>Previous</Button>}
          <Button fullWidth onClick={() => step < totalSteps ? setStep(step + 1) : setSubmitted(true)}>{step < totalSteps ? 'Next' : 'Submit Application'}</Button>
        </div>
      </div>
    </div>
  );
}
