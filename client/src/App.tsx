import { useState, useEffect } from 'react';
import { formatPrice } from './utils/format';
import { Toaster, toast } from './utils/toast';
import { BackToTop } from './components/BackToTop';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VaultDiscoveryForm } from './components/VaultDiscoveryForm';
import { FeaturedCard } from './components/FeaturedCard';
import { RecentListings } from './components/RecentListings';
import { DealsSection } from './components/DealsSection';
import { MarketChart } from './components/MarketChart';
import { RarityGauge } from './components/RarityGauge';
import { LiveTicker } from './components/LiveTicker';
import { HistoryModal } from './components/HistoryModal';
import { CollectionGallery } from './components/CollectionGallery';
import { CollectionAnalysis } from './components/CollectionAnalysis';
import { MarketAds } from './components/MarketAds';
import { CommunityBoard } from './components/CommunityBoard';
import { WatchlistCard } from './components/WatchlistCard';
import { AIAssistant } from './components/AIAssistant';
import { SettingsModal } from './components/SettingsModal';
import type { CarFormData } from './components/VaultDiscoveryForm';
import {
  fetchCollectibles,
  fetchDeals,
  fetchStats,
  addCollectible,
  deleteCollectible
} from './services/api';
import type {
  Collectible,
  Deal,
  Stats
} from './services/api';
import type { MyCar, WatchItem, CartItem } from './services/collection';
import {
  getMyCollection, addMyCar, deleteMyCar, clearMyCollection,
  getWatchlist, addWatch, removeWatch, clearWatchlist,
  addToCart, toggleWatch, getCart, setCartQty, removeFromCart, clearCart
} from './services/collection';
import { HomePage } from './components/HomePage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { initTheme } from './services/theme';

// Default images used for cars added without an uploaded photo.
const STH_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTb2T8AcPKiNvWwjgdmpDF9zMLcpRoZmfuUZJAWwZnIWFFwrfp0EWmJoGPupIFS3aGdAZ-XXOFSxQ7ebaFVs8kvREsZxHGjsKZn5GLTBAU9ROjgn6JBuxMLrAp_3SnMegJZELKkT-x_21iVHoi-nyoEHQQpNFXEwdLKcncc8pKXKSoc7jZw7FXCXvIo-ee74mSRPG_OEzK1asa9FLPAwq7plDgpNojbnyRrHGyQG9Ljw9QVolvN4sBuUJmlE8zmX8ua7gk5Df2dKvm';
const DEFAULT_CAR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAjh6jyreGcOpuQAa9epE6zgxjUH4EfAj3etQwtv9LmW_2C4C4R33WoqYzCiXk0jrXSHWAhgc9vZQVlqUreyVVSem4CAOU7S7gpVwYsHuY3U2mTX8rc9T-o8o-kLsotwy1apmQnwt3BHOvWiOx65Gmc55F7w2TmWuyel5JokjJLd1cstF9vknPt7pLJJALbOZYWQFYV1j9LwbpDVhS5oEFaIgI3KhcKqG2837zSRkQCzPl90VFQFCa0FNd5u53G1TL1j8Lin_MUay4';
const pickImage = (rarityLevel: string) => (rarityLevel === 'Super Treasure Hunt' ? STH_IMAGE : DEFAULT_CAR_IMAGE);

