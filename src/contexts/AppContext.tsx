import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Cart, CartItem, FoodItem, Order, Address, CustomizationOption, SelectedCustomization } from '../types';
import { restaurants, mockOrders, mockAddresses } from '../data/mockData';

// ============================================
// State Shape
// ============================================
interface AppState {
  // Location
  selectedLocation: string | null;
  hasCompletedOnboarding: boolean;

  // Auth
  isLoggedIn: boolean;
  currentRole: 'customer' | 'restaurant' | 'delivery' | 'admin';
  userName: string;
  userPhone: string;

  // Cart
  cart: Cart | null;

  // Favorites
  favoriteRestaurants: string[];

  // Orders
  orders: Order[];

  // Addresses
  addresses: Address[];

  // Restaurant Partner
  restaurantOnlineStatus: boolean;

  // Delivery Partner
  deliveryOnlineStatus: boolean;

  // UI
  showLoginModal: boolean;
  showCartNotification: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
}

const initialState: AppState = {
  selectedLocation: null,
  hasCompletedOnboarding: false,
  isLoggedIn: false,
  currentRole: 'customer',
  userName: 'Rahul Sharma',
  userPhone: '+91 98765 43210',
  cart: null,
  favoriteRestaurants: ['rest-2', 'rest-6', 'rest-14'],
  orders: mockOrders.filter(o => o.customerId === 'cust-1'),
  addresses: mockAddresses,
  restaurantOnlineStatus: true,
  deliveryOnlineStatus: true,
  showLoginModal: false,
  showCartNotification: false,
  toastMessage: null,
  toastType: 'success',
};

// ============================================
// Actions
// ============================================
type AppAction =
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOGIN'; payload: { role: 'customer' | 'restaurant' | 'delivery' | 'admin'; name?: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ROLE'; payload: 'customer' | 'restaurant' | 'delivery' | 'admin' }
  | { type: 'ADD_TO_CART'; payload: { foodItem: FoodItem; quantity: number; customizations: SelectedCustomization[]; specialInstructions?: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_RESTAURANT_STATUS'; payload: boolean }
  | { type: 'SET_DELIVERY_STATUS'; payload: boolean }
  | { type: 'SHOW_LOGIN_MODAL'; payload: boolean }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'REMOVE_ADDRESS'; payload: string };

// ============================================
// Reducer
// ============================================
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, selectedLocation: action.payload };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };

    case 'LOGIN':
      return { ...state, isLoggedIn: true, currentRole: action.payload.role, userName: action.payload.name || state.userName, showLoginModal: false };

    case 'LOGOUT':
      return { ...state, isLoggedIn: false, currentRole: 'customer' };

    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };

    case 'ADD_TO_CART': {
      const { foodItem, quantity, customizations, specialInstructions } = action.payload;
      const restaurant = restaurants.find(r => r.id === foodItem.restaurantId);
      if (!restaurant) return state;

      const customizationPrice = customizations.reduce((sum, c) =>
        sum + c.selectedOptions.reduce((s, o) => s + o.price, 0), 0
      );
      const itemTotalPrice = (foodItem.price + customizationPrice) * quantity;

      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        foodItem,
        quantity,
        selectedCustomizations: customizations,
        specialInstructions,
        totalPrice: itemTotalPrice,
      };

      // If cart has items from different restaurant, clear and start fresh
      if (state.cart && state.cart.restaurantId !== foodItem.restaurantId) {
        const subtotal = itemTotalPrice;
        const deliveryFee = 40;
        const platformFee = 10;
        const taxes = Math.round(subtotal * 0.05);
        return {
          ...state,
          cart: {
            restaurantId: foodItem.restaurantId || 'rest-1',
            restaurantName: restaurant.name || 'BIRIMOHALLA',
            items: [newCartItem],
            subtotal, deliveryFee, platformFee, taxes, discount: 0, total: subtotal + deliveryFee + platformFee + taxes,
          },
          showCartNotification: true,
        };
      }

      const items = state.cart ? [...state.cart.items, newCartItem] : [newCartItem];
      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryFee = subtotal >= 250 ? 0 : 40;
      const platformFee = 10;
      const taxes = Math.round(subtotal * 0.05);
      const discount = state.cart?.discount || 0;

      return {
        ...state,
        cart: {
          restaurantId: foodItem.restaurantId || 'rest-1',
          restaurantName: restaurant.name || 'BIRIMOHALLA',
          items, subtotal, deliveryFee, platformFee, taxes, discount,
          couponCode: state.cart?.couponCode,
          total: subtotal + deliveryFee + platformFee + taxes - discount,
        },
        showCartNotification: true,
      };
    }

    case 'UPDATE_CART_QUANTITY': {
      if (!state.cart) return state;
      const items = state.cart.items.map(item => {
        if (item.id === action.payload.cartItemId) {
          const customizationPrice = item.selectedCustomizations.reduce((sum, c) =>
            sum + c.selectedOptions.reduce((s, o) => s + o.price, 0), 0
          );
          return { ...item, quantity: action.payload.quantity, totalPrice: (item.foodItem.price + customizationPrice) * action.payload.quantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      if (items.length === 0) return { ...state, cart: null };

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryFee = subtotal >= 250 ? 0 : 40;
      const platformFee = 10;
      const taxes = Math.round(subtotal * 0.05);

      return {
        ...state,
        cart: { ...state.cart, items, subtotal, deliveryFee, platformFee, taxes, total: subtotal + deliveryFee + platformFee + taxes - state.cart.discount },
      };
    }

    case 'REMOVE_FROM_CART': {
      if (!state.cart) return state;
      const items = state.cart.items.filter(item => item.id !== action.payload);
      if (items.length === 0) return { ...state, cart: null };
      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryFee = subtotal >= 250 ? 0 : 40;
      const platformFee = 10;
      const taxes = Math.round(subtotal * 0.05);
      return {
        ...state,
        cart: { ...state.cart, items, subtotal, deliveryFee, platformFee, taxes, total: subtotal + deliveryFee + platformFee + taxes - state.cart.discount },
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: null };

    case 'APPLY_COUPON': {
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          couponCode: action.payload.code,
          discount: action.payload.discount,
          total: state.cart.subtotal + state.cart.deliveryFee + state.cart.platformFee + state.cart.taxes - action.payload.discount,
        },
      };
    }

    case 'REMOVE_COUPON': {
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          couponCode: undefined,
          discount: 0,
          total: state.cart.subtotal + state.cart.deliveryFee + state.cart.platformFee + state.cart.taxes,
        },
      };
    }

    case 'TOGGLE_FAVORITE': {
      const favs = state.favoriteRestaurants.includes(action.payload)
        ? state.favoriteRestaurants.filter(id => id !== action.payload)
        : [...state.favoriteRestaurants, action.payload];
      return { ...state, favoriteRestaurants: favs };
    }

    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: null };

    case 'UPDATE_ORDER_STATUS': {
      const orders = state.orders.map(order => {
        if (order.id === action.payload.orderId) {
          return { ...order, status: action.payload.status };
        }
        return order;
      });
      return { ...state, orders };
    }

    case 'SET_RESTAURANT_STATUS':
      return { ...state, restaurantOnlineStatus: action.payload };

    case 'SET_DELIVERY_STATUS':
      return { ...state, deliveryOnlineStatus: action.payload };

    case 'SHOW_LOGIN_MODAL':
      return { ...state, showLoginModal: action.payload };

    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload.message, toastType: action.payload.type };

    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };

    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] };

    case 'REMOVE_ADDRESS':
      return { ...state, addresses: state.addresses.filter(a => a.id !== action.payload) };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
