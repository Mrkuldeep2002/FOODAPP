import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { adminStats, restaurants, mockUsers, mockDeliveryPartners, mockOrders, mockCoupons, mockReviews, mockTransactions, revenueChartData, monthlyRevenueData, customerGrowthData, orderStatusData } from '../../data/mockData';
import { Button, Card, StatCard, StatusBadge, Tabs, SearchBar, DataTable, Pagination, Select, Input, Modal, EmptyState, ConfirmDialog } from '../../components/common';
import { LayoutDashboard, Users, Store, Bike, ShoppingBag, CreditCard, RotateCcw, Ticket, MessageSquare, BarChart3, Settings, Bell, ChevronDown, Plus, Edit, Trash2, Eye, Ban, Check, X, ArrowLeft, TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2E8B57', '#C83A32', '#D92720', '#D99A2B'];

// ============================================
// Admin Layout
// ============================================
export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/restaurants', label: 'Restaurants', icon: <Store className="w-5 h-5" /> },
    { path: '/admin/delivery-partners', label: 'Delivery Partners', icon: <Bike className="w-5 h-5" /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { path: '/admin/payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/admin/refunds', label: 'Refunds', icon: <RotateCcw className="w-5 h-5" /> },
    { path: '/admin/coupons', label: 'Coupons', icon: <Ticket className="w-5 h-5" /> },
    { path: '/admin/reviews', label: 'Reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border-light fixed h-full z-30 hidden md:flex flex-col">
        <div className="p-4 border-b border-border-light">
          <Link to="/customer" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-sm">R</div>
            <span className="font-bold text-sm">Rasa<span className="text-brand-red">Flow</span> <span className="text-xs text-text-tertiary font-normal">Admin</span></span>
          </Link>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'bg-brand-red-light text-brand-red' : 'text-text-secondary hover:bg-bg-cream hover:text-text-primary'}`}
            >
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border-light">
          <button onClick={() => navigate('/customer')} className="w-full text-sm text-text-secondary hover:text-brand-red text-center py-2">← Back to App</button>
        </div>
      </aside>

      <div className="flex-1 md:ml-60">
        {/* Top Bar */}
        <header className="bg-white border-b border-border-light px-4 md:px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/customer')} className="md:hidden p-1"><ArrowLeft className="w-5 h-5" /></button>
            <h2 className="text-base font-bold">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-bg-cream"><Bell className="w-5 h-5 text-text-secondary" /><span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full" /></button>
            <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="refunds" element={<AdminRefunds />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light flex md:hidden z-30 overflow-x-auto">
        {navItems.slice(0, 5).map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] font-medium min-w-[60px] ${isActive(item.path) ? 'text-brand-red' : 'text-text-secondary'}`}
          >
            {item.icon}<span className="mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Dashboard
// ============================================
function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Orders" value={adminStats.totalOrders} icon={<ShoppingBag className="w-5 h-5" />} trend={{ value: '+12%', positive: true }} color="red" />
        <StatCard title="Total Revenue" value={`₹${(adminStats.totalRevenue / 100000).toFixed(1)}L`} icon={<DollarSign className="w-5 h-5" />} trend={{ value: '+8%', positive: true }} color="green" />
        <StatCard title="Customers" value={adminStats.totalCustomers} icon={<Users className="w-5 h-5" />} trend={{ value: '+15%', positive: true }} color="olive" />
        <StatCard title="Restaurants" value={adminStats.totalRestaurants} icon={<Store className="w-5 h-5" />} color="orange" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Delivery Partners" value={adminStats.totalDeliveryPartners} />
        <StatCard title="Pending Approvals" value={adminStats.pendingApprovals} color="orange" />
        <StatCard title="Active Orders" value={adminStats.activeOrders} color="red" />
        <StatCard title="Today's Revenue" value={`₹${adminStats.todayRevenue.toLocaleString('en-IN')}`} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-bold mb-4">Monthly Revenue</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip formatter={(v: any) => v ? `₹${Number(v).toLocaleString('en-IN')}` : ''} />
                <Area type="monotone" dataKey="revenue" stroke="#D92720" fill="#D92720" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold mb-4">Customer Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#687044" fill="#687044" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-bold mb-4">Weekly Orders</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#E9783F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold mb-4">Order Status Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {orderStatusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// Admin Users
// ============================================
function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = mockUsers.filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery));
  const perPage = 10;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Users</h1>
      <div className="flex gap-3 items-center"><SearchBar placeholder="Search users..." value={searchQuery} onChange={setSearchQuery} className="flex-1" /></div>
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (u: any) => <span className="font-medium">{u.name}</span> },
            { key: 'phone', header: 'Phone' },
            { key: 'email', header: 'Email' },
            { key: 'joinedDate', header: 'Joined', render: (u: any) => new Date(u.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { key: 'status', header: 'Status', render: (u: any) => <StatusBadge status={u.status} /> },
            { key: 'actions', header: 'Actions', render: () => <div className="flex gap-1"><button className="p-1 hover:bg-bg-cream rounded"><Eye className="w-4 h-4 text-text-secondary" /></button><button className="p-1 hover:bg-bg-cream rounded"><Ban className="w-4 h-4 text-error" /></button></div> },
          ]}
          data={paginated}
        />
        <Pagination currentPage={currentPage} totalPages={Math.ceil(filtered.length / perPage)} onPageChange={setCurrentPage} />
      </Card>
    </div>
  );
}