// Shown as the hero "Premium Listing" whenever no specific item is selected.
const DEFAULT_FEATURED: Collectible = {
  id: 'default-porsche-gt3rs',
  name: 'Porsche 911 GT3 RS',
  brand: 'Hot Wheels',
  vehicleType: 'Exotic',
  scale: '1:64',
  condition: 'Mint (M)',
  releaseYear: 2023,
  price: 149.99,
  rarityLevel: 'Super Treasure Hunt',
  series: 'HW Premium Exotics',
  image: '/cars/06-porsche-911-gt3-rs.jpg',
  notes: 'Track-bred flat-six icon in GT Silver with the signature swan-neck rear wing. Premium Spectraflame finish, Real Rider tires. Serial #001/250.',
  isFeatured: true,
  demandScore: 99,
};

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeMenu, setActiveMenu] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // API Data states
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [featuredItem, setFeaturedItem] = useState<Collectible | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User's personal collection + price watchlist + cart (stored locally)
  const [myCollection, setMyCollection] = useState<MyCar[]>([]);
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Chart timeframe state
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '1Y'>('1M');
  
  // Modal states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRarityGuideOpen, setIsRarityGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Vault Discovery is now a slide-in drawer; the launcher remembers which
  // action (Buy / Sell / Track) the user intends so the form can highlight it.
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAction, setFormAction] = useState<'buy' | 'sell' | 'track'>('buy');
  const openForm = (action: 'buy' | 'sell' | 'track') => {
    setFormAction(action);
    setIsFormOpen(true);
  };

  // Load database items on start
  const loadData = async () => {
    try {
      const colData = await fetchCollectibles();
      setCollectibles(colData);
      
      const dealsData = await fetchDeals();
      setDeals(dealsData);
      
      const statsData = await fetchStats();
      setStats(statsData);

      // Set default featured item (Mustang on startup or first item)
      if (colData.length > 0) {
        const featured = colData.find(item => item.isFeatured) || colData[0];
        setFeaturedItem(featured);
      }
    } catch (error) {
      console.error('Failed to load database content', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initTheme();
    loadData();
    setMyCollection(getMyCollection());
    setWatchlist(getWatchlist());
    setCart(getCart());
  }, []);

  // Searching from the homepage jumps to the marketplace where results show.
  useEffect(() => {
    if (searchQuery.trim() && activeMenu === 'Home') {
      setActiveTab('Marketplace');
      setActiveMenu('Marketplace');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleClearCollection = () => {
    clearMyCollection();
    setMyCollection([]);
  };

  const handleClearWatchlist = () => {
    clearWatchlist();
    setWatchlist([]);
  };

  const handleAddMyCar = (car: Omit<MyCar, 'id'>) => {
    setMyCollection(addMyCar(car));
  };

  const handleDeleteMyCar = (id: string) => {
    setMyCollection(deleteMyCar(id));
  };

  // "Sell" — list the entered car on the marketplace.
  const handleSellCar = async (formData: CarFormData) => {
    await addCollectible({ ...formData, image: pickImage(formData.rarityLevel) });
    // Reload items and update global stats
    await loadData();
    toast(`${formData.name} listed on the marketplace`, 'success');
  };

  // "Buy" — add the entered car to the user's personal collection.
  const handleBuyCar = (formData: CarFormData) => {
    handleAddMyCar({
      name: formData.name,
      price: formData.price,
      rarityLevel: formData.rarityLevel,
      releaseYear: formData.releaseYear,
      image: pickImage(formData.rarityLevel),
      notes: formData.notes || undefined,
    });
    toast(`${formData.name} added to your collection`, 'success');
  };

  // "Track" — add the entered car to the price watchlist.
  const handleTrackCar = (formData: CarFormData) => {
    setWatchlist(addWatch({
      name: formData.name,
      brand: formData.brand,
      price: formData.price,
      rarityLevel: formData.rarityLevel,
      releaseYear: formData.releaseYear,
    }));
    toast(`Now tracking ${formData.name}`, 'info');
  };

  const handleRemoveWatch = (id: string) => {
    setWatchlist(removeWatch(id));
  };

  // Add a marketplace car to the shopping cart.
  const handleAddToCart = (item: Collectible) => {
    setCart(
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        rarityLevel: item.rarityLevel,
      })
    );
    toast(`${item.name} added to cart`, 'success');
  };

  // Cart drawer open/close + line-item mutations.
  const handleOpenCart = () => setIsCartOpen(true);
  const handleCartQty = (id: string, qty: number) => setCart(setCartQty(id, qty));
  const handleCartRemove = (id: string) => {
    setCart(removeFromCart(id));
    toast('Removed from cart', 'info');
  };
  const handlePlaceOrder = () => {
    clearCart();
    setCart([]);
    toast('Order placed — thank you!', 'success');
  };

  // Wishlist drawer + "move to cart".
  const handleOpenWishlist = () => setIsWishlistOpen(true);
  const handleMoveToCart = (item: WatchItem) => {
    const match = collectibles.find((c) => c.name === item.name);
    setCart(
      addToCart({
        id: match?.id ?? `w-${item.id}`,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: match?.image ?? pickImage(item.rarityLevel),
        rarityLevel: item.rarityLevel,
      })
    );
    setWatchlist(removeWatch(item.id));
    toast(`${item.name} moved to cart`, 'success');
  };

  // Navbar "New Arrivals / Limited Editions / About / Contact" — scroll to the
  // matching homepage section (switching to Home first if needed).
  const handleNavigateSection = (sectionId: string) => {
    setActiveTab('Home');
    setActiveMenu('Home');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  // Toggle a car on the wishlist (the price watchlist) from a product card.
  const handleToggleWishlist = (item: Collectible) => {
    const wasSaved = watchlist.some((w) => w.name === item.name);
    setWatchlist(
      toggleWatch({
        name: item.name,
        brand: item.brand,
        price: item.price,
        rarityLevel: item.rarityLevel,
        releaseYear: item.releaseYear,
      })
    );
    toast(wasSaved ? `Removed ${item.name} from wishlist` : `Saved ${item.name} to wishlist`, wasSaved ? 'info' : 'success');
  };

  const handleDeleteCollectible = async (id: string) => {
    try {
      await deleteCollectible(id);
      // If the deleted item was featured, clear the selection
      setFeaturedItem((current) => (current?.id === id ? null : current));
      // Reload items and update global stats
      await loadData();
    } catch (error) {
      console.error('Failed to delete collectible', error);
    }
  };

  // Sync tab navigation with menu navigation
  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Home') {
      setActiveMenu('Home');
    } else if (tab === 'Marketplace') {
      setActiveMenu('Marketplace');
    } else if (tab === 'Collection') {
      setActiveMenu('My Collection');
    } else if (tab === 'Analytics') {
      setActiveMenu('Analytics');
    } else if (tab === 'Community') {
      setActiveMenu('Community');
    }
  };

  const handleSetMenu = (menu: string) => {
    setActiveMenu(menu);
    if (menu === 'Marketplace') {
      setActiveTab('Marketplace');
    } else if (menu === 'My Collection') {
      setActiveTab('Collection');
    } else if (menu === 'Analytics') {
      setActiveTab('Analytics');
    }
  };

  // Whether the user is actively searching (drives search-results UI + empty states)
  const isSearching = searchQuery.trim() !== '';

  // Filter collectibles based on active view and search query
  const filteredCollectibles = collectibles.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.series.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeMenu === 'My Collection') {
      // For demo, show only non-featured items in collection, or all items in collection
      return matchesSearch;
    }
    return matchesSearch;
  });

  // Fall back to the default Porsche premium listing when nothing is selected.
  const displayedFeatured = featuredItem || DEFAULT_FEATURED;

  // Vault stats reflect exactly the user's collection — nothing more, nothing less.
  const myTotalValue = myCollection.reduce((sum, c) => sum + c.price, 0);
  const myCount = myCollection.length;

  // Names currently on the wishlist — drives the heart toggle on product cards.
  const wishlistNames = new Set(watchlist.map((w) => w.name));

  return (
    <div className="h-screen flex flex-col bg-surface-dim text-on-surface select-none">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        onNavigateSection={handleNavigateSection}
        cartCount={cart.reduce((n, c) => n + c.qty, 0)}
        wishlistCount={watchlist.length}
        onOpenCart={handleOpenCart}
        onOpenWishlist={handleOpenWishlist}
      />
      
      <div className="flex h-full pt-16 pb-8 overflow-hidden">
        {/* Sidebar Left — hidden on the full-bleed Home landing */}
        {activeMenu !== 'Home' && (
          <Sidebar
            activeMenu={activeMenu}
            setActiveMenu={handleSetMenu}
            onOpenRarityGuide={() => setIsRarityGuideOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Main Workspace */}
        <main className={`flex-1 overflow-hidden ${activeMenu === 'Home' ? '' : 'ml-0 xl:ml-64'}`}>

        {activeMenu === 'Home' ? (
          <HomePage
            collectibles={collectibles}
            isLoading={isLoading}
            wishlistNames={wishlistNames}
            onSelect={(item) => { setFeaturedItem(item); handleSetTab('Marketplace'); }}
            onShop={() => handleSetTab('Marketplace')}
            onExplore={() => handleSetTab('Marketplace')}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : activeMenu === 'My Collection' ? (
          <CollectionGallery
            cars={myCollection}
            searchQuery={searchQuery}
            onAdd={handleAddMyCar}
            onDelete={handleDeleteMyCar}
          />
        ) : activeMenu === 'Analytics' ? (
          <CollectionAnalysis cars={myCollection} />
        ) : activeMenu === 'Community' ? (
          <CommunityBoard />
        ) : (
          <div className="h-full relative overflow-hidden">

          {/* Left-side Buy / Sell / Track launchers that open the Vault Discovery slide-in */}
          <div className="fixed bottom-24 left-4 xl:left-[17rem] z-30 flex items-center gap-2">
            <button
              onClick={() => openForm('buy')}
              title="Buy — add a car to your collection"
              className="flex items-center gap-1.5 pl-3 pr-4 py-3 rounded-full racing-gradient text-white font-bold shadow-xl hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="text-label-md">Buy</span>
            </button>
            <button
              onClick={() => openForm('sell')}
              title="Sell — list a car on the marketplace"
              className="flex items-center gap-1.5 pl-3 pr-4 py-3 rounded-full bg-surface-container-high text-secondary border border-secondary font-bold shadow-xl hover:bg-secondary/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">sell</span>
              <span className="text-label-md">Sell</span>
            </button>
            <button
              onClick={() => openForm('track')}
              title="Track — add a car to your watchlist"
              className="flex items-center gap-1.5 pl-3 pr-4 py-3 rounded-full bg-surface-container-high text-tertiary border border-tertiary font-bold shadow-xl hover:bg-tertiary/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">visibility</span>
              <span className="text-label-md">Track</span>
            </button>
          </div>

          {/* Main content (full width) */}
          <div id="market-scroll" className="h-full bg-background overflow-y-auto custom-scrollbar p-sm lg:p-lg flex flex-col gap-lg">

            {/* Back to top (scrolls this panel) */}
            <BackToTop targetId="market-scroll" />

            {/* Hero Featured & Key Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg animate-slide-up">
              <FeaturedCard
                item={displayedFeatured}
                onOpenHistory={() => setIsHistoryOpen(true)}
              />
              
              {/* Statistics Cluster */}
              <div className="space-y-md">
                <div className="glass-panel p-md rounded-xl">
                  <div className="flex justify-between items-start mb-sm">
                    <p className="text-label-sm text-on-surface-variant">Total Collection Value</p>
                    <span className="material-symbols-outlined text-secondary">payments</span>
                  </div>
                  <p className="text-headline-lg font-bold text-on-surface">
                    {formatPrice(myTotalValue)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">
                    Across {myCount} car{myCount === 1 ? '' : 's'} you own
                  </p>
                </div>
                
                <div className="glass-panel p-md rounded-xl">
                  <div className="flex justify-between items-start mb-sm">
                    <p className="text-label-sm text-on-surface-variant">Items in Vault</p>
                    <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
                  </div>
                  <p className="text-headline-lg font-bold text-on-surface">
                    {myCount.toLocaleString('en-US')}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    {myCount === 0 ? 'Add cars from the Vault Discovery form' : `Car${myCount === 1 ? '' : 's'} in your collection`}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Advertised cars available in the market — reflects the search query */}
            <MarketAds
              items={isSearching ? filteredCollectibles : collectibles}
              onSelect={setFeaturedItem}
              searchActive={isSearching}
              searchQuery={searchQuery}
            />

            {/* Market Chart & Gauge */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
              <MarketChart
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />
              
              <RarityGauge
                items={collectibles}
                totalUnitsCount={stats ? stats.itemsInVault : 1428}
              />
            </div>

            {/* Tracking watchlist (cars added via the Track button) */}
            <WatchlistCard items={watchlist} onRemove={handleRemoveWatch} />

            {/* Recent Listings */}
            <RecentListings
              items={filteredCollectibles}
              onSelectItem={setFeaturedItem}
              selectedItem={featuredItem}
              onDeleteCollectible={handleDeleteCollectible}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistNames={wishlistNames}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onBrowse={() => handleSetMenu('My Collection')}
            />
            
            {/* Deals Section */}
            <DealsSection deals={deals} />

          </div>

          {/* Slide-in Vault Discovery drawer */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFormOpen(false)}
              ></div>
              <div className="absolute inset-y-0 left-0 w-full max-w-md shadow-2xl animate-slide-in-left">
                <VaultDiscoveryForm
                  initialAction={formAction}
                  onBuy={handleBuyCar}
                  onSell={handleSellCar}
                  onTrack={handleTrackCar}
                  onClose={() => setIsFormOpen(false)}
                />
              </div>
            </div>
          )}
          </div>
        )}
        </main>
      </div>
      
      {/* Bottom Live Market Ticker */}
      <LiveTicker />

      {/* Cart & Wishlist slide-in drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onQtyChange={handleCartQty}
        onRemove={handleCartRemove}
        onPlaceOrder={handlePlaceOrder}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        items={watchlist}
        onClose={() => setIsWishlistOpen(false)}
        onMoveToCart={handleMoveToCart}
        onRemove={handleRemoveWatch}
      />

      {/* Toast notifications */}
      <Toaster />

      {/* Floating AI price assistant (bottom-right) */}
      <AIAssistant />

      {/* Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        collectionCount={myCollection.length}
        watchlistCount={watchlist.length}
        onClearCollection={handleClearCollection}
        onClearWatchlist={handleClearWatchlist}
      />

      {/* Pricing History Modal */}
      <HistoryModal
        item={displayedFeatured}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Rarity Guide Modal */}
      {isRarityGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-high border border-outline rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-tertiary">stars</span> Rarity Tier Guide
              </h3>
              <button 
                onClick={() => setIsRarityGuideOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-md space-y-md text-label-sm text-on-surface-variant">
              <div className="p-sm bg-surface-container rounded-lg border border-outline-variant">
                <p className="font-bold text-on-surface mb-1 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Mainline
                </p>
                <p>Standard retail releases, high production volume. These form the baseline (60%) of a healthy collection.</p>
              </div>
              <div className="p-sm bg-surface-container rounded-lg border border-outline-variant">
                <p className="font-bold text-secondary mb-1 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span> Treasure Hunt (TH)
                </p>
                <p>Limited run releases mixed into case assortments. Indicated by a silver flame logo on the package and card.</p>
              </div>
              <div className="p-sm bg-surface-container rounded-lg border border-outline-variant">
                <p className="font-bold text-tertiary mb-1 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span> Super Treasure Hunt (STH)
                </p>
                <p>Extremely rare premium releases. Features Spectraflame metallic paint, real rubber tires ("Real Riders"), and a gold circular flame logo on the package.</p>
              </div>
              <div className="p-sm bg-surface-container rounded-lg border border-outline-variant">
                <p className="font-bold text-primary mb-1 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Chase Pieces
                </p>
                <p>Ultra-limited premium cars distributed in very small runs. Often feature full black-out details or low production run numbering.</p>
              </div>
            </div>
            <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-end">
              <button 
                onClick={() => setIsRarityGuideOpen(false)}
                className="px-md py-sm bg-surface-container-highest hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
