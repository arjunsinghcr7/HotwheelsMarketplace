import React from 'react';
import type { Collectible } from '../services/api';

interface MarketAdsProps {
  items: Collectible[];
  onSelect: (item: Collectible) => void;
  // When the user is actively searching, suppress the demo fallback ads so an
  // empty result reads as "no matches" rather than unrelated promos.
  searchActive?: boolean;
  searchQuery?: string;
}

// Fallback promos so the market always advertises something, even before the
// API data loads.
const DEFAULT_ADS: Collectible[] = [
  {
    id: 'ad-1', name: 'McLaren P1', brand: 'Hot Wheels', vehicleType: 'Exotic', scale: '1:64',
    condition: 'Mint (M)', releaseYear: 2014, price: 980, rarityLevel: 'Super Treasure Hunt', series: 'HW Exotics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTb2T8AcPKiNvWwjgdmpDF9zMLcpRoZmfuUZJAWwZnIWFFwrfp0EWmJoGPupIFS3aGdAZ-XXOFSxQ7ebaFVs8kvREsZxHGjsKZn5GLTBAU9ROjgn6JBuxMLrAp_3SnMegJZELKkT-x_21iVHoi-nyoEHQQpNFXEwdLKcncc8pKXKSoc7jZw7FXCXvIo-ee74mSRPG_OEzK1asa9FLPAwq7plDgpNojbnyRrHGyQG9Ljw9QVolvN4sBuUJmlE8zmX8ua7gk5Df2dKvm',
  },
  {
    id: 'ad-2', name: 'Toyota Supra MK4', brand: 'Hot Wheels', vehicleType: 'Exotic', scale: '1:64',
    condition: 'Near Mint (NM)', releaseYear: 1998, price: 540, rarityLevel: 'Chase', series: 'J-Imports',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFpd56NW_8J1Tq6JuwlT_UI_o-2HXzNA5OSnsfyct9g647KJ3zw9oh2-5S_ephYXuNMR2ZjrbdC0fOALKbWRtetIErLUR3tkD7pVehbmYv4qMg8_15idtpagCYYcRI7t75g6IA9mhP1W1Ok-t4rfHOCAYBdjX_owqltgTtzHMAfAHLxs4c2jbau-h30uhSG9_8Cdryecv6_xH3n1tG2-0HrGJV9rP4UIZz_dxTC80fpcwlorr0wbUlB3KEoLhbnKzGYKABg_Ryu5gm',
  },
  {
    id: 'ad-3', name: 'Plymouth Superbird \'70', brand: 'Matchbox', vehicleType: 'Muscle', scale: '1:64',
    condition: 'Mint (M)', releaseYear: 1970, price: 245, rarityLevel: 'Treasure Hunt', series: 'Retro Muscle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAjh6jyreGcOpuQAa9epE6zgxjUH4EfAj3etQwtv9LmW_2C4C4R33WoqYzCiXk0jrXSHWAhgc9vZQVlqUreyVVSem4CAOU7S7gpVwYsHuY3U2mTX8rc9T-o8o-kLsotwy1apmQnwt3BHOvWiOx65Gmc55F7w2TmWuyel5JokjJLd1cstF9vknPt7pLJJALbOZYWQFYV1j9LwbpDVhS5oEFaIgI3KhcKqG2837zSRkQCzPl90VFQFCa0FNd5u53G1TL1j8Lin_MUay4',
  },
];

const rarityColor = (level: string) => {
  if (level === 'Super Treasure Hunt') return 'bg-tertiary text-on-tertiary';
  if (level === 'Chase') return 'bg-primary text-on-primary';
  if (level === 'Treasure Hunt') return 'bg-secondary text-on-secondary';
  return 'bg-surface-container-highest text-on-surface-variant';
};

export const MarketAds: React.FC<MarketAdsProps> = ({ items, onSelect, searchActive = false, searchQuery = '' }) => {
  // Promote up to 8 of the most valuable available cars. Fall back to demo ads
  // only when NOT searching — during a search an empty list means "no matches".
  const sorted = [...items].sort((a, b) => b.price - a.price);
  const ads = (items.length > 0 ? sorted : searchActive ? [] : DEFAULT_ADS).slice(0, 8);
  const noMatches = searchActive && ads.length === 0;

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
      <div className="flex gap-md overflow-x-auto pb-sm custom-scrollbar">
        {ads.map((car) => (
          <div
            key={car.id}
            className="flex-shrink-0 w-56 bg-surface-container rounded-xl border border-outline-variant overflow-hidden group hover:border-secondary transition-all"
          >
            <div className="h-28 relative overflow-hidden bg-surface-dim">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-full font-bold ${rarityColor(car.rarityLevel)}`}>
                {car.rarityLevel === 'Super Treasure Hunt' ? 'STH' : car.rarityLevel === 'Treasure Hunt' ? 'TH' : car.rarityLevel}
              </span>
            </div>
            <div className="p-sm">
              <p className="text-label-md font-bold truncate text-on-surface">{car.name}</p>
              <p className="text-[11px] text-on-surface-variant mb-sm">{car.brand} · {car.releaseYear}</p>
              <div className="flex items-center justify-between">
                <span className="text-label-md font-bold text-secondary">
                  ${car.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => onSelect(car)}
                  className="px-sm py-1 bg-secondary-container text-on-secondary-container rounded-lg text-label-sm font-bold hover:brightness-110 transition-all"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
