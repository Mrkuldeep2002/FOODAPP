import { Restaurant, Category, MenuItem, Coupon, Order, DeliveryPartner, User, DeliveryRequest, Earning, Review, Address } from '../types';

export const mockCategories: Category[] = [
  { id: 'cat-biryani', name: 'Biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-pizza', name: 'Pizza & Italian', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-burger', name: 'Burgers & Fries', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-north', name: 'North Indian', icon: '🥘', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-chinese', name: 'Chinese & Asian', icon: '🍜', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-south', name: 'South Indian', icon: '🥞', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-veg', name: 'Pure Veg & Thali', icon: '🥗', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-dessert', name: 'Desserts & Cakes', icon: '🍨', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80' },
];

export const foodCategories = mockCategories;

export const mockSignatureDishes = [
  {
    id: 'sig-1',
    name: 'Mutton Biryani',
    restaurantName: 'BIRIMOHALLA',
    originalPrice: 410,
    price: 360,
    rating: 4.8,
    isVeg: false,
    bgTint: 'bg-brand-olive-light',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sig-2',
    name: 'Cheesy Loaded Pizza',
    restaurantName: 'Oven Story Pizza',
    originalPrice: 380,
    price: 299,
    rating: 4.7,
    isVeg: true,
    bgTint: 'bg-brand-red-light',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sig-3',
    name: 'Kadai Chicken Curry',
    restaurantName: 'Royal Spice Kitchen',
    originalPrice: 320,
    price: 260,
    rating: 4.6,
    isVeg: false,
    bgTint: 'bg-brand-sand',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  }
];

export const mockMenuItems: MenuItem[] = [
  // Birimohalla Items
  {
    id: 'm1',
    restaurantId: 'rest-1',
    name: 'Mutton Biryani',
    description: 'Aromatic basmati rice cooked with tender mutton & secret Andhra spices.',
    price: 360,
    originalPrice: 410,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
    category: 'biryani',
    categoryId: 'biryani',
    isVeg: false,
    isBestseller: true,
    rating: 4.8,
    ratingCount: 1420,
    preparationTime: '25 min',
  },
  {
    id: 'm2',
    restaurantId: 'rest-1',
    name: 'Chicken Biryani',
    description: 'Flavorful chicken cooked with fragrant rice & spicy Andhra curry.',
    price: 220,
    originalPrice: 260,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    category: 'biryani',
    categoryId: 'biryani',
    isVeg: false,
    isBestseller: true,
    rating: 4.7,
    ratingCount: 2350,
    preparationTime: '20 min',
  },
  {
    id: 'm3',
    restaurantId: 'rest-1',
    name: 'Paneer Biryani',
    description: 'Soft paneer cubes cooked with fragrant rice, saffron & whole spices.',
    price: 200,
    originalPrice: 230,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    category: 'biryani',
    categoryId: 'biryani',
    isVeg: true,
    isBestseller: false,
    rating: 4.5,
    ratingCount: 890,
    preparationTime: '20 min',
  },

  // Oven Story Pizza Items
  {
    id: 'm4',
    restaurantId: 'rest-2',
    name: 'Four Cheese Margherita Pizza',
    description: 'Loaded with Mozzarella, Cheddar, Gouda and Cream Cheese on thin crust.',
    price: 299,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    category: 'pizza',
    categoryId: 'pizza',
    isVeg: true,
    isBestseller: true,
    rating: 4.7,
    ratingCount: 1840,
    preparationTime: '25 min',
  },
  {
    id: 'm5',
    restaurantId: 'rest-2',
    name: 'Fiery Chicken Supreme Pizza',
    description: 'Smoky grilled chicken, peri-peri drizzle, red paprika and jalapeños.',
    price: 389,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    category: 'pizza',
    categoryId: 'pizza',
    isVeg: false,
    isBestseller: true,
    rating: 4.8,
    ratingCount: 1250,
    preparationTime: '25 min',
  },

  // Burger Bistro Items
  {
    id: 'm6',
    restaurantId: 'rest-3',
    name: 'Double Cheese Crunch Burger',
    description: 'Crispy patty, double cheddar slice, caramelized onions & secret house sauce.',
    price: 189,
    originalPrice: 240,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'burger',
    categoryId: 'burger',
    isVeg: true,
    isBestseller: true,
    rating: 4.6,
    ratingCount: 940,
    preparationTime: '15 min',
  },
  {
    id: 'm7',
    restaurantId: 'rest-3',
    name: 'Smoky BBQ Chicken Burger',
    description: 'Juicy chicken patty brushed with hickory BBQ sauce & crispy onion rings.',
    price: 219,
    originalPrice: 270,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    category: 'burger',
    categoryId: 'burger',
    isVeg: false,
    isBestseller: false,
    rating: 4.5,
    ratingCount: 680,
    preparationTime: '15 min',
  },

  // Royal Spice Kitchen Items
  {
    id: 'm8',
    restaurantId: 'rest-4',
    name: 'Butter Chicken Special',
    description: 'Tender tandoori chicken simmered in rich creamy tomato and butter gravy.',
    price: 320,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    category: 'curries',
    categoryId: 'curries',
    isVeg: false,
    isBestseller: true,
    rating: 4.9,
    ratingCount: 3120,
    preparationTime: '25 min',
  },
  {
    id: 'm9',
    restaurantId: 'rest-4',
    name: 'Dal Makhani & Garlic Naan Combo',
    description: 'Slow-cooked black lentils with 2 butter garlic naans.',
    price: 240,
    originalPrice: 290,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    category: 'north',
    categoryId: 'north',
    isVeg: true,
    isBestseller: true,
    rating: 4.7,
    ratingCount: 1980,
    preparationTime: '20 min',
  },

  // Wok & Roll Asian
  {
    id: 'm10',
    restaurantId: 'rest-5',
    name: 'Hakka Noodles & Manchurian Combo',
    description: 'Wok tossed veg noodles served with hot fried garlic Manchurian gravy.',
    price: 210,
    originalPrice: 260,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    category: 'chinese',
    categoryId: 'chinese',
    isVeg: true,
    isBestseller: true,
    rating: 4.6,
    ratingCount: 850,
    preparationTime: '20 min',
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'BIRIMOHALLA',
    tagline: 'TASTE OF ANDHRA',
    cuisine: ['Andhra', 'Biryani', 'South Indian'],
    rating: 4.8,
    ratingCount: 3850,
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    minOrder: 150,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    address: 'Raja Park, Jaipur',
    isOpen: true,
    isPureVeg: false,
    featured: true,
    discountText: '20% OFF (Code: BIRI20)',
    tags: ['Bestseller', 'Top Rated', 'Express'],
    distance: '1.2 km',
    priceRange: '₹250 for two',
    offer: '20% OFF (BIRI20)',
    categories: [
      { id: 'biryani', name: 'Biryani Specials', items: mockMenuItems.filter(i => i.restaurantId === 'rest-1') },
    ],
  },
  {
    id: 'rest-2',
    name: 'Oven Story Pizza',
    tagline: 'Standout Pizzas with 4 Cheese Bases',
    cuisine: ['Pizza', 'Italian', 'Pasta', 'Desserts'],
    rating: 4.7,
    ratingCount: 2940,
    deliveryTime: '25-30 min',
    deliveryFee: 0,
    minOrder: 200,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=200&q=80',
    address: 'Malviya Nagar, Jaipur',
    isOpen: true,
    isPureVeg: false,
    featured: true,
    discountText: 'FLAT ₹125 OFF',
    tags: ['Super Offers', 'Top Rated'],
    distance: '2.4 km',
    priceRange: '₹350 for two',
    offer: 'FLAT ₹125 OFF',
    categories: [
      { id: 'pizza', name: 'Signature Pizzas', items: mockMenuItems.filter(i => i.restaurantId === 'rest-2') },
    ],
  },
  {
    id: 'rest-3',
    name: 'Burger Bistro & Shack',
    tagline: 'Gourmet Smash Burgers & Shakes',
    cuisine: ['Burgers', 'American', 'Fast Food', 'Shakes'],
    rating: 4.6,
    ratingCount: 1820,
    deliveryTime: '15-20 min',
    deliveryFee: 25,
    minOrder: 149,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80',
    address: 'C-Scheme, Jaipur',
    isOpen: true,
    isPureVeg: false,
    featured: true,
    discountText: 'BUY 1 GET 1 FREE',
    tags: ['Fastest Delivery'],
    distance: '1.8 km',
    priceRange: '₹200 for two',
    offer: 'BOGO Offer',
    categories: [
      { id: 'burger', name: 'Smash Burgers', items: mockMenuItems.filter(i => i.restaurantId === 'rest-3') },
    ],
  },
  {
    id: 'rest-4',
    name: 'Royal Spice Kitchen',
    tagline: 'Authentic Mughlai & North Indian Curries',
    cuisine: ['North Indian', 'Mughlai', 'Kebabs', 'Thali'],
    rating: 4.9,
    ratingCount: 4500,
    deliveryTime: '25-30 min',
    deliveryFee: 0,
    minOrder: 250,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    address: 'MI Road, Jaipur',
    isOpen: true,
    isPureVeg: false,
    featured: true,
    discountText: '20% OFF up to ₹100',
    tags: ['Must Try', 'Top Rated'],
    distance: '3.1 km',
    priceRange: '₹400 for two',
    offer: '20% OFF',
    categories: [
      { id: 'curries', name: 'Curry Specials', items: mockMenuItems.filter(i => i.restaurantId === 'rest-4') },
    ],
  },
  {
    id: 'rest-5',
    name: 'Wok & Roll Pan Asian',
    tagline: 'Authentic Dim Sums, Noodles & Soups',
    cuisine: ['Chinese', 'Asian', 'Thai', 'Noodles'],
    rating: 4.5,
    ratingCount: 1150,
    deliveryTime: '20-25 min',
    deliveryFee: 30,
    minOrder: 180,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80',
    address: 'Vaishali Nagar, Jaipur',
    isOpen: true,
    isPureVeg: false,
    featured: false,
    discountText: '15% OFF',
    tags: ['Express'],
    distance: '4.2 km',
    priceRange: '₹300 for two',
    offer: '15% OFF',
    categories: [
      { id: 'chinese', name: 'Wok Noodles & Rice', items: mockMenuItems.filter(i => i.restaurantId === 'rest-5') },
    ],
  },
  {
    id: 'rest-6',
    name: 'Green Bowl Pure Veg',
    tagline: '100% Pure Veg Rajasthani & North Indian Thalis',
    cuisine: ['Pure Veg', 'Rajasthani', 'North Indian', 'Thali'],
    rating: 4.8,
    ratingCount: 3200,
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    minOrder: 150,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80',
    address: 'Bapu Nagar, Jaipur',
    isOpen: true,
    isPureVeg: true,
    featured: true,
    discountText: 'FREE Delivery',
    tags: ['100% Pure Veg', 'Top Rated'],
    distance: '1.5 km',
    priceRange: '₹250 for two',
    offer: 'FREE Delivery',
    categories: [],
  }
];

export const restaurants = mockRestaurants;

export const mockCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'BIRI20',
    description: 'Get 20% OFF on Birimohalla orders',
    discountPercentage: 20,
    maxDiscount: 100,
    minOrderAmount: 150,
    minOrder: 150,
    status: 'active',
    discountType: 'percentage',
    discountValue: 20,
  },
  {
    id: 'c2',
    code: 'SWIGGY50',
    description: 'Flat 50 OFF on orders above ₹199',
    discountAmount: 50,
    minOrderAmount: 199,
    minOrder: 199,
    maxDiscount: 50,
    status: 'active',
    discountType: 'flat',
    discountValue: 50,
  },
  {
    id: 'c3',
    code: 'FREEDEL',
    description: 'Free Delivery on your favorite dishes',
    discountAmount: 40,
    minOrderAmount: 149,
    minOrder: 149,
    maxDiscount: 40,
    status: 'active',
    discountType: 'flat',
    discountValue: 40,
  }
];

