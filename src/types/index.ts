// ============================================
// Core Types for RasaFlow / Birimohalla Food Delivery Platform
// ============================================

export interface Location {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'restaurant' | 'delivery' | 'admin';
  joinedDate?: string;
  status?: 'active' | 'blocked' | 'pending';
}

export interface Restaurant {
  id: string;
  name: string;
  tagline?: string;
  image: string;
  logo: string;
  cuisine: string[];
  rating: number;
  totalRatings?: number;
  ratingCount?: number;
  deliveryTime: string;
  distance?: string;
  priceRange?: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹' | string;
  isOpen: boolean;
  isFavorite?: boolean;
  offer?: string;
  address: string;
  phone?: string;
  categories: MenuCategory[];
  deliveryFee?: number;
  minOrder?: number;
  isPureVeg?: boolean;
  featured?: boolean;
  discountText?: string;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  rating?: number;
  totalRatings?: number;
  ratingCount?: number;
  isBestseller?: boolean;
  isAvailable?: boolean;
  prepTime?: string;
  preparationTime?: string;
  categoryId?: string;
  category?: string;
  restaurantId?: string;
  customizations?: Customization[];
}

export type MenuItem = FoodItem;

export interface Customization {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  selectedOptions: CustomizationOption[];
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  couponCode?: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  items: any[];
  subtotal?: number;
  itemTotal?: number;
  deliveryFee: number;
  platformFee?: number;
  taxes: number;
  discount: number;
  total: number;
  grandTotal?: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  status: OrderStatus;
  statusTimeline: StatusTimelineItem[];
  estimatedDelivery?: string;
  estimatedDeliveryTime?: string;
  deliveryInstructions?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt?: string;
  otp?: string;
}

export interface OrderItem {
  id?: string;
  foodItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: string;
  isVeg: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'rider_assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface StatusTimelineItem {
  status: OrderStatus;
  label: string;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  vehicle?: string;
  vehicleType?: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  kycStatus?: 'verified' | 'pending' | 'rejected';
  todayEarnings: number;
  todayDeliveries?: number;
  currentLocation?: { lat: number; lng: number };
  joinedDate?: string;
  joiningDate?: string;
  currentOrder?: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerAddress: string;
  distance: string;
  estimatedEarnings: number;
  earning?: number;
  estimatedTime: string;
  items: number;
  itemsCount?: number;
  orderAmount: number;
}

export interface Earning {
  date: string;
  baseEarnings?: number;
  distanceBonus?: number;
  peakBonus?: number;
  tips?: number;
  total: number;
  amount?: number;
  deliveries?: number;
  [key: string]: any;
}

export interface Coupon {
  id?: string;
  code: string;
  description: string;
  discountType?: 'percentage' | 'fixed' | 'flat';
  discountValue?: number;
  discountPercentage?: number;
  discountAmount?: number;
  minOrder: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  expiryDate?: string;
  status?: 'active' | 'expired' | 'disabled';
}

export interface Review {
  id: string;
  customerId?: string;
  userName?: string;
  customerName?: string;
  customerAvatar?: string;
  restaurantId?: string;
  restaurantName?: string;
  orderId?: string;
  rating: number;
  review?: string;
  comment?: string;
  date: string;
  status?: 'visible' | 'hidden' | 'flagged';
}

export interface Address {
  id: string;
  label: string;
  address: string;
  landmark?: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  orderId?: string;
  customerName?: string;
  amount: number;
  paymentMethod?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'Success';
  date: string;
  type: 'payment' | 'refund' | 'Payout';
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  icon?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalRestaurants: number;
  totalDeliveryPartners: number;
  pendingApprovals: number;
  activeOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