// ============================================
// Admin Restaurants
// ============================================
function AdminRestaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = restaurants.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Restaurants</h1>
      <SearchBar placeholder="Search restaurants..." value={searchQuery} onChange={setSearchQuery} />
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'name', header: 'Restaurant', render: (r: any) => <div className="flex items-center gap-2"><span className="text-lg">{r.logo}</span><span className="font-medium">{r.name}</span></div> },
            { key: 'cuisine', header: 'Cuisine', render: (r: any) => r.cuisine.join(', ') },
            { key: 'rating', header: 'Rating', render: (r: any) => <span className="font-medium">⭐ {r.rating}</span> },
            { key: 'address', header: 'Location', render: (r: any) => r.address },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.isOpen ? 'active' : 'closed'} /> },
            { key: 'actions', header: '', render: () => <button className="p-1 hover:bg-bg-cream rounded"><Eye className="w-4 h-4 text-text-secondary" /></button> },
          ]}
          data={filtered.slice(0, 15)}
        />
      </Card>
    </div>
  );
}

// ============================================
// Admin Delivery Partners
// ============================================
function AdminDeliveryPartners() {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = mockDeliveryPartners.filter(dp => !searchQuery || dp.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Delivery Partners</h1>
      <SearchBar placeholder="Search partners..." value={searchQuery} onChange={setSearchQuery} />
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (dp: any) => <span className="font-medium">{dp.name}</span> },
            { key: 'phone', header: 'Phone' },
            { key: 'vehicle', header: 'Vehicle', render: (dp: any) => `${dp.vehicle} (${dp.vehicleNumber})` },
            { key: 'rating', header: 'Rating', render: (dp: any) => <span>⭐ {dp.rating}</span> },
            { key: 'deliveries', header: 'Deliveries', render: (dp: any) => dp.totalDeliveries },
            { key: 'kycStatus', header: 'KYC', render: (dp: any) => <StatusBadge status={dp.kycStatus} /> },
            { key: 'status', header: 'Status', render: (dp: any) => <StatusBadge status={dp.status} /> },
            { key: 'actions', header: '', render: (dp: any) => (
              <div className="flex gap-1">
                <button className="p-1 hover:bg-bg-cream rounded"><Eye className="w-4 h-4 text-text-secondary" /></button>
                {dp.status === 'pending' && <button className="p-1 hover:bg-bg-cream rounded"><Check className="w-4 h-4 text-success" /></button>}
              </div>
            )},
          ]}
          data={filtered}
        />
      </Card>
    </div>
  );
}

