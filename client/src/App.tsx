import { useState, useEffect } from 'react';
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
import type { MyCar, WatchItem } from './services/collection';
import {
  getMyCollection, addMyCar, deleteMyCar,
  getWatchlist, addWatch, removeWatch
} from './services/collection';

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
  price: 1850.0,
  rarityLevel: 'Super Treasure Hunt',
  series: 'HW Premium Exotics',
  image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  notes: 'Track-bred flat-six icon in GT Silver with the signature swan-neck rear wing. Premium Spectraflame finish, Real Rider tires. Serial #001/250.',
  isFeatured: true,
  demandScore: 99,
};

function App() {
  const [activeTab, setActiveTab] = useState('Marketplace');
  const [activeMenu, setActiveMenu] = useState('Marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  
  // API Data states
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [featuredItem, setFeaturedItem] = useState<Collectible | null>(null);

  // User's personal collection + price watchlist (stored locally in the browser)
  const [myCollection, setMyCollection] = useState<MyCar[]>([]);
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);

  // Chart timeframe state
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '1Y'>('1M');
  
  // Modal states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRarityGuideOpen, setIsRarityGuideOpen] = useState(false);

  // Mobile navigation helper
  // Since Left Panel (Form) is 1/3 and Right Panel is 2/3, we can switch views on mobile
  const [mobileActiveView, setMobileActiveView] = useState<'listings' | 'form'>('listings');

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
    }
  };

  useEffect(() => {
    loadData();
    setMyCollection(getMyCollection());
    setWatchlist(getWatchlist());
  }, []);

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
    setMobileActiveView('listings');
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
  };

  const handleRemoveWatch = (id: string) => {
    setWatchlist(removeWatch(id));
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
    if (tab === 'Marketplace') {
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

  return (
    <div className="h-screen flex flex-col bg-surface-dim text-on-surface select-none">
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={handleSetTab}
      />
      
      <div className="flex h-full pt-16 pb-8 overflow-hidden">
        {/* Sidebar Left */}
        <Sidebar 
          activeMenu={activeMenu}
          setActiveMenu={handleSetMenu}
          onOpenRarityGuide={() => setIsRarityGuideOpen(true)}
        />
        
        {/* Main Workspace */}
        <main className="flex-1 ml-0 xl:ml-64 overflow-hidden">

        {activeMenu === 'My Collection' ? (
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
          <div className="h-full flex overflow-hidden">

          {/* Mobile view switch bar (Visible on mobile/tablet to toggle Form vs Listings) */}
          <div className="lg:hidden fixed top-16 left-0 right-0 h-10 bg-surface-container border-b border-outline-variant z-30 flex">
            <button
              onClick={() => setMobileActiveView('listings')}
              className={`flex-1 font-label-sm uppercase tracking-wider text-[11px] border-r border-outline-variant ${
                mobileActiveView === 'listings' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant'
              }`}
            >
              Vault Listings & Stats
            </button>
            <button
              onClick={() => setMobileActiveView('form')}
              className={`flex-1 font-label-sm uppercase tracking-wider text-[11px] ${
                mobileActiveView === 'form' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant'
              }`}
            >
              Vault Discovery Form
            </button>
          </div>

          {/* Left Panel: Form entry */}
          <div className={`h-full ${
            mobileActiveView === 'form' ? 'block w-full pt-10' : 'hidden'
          } lg:block lg:w-1/3`}>
            <VaultDiscoveryForm
              onBuy={handleBuyCar}
              onSell={handleSellCar}
              onTrack={handleTrackCar}
            />
          </div>
          
          {/* Right Panel: Analytics & listings */}
          <div className={`h-full flex-1 flex-col bg-background overflow-y-auto custom-scrollbar p-sm lg:p-lg gap-lg ${
            mobileActiveView === 'listings' ? 'flex pt-12 lg:pt-0' : 'hidden'
          } lg:flex`}>
            
            {/* Hero Featured & Key Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
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
                  <p className="text-headline-lg font-bold text-white">
                    ${stats ? stats.totalCollectionValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '42,850.25'}
                  </p>
                  <p className="text-label-sm text-green-400 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +12.4% this month
                  </p>
                </div>
                
                <div className="glass-panel p-md rounded-xl">
                  <div className="flex justify-between items-start mb-sm">
                    <p className="text-label-sm text-on-surface-variant">Items in Vault</p>
                    <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
                  </div>
                  <p className="text-headline-lg font-bold text-white">
                    {stats ? stats.itemsInVault.toLocaleString('en-US') : '1,428'}
                  </p>
                  <div className="mt-xs w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${stats ? stats.setCompletePercent : 85}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    {stats ? stats.setCompletePercent : 85}% of {stats ? stats.setCompleteName : 'Set #2024-B'} complete
                  </p>
                </div>
              </div>
            </div>
            
            {/* Advertised cars available in the market */}
            <MarketAds items={collectibles} onSelect={setFeaturedItem} />

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
            />
            
            {/* Deals Section */}
            <DealsSection deals={deals} />

          </div>
          </div>
        )}
        </main>
      </div>
      
      {/* Bottom Live Market Ticker */}
      <LiveTicker />

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
                <p className="font-bold text-white mb-1 flex items-center gap-xs">
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
