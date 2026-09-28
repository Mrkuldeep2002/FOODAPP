import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { restaurants, mockOrders, mockReviews, revenueChartData } from '../../data/mockData';
import { Button, Card, StatCard, StatusBadge, Tabs, Toggle, SearchBar, ConfirmDialog, DataTable, Select, VegIndicator, Input, QuantityControl, EmptyState, Modal } from '../../components/common';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, FolderOpen, DollarSign, BarChart3, MessageSquare, Settings, Bell, ChevronDown, Plus, Edit, Trash2, Eye, EyeOff, Power, Check, X, Clock, Package, ArrowLeft, TrendingUp, Users, Star as StarIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Order, FoodItem } from '../../types';

// ============================================
// Restaurant Layout
// ============================================
export function RestaurantLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const restaurant = restaurants[0]; // Mock: use first restaurant

  const navItems = [
    { path: '/restaurant', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/restaurant/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { path: '/restaurant/menu', label: 'Menu', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { path: '/restaurant/offers', label: 'Offers', icon: <Tag className="w-5 h-5" /> },
    { path: '/restaurant/earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/restaurant/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/restaurant/reviews', label: 'Reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/restaurant/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-border-light flex-shrink-0 fixed h-full z-30 transition-all duration-300 hidden md:flex flex-col`}>
        <div className="p-4 border-b border-border-light">
          <Link to="/customer" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-sm">R</div>
            {sidebarOpen && <span className="font-bold text-text-primary text-sm">Rasa<span className="text-brand-red">Flow</span></span>}
          </Link>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'bg-brand-red-light text-brand-red' : 'text-text-secondary hover:bg-bg-cream hover:text-text-primary'}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-60' : 'md:ml-16'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-border-light px-4 md:px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/customer')} className="md:hidden p-1"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h2 className="text-base font-bold text-text-primary">{restaurant.name}</h2>
              <p className="text-xs text-text-secondary">{restaurant.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Toggle checked={state.restaurantOnlineStatus} onChange={val => dispatch({ type: 'SET_RESTAURANT_STATUS', payload: val })} label={state.restaurantOnlineStatus ? 'Online' : 'Offline'} />
            <button className="relative p-2 rounded-full hover:bg-bg-cream"><Bell className="w-5 h-5 text-text-secondary" /><span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full" /></button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          <Routes>
            <Route index element={<RestaurantDashboard />} />
            <Route path="orders" element={<RestaurantOrders />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="offers" element={<RestaurantOffersPage />} />
            <Route path="earnings" element={<RestaurantEarnings />} />
            <Route path="analytics" element={<RestaurantAnalytics />} />
            <Route path="reviews" element={<RestaurantReviewsPage />} />
            <Route path="settings" element={<RestaurantSettings />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light flex md:hidden z-30">
        {navItems.slice(0, 5).map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] font-medium ${isActive(item.path) ? 'text-brand-red' : 'text-text-secondary'}`}
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
function RestaurantDashboard() {
  const pendingOrders = mockOrders.filter(o => ['placed', 'confirmed'].includes(o.status) && o.restaurantId === 'rest-1');
  const todayOrders = mockOrders.filter(o => o.restaurantId === 'rest-1').slice(0, 8);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Today's Orders" value={12} icon={<ShoppingBag className="w-5 h-5" />} trend={{ value: '+18%', positive: true }} color="red" />
        <StatCard title="Today's Revenue" value="₹8,450" icon={<DollarSign className="w-5 h-5" />} trend={{ value: '+12%', positive: true }} color="green" />
        <StatCard title="Pending Orders" value={pendingOrders.length} icon={<Clock className="w-5 h-5" />} color="orange" />
        <StatCard title="Avg Order Value" value="₹385" icon={<TrendingUp className="w-5 h-5" />} color="olive" />
      </div>

      {/* Revenue Chart */}
      <Card>
        <h3 className="text-sm font-bold text-text-primary mb-4">Revenue This Week</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#77746C" />
              <YAxis tick={{ fontSize: 12 }} stroke="#77746C" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#D92720" fill="#D92720" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card>
        <h3 className="text-sm font-bold text-text-primary mb-3">Recent Orders</h3>
        <div className="space-y-2">
          {todayOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{order.orderNumber}</p>
                <p className="text-xs text-text-secondary">{order.customerName} • {order.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{order.total}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// Restaurant Orders
// ============================================
function RestaurantOrders() {
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: string } | null>(null);

  const restOrders = mockOrders.filter(o => o.restaurantId === 'rest-1' || o.restaurantId === 'rest-2');
  const filteredOrders = activeTab === 'all' ? restOrders :
    activeTab === 'new' ? restOrders.filter(o => o.status === 'placed') :
    activeTab === 'active' ? restOrders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)) :
    restOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const handleAction = (orderId: string, action: string) => {
    setConfirmAction({ orderId, action });
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const statusMap: Record<string, Order['status']> = { accept: 'confirmed', prepare: 'preparing', ready: 'ready', reject: 'cancelled' };
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: confirmAction.orderId, status: statusMap[confirmAction.action] } });
    dispatch({ type: 'SHOW_TOAST', payload: { message: `Order ${confirmAction.action}ed successfully`, type: 'success' } });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Orders</h1>
      <Tabs tabs={[
        { id: 'all', label: 'All', count: restOrders.length },
        { id: 'new', label: 'New', count: restOrders.filter(o => o.status === 'placed').length },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
      ]} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      <div className="space-y-3">
        {filteredOrders.map(order => (
          <Card key={order.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-text-primary">{order.orderNumber}</p>
                <p className="text-xs text-text-secondary">{order.customerName} • {order.customerPhone}</p>
              </div>
              <StatusBadge status={order.status} size="md" />
            </div>
            <div className="space-y-1 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-border-light">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
              <Clock className="w-3 h-3" />
              <span>{new Date(order.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
              <span>•</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex gap-2">
              {order.status === 'placed' && (
                <>
                  <Button size="sm" onClick={() => handleAction(order.id, 'accept')}>Accept</Button>
                  <Button size="sm" variant="danger" onClick={() => handleAction(order.id, 'reject')}>Reject</Button>
                </>
              )}
              {order.status === 'confirmed' && <Button size="sm" onClick={() => handleAction(order.id, 'prepare')}>Start Preparing</Button>}
              {order.status === 'preparing' && <Button size="sm" onClick={() => handleAction(order.id, 'ready')}>Mark Ready</Button>}
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} onConfirm={executeAction}
        title={confirmAction?.action === 'reject' ? 'Reject Order?' : `${confirmAction?.action?.replace(/^\w/, (c: string) => c.toUpperCase())} Order?`}
        message={confirmAction?.action === 'reject' ? 'This action cannot be undone.' : 'Are you sure you want to proceed?'}
        confirmText={confirmAction?.action === 'reject' ? 'Reject' : 'Confirm'}
        variant={confirmAction?.action === 'reject' ? 'danger' : 'primary'}
      />
    </div>
  );
}

// ============================================
// Restaurant Menu
// ============================================
function RestaurantMenu() {
  const restaurant = restaurants[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const allItems = restaurant.categories.flatMap(c => c.items);
  const filtered = allItems.filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Menu Management</h1>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Item</Button>
      </div>
      <SearchBar placeholder="Search menu items..." value={searchQuery} onChange={setSearchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(item => (
          <Card key={item.id}>
            <div className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <VegIndicator isVeg={item.isVeg} />
                  {item.isBestseller && <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">Bestseller</span>}
                </div>
                <h3 className="text-sm font-bold text-text-primary truncate">{item.name}</h3>
                <p className="text-sm font-bold text-text-primary mt-0.5">₹{item.price}</p>
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{item.description}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <button className="p-1.5 rounded-lg hover:bg-bg-cream"><Edit className="w-4 h-4 text-text-secondary" /></button>
                <button className="p-1.5 rounded-lg hover:bg-bg-cream"><Trash2 className="w-4 h-4 text-error" /></button>
                <div className={`w-8 h-4 rounded-full ${item.isAvailable ? 'bg-success' : 'bg-border'} flex items-center ${item.isAvailable ? 'justify-end' : 'justify-start'} px-0.5`}>
                  <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Menu Item" size="lg">
        <div className="p-5 space-y-4">
          <Input label="Food Name" placeholder="Enter food name" />
          <Input label="Description" placeholder="Enter description" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" placeholder="0" type="number" />
            <Input label="Original Price (₹)" placeholder="0" type="number" />
          </div>
          <Select label="Category" options={restaurant.categories.map(c => ({ value: c.id, label: c.name }))} value="" onChange={() => {}} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="type" defaultChecked className="accent-success" /><span className="text-sm">Veg</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="type" className="accent-brand-red" /><span className="text-sm">Non-Veg</span></label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button fullWidth onClick={() => { setShowAddModal(false); }}>Add Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function RestaurantOffersPage() { return <div className="animate-fade-in"><h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Offers</h1><EmptyState title="No active offers" description="Create offers to attract more customers" action={<Button icon={<Plus className="w-4 h-4" />}>Create Offer</Button>} /></div>; }
function RestaurantEarnings() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Earnings</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Today" value="₹8,450" color="green" />
        <StatCard title="This Week" value="₹45,800" color="olive" />
        <StatCard title="This Month" value="₹1,89,000" color="red" />
      </div>
      <Card>
        <h3 className="text-sm font-bold mb-4">Weekly Revenue</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#D92720" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
function RestaurantAnalytics() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Orders" value="1,234" trend={{ value: '+12%', positive: true }} />
        <StatCard title="Revenue" value="₹4.5L" trend={{ value: '+8%', positive: true }} />
        <StatCard title="Avg Rating" value="4.6" />
        <StatCard title="Repeat Rate" value="34%" />
      </div>
      <Card>
        <h3 className="text-sm font-bold mb-4">Orders Trend</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#687044" fill="#687044" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
function RestaurantReviewsPage() {
  const reviews = mockReviews.filter(r => r.restaurantId === 'rest-1' || r.restaurantId === 'rest-2');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Reviews</h1>
      <div className="space-y-3">
        {reviews.map(review => (
          <Card key={review.id}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-olive-light rounded-full flex items-center justify-center text-brand-olive text-sm font-bold">{(review.customerName || review.userName || 'C').charAt(0)}</div>
                <div><p className="text-sm font-bold">{review.customerName || review.userName || 'Customer'}</p><p className="text-xs text-text-secondary">{review.date}</p></div>
              </div>
              <div className="flex items-center gap-1 bg-success text-white text-xs font-bold px-2 py-0.5 rounded-md"><StarIcon className="w-3 h-3 fill-current" />{review.rating}</div>
            </div>
            <p className="text-sm text-text-secondary">{review.review}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
function RestaurantSettings() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      <Card><h3 className="text-sm font-bold mb-3">Restaurant Details</h3><div className="space-y-3"><Input label="Restaurant Name" defaultValue="Royal Biryani House" /><Input label="Address" defaultValue="M.I. Road, Jaipur" /><Input label="Phone" defaultValue="+91 98765 43210" /></div></Card>
      <Card><h3 className="text-sm font-bold mb-3">Operating Hours</h3><div className="grid grid-cols-2 gap-3"><Input label="Opens At" defaultValue="10:00 AM" /><Input label="Closes At" defaultValue="11:00 PM" /></div></Card>
      <Button>Save Changes</Button>
    </div>
  );
}

// ============================================
// Restaurant Registration
// ============================================
export function RestaurantRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 5;

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-5 animate-scale-in"><Check className="w-10 h-10 text-white" /></div>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-display)' }}>Application Submitted!</h1>
        <p className="text-text-secondary text-center mb-8">Your restaurant is under review. We'll notify you once approved.</p>
        <Button onClick={() => navigate('/customer')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-border-light">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold flex-1">Register Restaurant</h1>
        <span className="text-sm text-text-secondary">Step {step}/{totalSteps}</span>
      </div>
      <div className="h-1 bg-bg-cream"><div className="h-full bg-brand-red transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {step === 1 && (<><h2 className="text-lg font-bold">Restaurant Details</h2><Input label="Restaurant Name" placeholder="Enter restaurant name" /><Input label="Cuisine Type" placeholder="E.g., North Indian, Chinese" /><Input label="Address" placeholder="Full address" /><Input label="City" placeholder="City" /></>)}
        {step === 2 && (<><h2 className="text-lg font-bold">Owner Details</h2><Input label="Owner Name" placeholder="Full name" /><Input label="Phone" placeholder="+91" /><Input label="Email" placeholder="email@example.com" /></>)}
        {step === 3 && (<><h2 className="text-lg font-bold">Documents</h2><Input label="FSSAI License Number" placeholder="License number" /><Input label="GST Number" placeholder="GST number" /><div className="border-2 border-dashed border-border rounded-xl p-8 text-center"><p className="text-sm text-text-secondary">Upload restaurant documents</p></div></>)}
        {step === 4 && (<><h2 className="text-lg font-bold">Bank Details</h2><Input label="Account Holder Name" placeholder="Name" /><Input label="Bank Name" placeholder="Bank" /><Input label="Account Number" placeholder="Account number" /><Input label="IFSC Code" placeholder="IFSC" /></>)}
        {step === 5 && (<><h2 className="text-lg font-bold">Review & Submit</h2><Card><p className="text-sm text-text-secondary">Please review all details before submitting your application.</p><div className="mt-3 space-y-2 text-sm"><p><strong>Restaurant:</strong> Your Restaurant</p><p><strong>Owner:</strong> Your Name</p><p><strong>City:</strong> Jaipur</p></div></Card></>)}
        <div className="flex gap-3 pt-4">
          {step > 1 && <Button variant="ghost" fullWidth onClick={() => setStep(step - 1)}>Previous</Button>}
          <Button fullWidth onClick={() => step < totalSteps ? setStep(step + 1) : setSubmitted(true)}>
            {step < totalSteps ? 'Next' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}