// ============================================
// Admin Orders
// ============================================
function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = mockOrders.filter(o => {
    const matchesSearch = !searchQuery || o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const perPage = 10;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Orders</h1>
      <div className="flex gap-3 flex-wrap">
        <SearchBar placeholder="Search orders..." value={searchQuery} onChange={setSearchQuery} className="flex-1 min-w-[200px]" />
        <Select options={[{ value: 'all', label: 'All Status' }, { value: 'placed', label: 'Placed' }, { value: 'confirmed', label: 'Confirmed' }, { value: 'preparing', label: 'Preparing' }, { value: 'delivered', label: 'Delivered' }, { value: 'cancelled', label: 'Cancelled' }]} value={statusFilter} onChange={setStatusFilter} />
      </div>
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'orderNumber', header: 'Order ID', render: (o: any) => <span className="font-bold text-brand-red">{o.orderNumber}</span> },
            { key: 'customerName', header: 'Customer' },
            { key: 'restaurantName', header: 'Restaurant' },
            { key: 'items', header: 'Items', render: (o: any) => `${o.items.length} items` },
            { key: 'total', header: 'Amount', render: (o: any) => <span className="font-bold">₹{o.total}</span> },
            { key: 'paymentMethod', header: 'Payment' },
            { key: 'status', header: 'Status', render: (o: any) => <StatusBadge status={o.status} /> },
            { key: 'date', header: 'Date', render: (o: any) => new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
          ]}
          data={paginated}
        />
        <Pagination currentPage={currentPage} totalPages={Math.ceil(filtered.length / perPage)} onPageChange={setCurrentPage} />
      </Card>
    </div>
  );
}

// ============================================
// Admin Payments
// ============================================
function AdminPayments() {
  const payments = mockTransactions.filter(t => t.type === 'payment');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Payments</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Collected" value="₹45.2L" color="green" />
        <StatCard title="Today" value="₹89,450" />
        <StatCard title="Pending" value="₹12,340" color="orange" />
        <StatCard title="Failed" value="₹2,100" color="red" />
      </div>
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'id', header: 'Transaction ID', render: (t: any) => <span className="font-mono text-xs">{t.id}</span> },
            { key: 'orderId', header: 'Order ID', render: (t: any) => <span className="font-bold text-brand-red">{t.orderId}</span> },
            { key: 'customerName', header: 'Customer' },
            { key: 'amount', header: 'Amount', render: (t: any) => <span className="font-bold">₹{t.amount}</span> },
            { key: 'paymentMethod', header: 'Method' },
            { key: 'status', header: 'Status', render: (t: any) => <StatusBadge status={t.status} /> },
            { key: 'date', header: 'Date', render: (t: any) => new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
          ]}
          data={payments.slice(0, 15)}
        />
      </Card>
    </div>
  );
}

function AdminRefunds() {
  const refunds = mockTransactions.filter(t => t.type === 'refund' || t.status === 'refunded');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Refunds</h1>
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Total Refunded" value="₹45,600" color="red" />
        <StatCard title="Pending" value="₹5,200" color="orange" />
        <StatCard title="This Month" value="₹12,400" />
      </div>
      <Card padding={false}>
        <DataTable columns={[
          { key: 'orderId', header: 'Order', render: (t: any) => <span className="font-bold">{t.orderId}</span> },
          { key: 'customerName', header: 'Customer' },
          { key: 'amount', header: 'Amount', render: (t: any) => <span className="font-bold text-error">₹{t.amount}</span> },
          { key: 'status', header: 'Status', render: (t: any) => <StatusBadge status="refunded" /> },
          { key: 'date', header: 'Date', render: (t: any) => new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
        ]} data={refunds.length > 0 ? refunds : mockTransactions.slice(0, 5)} emptyMessage="No refunds" />
      </Card>
    </div>
  );
}

