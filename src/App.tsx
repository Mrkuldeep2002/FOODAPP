import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Toast } from './components/common';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';

// Onboarding
import { SplashScreen, LocationSelection } from './pages/Onboarding';

// Customer Pages
import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerMenu } from './pages/customer/CustomerMenu';
import { CustomerOffers } from './pages/customer/CustomerOffers';
import { RestaurantDetail } from './pages/customer/RestaurantDetail';
import { CustomerSearch, RestaurantListing } from './pages/customer/CustomerSearch';
import { CustomerCart } from './pages/customer/CustomerCart';
import { CustomerCheckout, OrderConfirmation } from './pages/customer/CustomerCheckout';
import { CustomerOrders, OrderTracking } from './pages/customer/CustomerOrders';
import { CustomerProfile, CustomerFavorites } from './pages/customer/CustomerProfile';

// Restaurant
import { RestaurantLayout, RestaurantRegistration } from './pages/restaurant/RestaurantPanel';

// Delivery
import { DeliveryLayout, DeliveryRegistration } from './pages/delivery/DeliveryPanel';

// Admin
import { AdminLayout } from './pages/admin/AdminPanel';

function AppContent() {
  const { state, dispatch } = useApp();

  return (
    <>
      <Routes>
        {/* Onboarding */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/location" element={<LocationSelection />} />

        {/* Customer */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="menu" element={<CustomerMenu />} />
          <Route path="offers" element={<CustomerOffers />} />
          <Route path="search" element={<CustomerSearch />} />
          <Route path="restaurants" element={<RestaurantListing />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="checkout" element={<CustomerCheckout />} />
          <Route path="order-confirmed/:id" element={<OrderConfirmation />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="favorites" element={<CustomerFavorites />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="addresses" element={<CustomerProfile />} />
          <Route path="settings" element={<CustomerProfile />} />
        </Route>

        {/* Restaurant Partner */}
        <Route path="/restaurant/register" element={<RestaurantRegistration />} />
        <Route path="/restaurant/*" element={<RestaurantLayout />} />

        {/* Delivery Partner */}
        <Route path="/delivery/register" element={<DeliveryRegistration />} />
        <Route path="/delivery/*" element={<DeliveryLayout />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast */}
      {state.toastMessage && (
        <Toast message={state.toastMessage} type={state.toastType} onClose={() => dispatch({ type: 'HIDE_TOAST' })} />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