export const mockUsers: User[] = [
  {
    id: 'cust-1',
    name: 'Kuldeep Sharma',
    email: 'kuldeep@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'RF-84729',
    customerId: 'cust-1',
    customerName: 'Kuldeep Sharma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Royal Residency, Raja Park, Jaipur',
    restaurantId: 'rest-1',
    restaurantName: 'BIRIMOHALLA - Taste of Andhra',
    items: [
      { id: 'm1', name: 'Mutton Biryani', price: 360, quantity: 1, isVeg: false },
      { id: 'm2', name: 'Chicken Biryani', price: 220, quantity: 1, isVeg: false },
    ],
    itemTotal: 580,
    deliveryFee: 0,
    taxes: 29,
    discount: 116,
    grandTotal: 493,
    total: 493,
    statusTimeline: [
      { status: 'placed', label: 'Order Placed', time: '12:15 PM', isCompleted: true, isActive: false },
      { status: 'confirmed', label: 'Accepted by Restaurant', time: '12:16 PM', isCompleted: true, isActive: false },
      { status: 'preparing', label: 'Preparing Food', time: '12:20 PM', isCompleted: true, isActive: false },
      { status: 'on_the_way', label: 'Out for Delivery', time: '12:30 PM', isCompleted: true, isActive: true },
      { status: 'delivered', label: 'Delivered', time: 'Est. 12:45 PM', isCompleted: false, isActive: false }
    ],
    status: 'on_the_way',
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedDeliveryTime: '2026-09-28T12:35:00.000Z',
    deliveryPartnerId: 'dp-1',
    deliveryPartnerName: 'Ramesh Kumar',
    deliveryPartnerPhone: '+91 98290 12345',
  }
];

