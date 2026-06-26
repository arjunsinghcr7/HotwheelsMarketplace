import React, { useEffect, useRef, useState } from 'react';
import type { Collectible } from '../services/api';
import { ProductCard } from './ProductCard';

interface MarketAdsProps {
  items: Collectible[];
  onSelect: (item: Collectible) => void;
  onAddToCart: (item: Collectible) => void;
  onToggleWishlist: (item: Collectible) => void;
  wishlistNames: Set<string>;
  // When the user is actively searching, suppress the demo fallback ads so an
  // empty result reads as "no matches" rather than unrelated promos.
  searchActive?: boolean;
  searchQuery?: string;
}

// Fallback promos so the market always advertises something, even before the
// API data loads. Mirrors the top of the live catalog (server/db.json) and uses
// the same cropped car art served from /public/cars.
const DEFAULT_ADS: Collectible[] = [
  { id: 'ad-1', name: 'Aston Martin Valkyrie', brand: 'Aston Martin', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2022, price: 249.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: '/cars/19-aston-martin-valkyrie.jpg' },
  { id: 'ad-2', name: 'Bugatti Chiron', brand: 'Bugatti', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2022, price: 229.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: '/cars/10-bugatti-chiron.jpg' },
  { id: 'ad-3', name: 'Koenigsegg Jesko', brand: 'Koenigsegg', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2023, price: 219.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: '/cars/11-koenigsegg-jesko.jpg' },
  { id: 'ad-4', name: 'Lamborghini Aventador SVJ', brand: 'Lamborghini', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2021, price: 129.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: '/cars/08-lamborghini-aventador-svj.jpg' },
  { id: 'ad-5', name: 'McLaren P1', brand: 'McLaren', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2015, price: 119.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: '/cars/09-mclaren-p1.jpg' },
  { id: 'ad-6', name: 'Ferrari F40', brand: 'Ferrari', vehicleType: 'Classic Supercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 1987, price: 199.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Exotics', image: '/cars/07-ferrari-f40.jpg' },
  { id: 'ad-7', name: 'Porsche 911 GT3 RS', brand: 'Porsche', vehicleType: 'Supercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2023, price: 149.99, rarityLevel: 'Super Treasure Hunt', series: 'HW Exotics', image: '/cars/06-porsche-911-gt3-rs.jpg' },
  { id: 'ad-8', name: 'Nissan Skyline GT-R R34', brand: 'Nissan', vehicleType: 'JDM', scale: '1:64', condition: 'Mint (M)', releaseYear: 1999, price: 29.99, rarityLevel: 'Treasure Hunt', series: 'HW J-Imports', image: '/cars/01-nissan-skyline-gtr-r34.jpg' },
];

export const MarketAds: React.FC<MarketAdsProps> = ({
  items,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  wishlistNames,
  searchActive = false,
  searchQuery = '',
}) => {
  // Promote up to 8 of the most valuable available cars. Fall back to demo ads
  // only when NOT searching — during a search an empty list means "no matches".
  const sorted = [...items].sort((a, b) => b.price - a.price);
  const ads = (items.length > 0 ? sorted : searchActive ? [] : DEFAULT_ADS).slice(0, 8);
  const noMatches = searchActive && ads.length === 0;

  // Horizontal scroll controls — arrows appear only in the direction you can go.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [ads.length, noMatches]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="glass-panel p-md rounded-xl">
      <div className="flex items-center justify-between mb-md">
        <h4 className="font-headline-md text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary animate-pulse">local_fire_department</span>
          {searchActive ? 'Search Results' : 'Available in the Market'}
        </h4>
        <span className="text-label-sm text-on-surface-variant hidden sm:flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span>
          Live listings
        </span>
      </div>

      {noMatches ? (
        <div className="flex flex-col items-center justify-center text-center py-xl gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl">search_off</span>
          <p className="text-label-lg font-bold text-on-surface">No results found</p>
          <p className="text-label-sm text-on-surface-variant max-w-xs">
            {searchQuery ? <>No cars matching "<span className="text-on-surface font-medium">{searchQuery}</span>" are listed in the marketplace right now.</> : 'No cars are listed in the marketplace right now.'}
          </p>
        </div>
      ) : (
      <div className="relative">
        {/* Left scroll arrow — only when there's content to the left */}
        {canLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByDir(-1)}
            className="absolute left-1 top-[4.25rem] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface-container-highest/90 backdrop-blur border border-outline-variant text-on-surface shadow-lg flex items-center justify-center hover:bg-surface-container-high hover:border-secondary active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        )}
        {/* Right scroll arrow — only when there's more to the right */}
        {canRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByDir(1)}
            className="absolute right-1 top-[4.25rem] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface-container-highest/90 backdrop-blur border border-outline-variant text-on-surface shadow-lg flex items-center justify-center hover:bg-surface-container-high hover:border-secondary active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
        <div ref={scrollRef} onScroll={updateArrows} className="flex gap-md overflow-x-auto pb-sm custom-scrollbar">
        {ads.map((car, i) => (
          <div key={car.id} className="w-64 flex-shrink-0">
            <ProductCard
              item={car}
              index={i}
              isWishlisted={wishlistNames.has(car.name)}
              onSelect={onSelect}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
        </div>
      </div>
      )}
    </div>
  );
};