// ============================================
// Admin Coupons
// ============================================
function AdminCoupons() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Coupons</h1>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add Coupon</Button>
      </div>
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'code', header: 'Code', render: (c: any) => <span className="font-bold text-brand-red border border-brand-red border-dashed px-2 py-0.5 rounded text-xs">{c.code}</span> },
            { key: 'description', header: 'Description' },
            { key: 'discount', header: 'Discount', render: (c: any) => c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}` },
            { key: 'minOrder', header: 'Min Order', render: (c: any) => `₹${c.minOrder}` },
            { key: 'usage', header: 'Used', render: (c: any) => `${c.usedCount}/${c.usageLimit}` },
            { key: 'expiry', header: 'Expires', render: (c: any) => new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
            { key: 'status', header: 'Status', render: (c: any) => <StatusBadge status={c.status} /> },
          ]}
          data={mockCoupons}
        />
      </Card>
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Coupon" size="md">
        <div className="p-5 space-y-3">
          <Input label="Coupon Code" placeholder="E.g., SAVE20" />
          <Input label="Description" placeholder="Discount description" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed Amount' }]} value="percentage" onChange={() => {}} />
            <Input label="Value" placeholder="20" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min Order (₹)" placeholder="200" type="number" />
            <Input label="Max Discount (₹)" placeholder="100" type="number" />
          </div>
          <Input label="Usage Limit" placeholder="1000" type="number" />
          <Input label="Expiry Date" type="date" />
          <div className="flex gap-3"><Button variant="ghost" fullWidth onClick={() => setShowAdd(false)}>Cancel</Button><Button fullWidth onClick={() => setShowAdd(false)}>Create</Button></div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// Admin Reviews
// ============================================
function AdminReviews() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Reviews</h1>
      <Card padding={false}>
        <DataTable
          columns={[
            { key: 'customerName', header: 'Customer' },
            { key: 'restaurantName', header: 'Restaurant' },
            { key: 'rating', header: 'Rating', render: (r: any) => <span className={`font-bold ${r.rating >= 4 ? 'text-success' : r.rating >= 3 ? 'text-warning' : 'text-error'}`}>⭐ {r.rating}</span> },
            { key: 'review', header: 'Review', render: (r: any) => <span className="text-sm line-clamp-1 max-w-[200px]">{r.review}</span> },
            { key: 'date', header: 'Date' },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
            { key: 'actions', header: '', render: () => <div className="flex gap-1"><button className="p-1 hover:bg-bg-cream rounded"><Eye className="w-4 h-4" /></button></div> },
          ]}
          data={mockReviews}
        />
      </Card>
    </div>
  );
}

// ============================================
// Admin Reports
// ============================================
function AdminReports() {
  const [dateRange, setDateRange] = useState('30');
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Reports</h1>
        <div className="flex gap-2">
          {['7', '30', '90'].map(d => (
            <button key={d} onClick={() => setDateRange(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${dateRange === d ? 'bg-brand-red text-white' : 'bg-white text-text-secondary border border-border'}`}
            >{d} days</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Revenue" value="₹4.5L" trend={{ value: '+12%', positive: true }} color="green" />
        <StatCard title="Orders" value="15,678" trend={{ value: '+8%', positive: true }} color="red" />
        <StatCard title="New Customers" value="2,345" trend={{ value: '+22%', positive: true }} color="olive" />
        <StatCard title="Avg Order Value" value="₹385" trend={{ value: '-3%', positive: false }} color="orange" />
      </div>
      <Card>
        <h3 className="text-sm font-bold mb-4">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v / 1000}K`} />
              <Tooltip formatter={(v: any) => v ? `₹${Number(v).toLocaleString('en-IN')}` : ''} />
              <Area type="monotone" dataKey="revenue" stroke="#D92720" fill="#D92720" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-bold mb-4">Orders by Day</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#687044" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold mb-4">Customer Growth</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#E9783F" fill="#E9783F" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      <Card><h3 className="text-sm font-bold mb-3">Platform Settings</h3><div className="space-y-3"><Input label="Platform Name" defaultValue="RasaFlow" /><Input label="Support Email" defaultValue="support@rasaflow.com" /><Input label="Support Phone" defaultValue="+91 1800 123 4567" /></div></Card>
      <Card><h3 className="text-sm font-bold mb-3">Fee Configuration</h3><div className="grid grid-cols-2 gap-3"><Input label="Platform Fee (₹)" defaultValue="10" type="number" /><Input label="Delivery Base Fee (₹)" defaultValue="40" type="number" /><Input label="Tax Rate (%)" defaultValue="5" type="number" /><Input label="Free Delivery Above (₹)" defaultValue="250" type="number" /></div></Card>
      <Button>Save Settings</Button>
    </div>
  );
}