export const mockDeliveryPartners: DeliveryPartner[] = [
  {
    id: 'dp-1',
    name: 'Ramesh Kumar',
    phone: '+91 98290 12345',
    email: 'ramesh.delivery@example.com',
    vehicleType: 'bike',
    vehicleNumber: 'RJ-14-EA-4920',
    isOnline: true,
    currentOrder: 'ord-101',
    rating: 4.8,
    totalDeliveries: 482,
    todayEarnings: 840,
    todayDeliveries: 12,
    joiningDate: '2024-03-15',
    status: 'active',
  }
];

export const mockDeliveryRequests: DeliveryRequest[] = [
  {
    id: 'req-1',
    orderId: 'ord-102',
    restaurantName: 'BIRIMOHALLA',
    restaurantAddress: 'Raja Park, Jaipur',
    customerAddress: 'C-Scheme, Jaipur',
    distance: '3.2 km',
    estimatedEarnings: 65,
    earning: 65,
    estimatedTime: '15 min',
    items: 3,
    itemsCount: 3,
    orderAmount: 480,
  }
];

export const mockEarnings: Earning[] = [
  { date: '2026-09-28', baseEarnings: 500, distanceBonus: 120, peakBonus: 100, tips: 120, total: 840, deliveries: 12 },
  { date: '2026-09-27', baseEarnings: 450, distanceBonus: 100, peakBonus: 80, tips: 90, total: 720, deliveries: 10 },
  { date: '2026-09-26', baseEarnings: 520, distanceBonus: 140, peakBonus: 110, tips: 140, total: 910, deliveries: 14 },
];

