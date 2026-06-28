// User settings + mock account data, stored locally in the browser. Covers
// preferences, notifications, wishlist options, collector preferences,
// addresses, payment methods and order history.

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  zip: string;
  country: string;
}

export interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  exp: string;
}

export interface Order {
  id: string;
  date: string; // ISO
  items: { name: string; price: number; qty: number; image: string }[];
  total: number;
}

export interface Settings {
  preferences: { currency: string; language: string; region: string };
  notifications: {
    priceDrops: boolean;
    newArrivals: boolean;
    orderUpdates: boolean;
    newsletter: boolean;
    communityReplies: boolean;
  };
  wishlist: { notifyPriceDrop: boolean; publicWishlist: boolean };
  security: { twoFactor: boolean };
  collector: {
    favoriteBrands: string[];
    preferredRarity: string;
    budgetMax: number;
    focus: string; // e.g. JDM, Hypercars
    goal: string;
  };
  addresses: Address[];
  payments: PaymentCard[];
}

export const DEFAULT_SETTINGS: Settings = {
  preferences: { currency: 'USD', language: 'English', region: 'United States' },
  notifications: {
    priceDrops: true,
    newArrivals: true,
    orderUpdates: true,
    newsletter: false,
    communityReplies: true,
  },
  wishlist: { notifyPriceDrop: true, publicWishlist: false },
  security: { twoFactor: false },
  collector: {
    favoriteBrands: [],
    preferredRarity: 'Any',
    budgetMax: 150,
    focus: 'Everything',
    goal: '',
  },
  addresses: [],
  payments: [],
};

const KEY = 'hw_settings';
const ORDERS_KEY = 'hw_orders';

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    // shallow-merge each section over defaults so new fields always exist
    return {
      preferences: { ...DEFAULT_SETTINGS.preferences, ...parsed.preferences },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
      wishlist: { ...DEFAULT_SETTINGS.wishlist, ...parsed.wishlist },
      security: { ...DEFAULT_SETTINGS.security, ...parsed.security },
      collector: { ...DEFAULT_SETTINGS.collector, ...parsed.collector },
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(s: Settings): Settings {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore storage failures
  }
  return s;
}

// ---- Order history ---------------------------------------------------------

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addOrder(order: Omit<Order, 'id' | 'date'>): Order[] {
  const next: Order = { ...order, id: `ord_${Date.now()}`, date: new Date().toISOString() };
  const orders = [next, ...getOrders()];
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage failures
  }
  return orders;
}
