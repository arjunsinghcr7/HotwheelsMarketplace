// "My Collection" is the user's personal set of cars (photos + price listings).
// It is stored in the browser's localStorage so it persists per-device and works
// on Vercel without a backend database. Images are stored inline as resized
// data URLs (see fileToDataURL) to keep within localStorage's ~5MB budget.

export interface MyCar {
  id: string;
  name: string;
  price: number;
  rarityLevel: string;
  releaseYear?: number;
  image: string; // data URL or remote URL
  notes?: string;
}

const STORAGE_KEY = 'hw_my_collection';

export function getMyCollection(): MyCar[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(cars: MyCar[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

export function addMyCar(car: Omit<MyCar, 'id'>): MyCar[] {
  const next: MyCar = { ...car, id: `mc_${Date.now()}` };
  const cars = [next, ...getMyCollection()];
  persist(cars);
  return cars;
}

export function deleteMyCar(id: string): MyCar[] {
  const cars = getMyCollection().filter((c) => c.id !== id);
  persist(cars);
  return cars;
}

export function clearMyCollection(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ---- Watchlist (cars the user is tracking the price of) --------------------

export interface WatchItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  rarityLevel: string;
  releaseYear?: number;
}

const WATCHLIST_KEY = 'hw_watchlist';

export function getWatchlist(): WatchItem[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addWatch(item: Omit<WatchItem, 'id'>): WatchItem[] {
  const next: WatchItem = { ...item, id: `w_${Date.now()}` };
  const list = [next, ...getWatchlist()];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  return list;
}

export function removeWatch(id: string): WatchItem[] {
  const list = getWatchlist().filter((w) => w.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  return list;
}

export function clearWatchlist(): void {
  localStorage.removeItem(WATCHLIST_KEY);
}

// True if a car (matched by name) is already on the watchlist/wishlist.
export function isWatched(name: string): boolean {
  return getWatchlist().some((w) => w.name === name);
}

// Add to the watchlist if absent, otherwise remove it — drives the heart toggle.
export function toggleWatch(item: Omit<WatchItem, 'id'>): WatchItem[] {
  const existing = getWatchlist().find((w) => w.name === item.name);
  if (existing) return removeWatch(existing.id);
  return addWatch(item);
}

// ---- Shopping cart ---------------------------------------------------------
// Stored in localStorage; keyed by the catalog/collectible id. The cart drawer
// and checkout (later phase) read from here.

export interface CartItem {
  id: string; // catalog id
  name: string;
  brand: string;
  price: number;
  image: string;
  rarityLevel: string;
  qty: number;
}

const CART_KEY = 'hw_cart';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]): CartItem[] {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += qty;
    return persistCart([...cart]);
  }
  return persistCart([{ ...item, qty }, ...cart]);
}

export function setCartQty(id: string, qty: number): CartItem[] {
  if (qty <= 0) return removeFromCart(id);
  return persistCart(getCart().map((c) => (c.id === id ? { ...c, qty } : c)));
}

export function removeFromCart(id: string): CartItem[] {
  return persistCart(getCart().filter((c) => c.id !== id));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function cartCount(): number {
  return getCart().reduce((n, c) => n + c.qty, 0);
}

// Read an image File and return a downscaled JPEG data URL so large photos do
// not blow past the localStorage quota.
export function fileToDataURL(file: File, maxWidth = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback: use the original data URL if canvas is unavailable
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