export const mockReviews: Review[] = [
  { id: 'r1', restaurantId: 'rest-1', customerName: 'Aman S.', userName: 'Aman S.', rating: 5, review: 'Best Biryani in town! Tender mutton & super authentic spices.', comment: 'Best Biryani in town! Tender mutton & super authentic spices.', date: 'Today' }
];

export const revenueChartData = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 15400 },
  { name: 'Wed', revenue: 18900 },
  { name: 'Thu', revenue: 22100 },
  { name: 'Fri', revenue: 28400 },
];

export const monthlyRevenueData = [
  { name: 'Jan', revenue: 240000 },
  { name: 'Feb', revenue: 290000 },
  { name: 'Mar', revenue: 350000 },
];

export const customerGrowthData = [
  { name: 'Jan', users: 1200 },
  { name: 'Feb', users: 2400 },
  { name: 'Mar', users: 3800 },
];

export const orderStatusData = [
  { name: 'Delivered', value: 85 },
  { name: 'Preparing', value: 10 },
  { name: 'Cancelled', value: 5 },
];

export const mockTransactions = [
  { id: 'txn-1', type: 'Payout', amount: 1540, status: 'Success', date: 'Today, 2:30 PM' }
];

export const mockWhyChooseUs = [
  { id: '1', title: 'Free Delivery', subtitle: 'On orders above ₹250', icon: '🛵' },
  { id: '2', title: 'Secure Payment', subtitle: '100% secure & safe', icon: '🛡️' },
  { id: '3', title: 'Easy Returns', subtitle: 'Hassle-free returns', icon: '🔄' },
  { id: '4', title: '24/7 Support', subtitle: "We're here for you", icon: '🎧' },
];

export const adminStats = {
  totalOrders: 1420,
  totalRevenue: 584000,
  totalCustomers: 3800,
  totalRestaurants: 42,
  totalDeliveryPartners: 128,
  pendingApprovals: 5,
  activeOrders: 18,
  todayOrders: 142,
  todayRevenue: 48500,
};

export const mockAddresses: Address[] = [
  { id: 'addr-1', label: 'Home', address: 'Flat 402, Royal Residency, Raja Park, Jaipur', type: 'home', isDefault: true },
  { id: 'addr-2', label: 'Work', address: 'IT Park, Tower B, C-Scheme, Jaipur', type: 'work', isDefault: false },
];
