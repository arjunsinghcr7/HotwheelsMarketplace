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
// API data loads. Mirrors the top of the live catalog (server/db.json).
const IMG = {
  red: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIkDdUAS5EKKUUyyrIkPEhe1KzIUPfVsmLNAZuLmbt2-Orgag94Sz7emH59UT3lmQwroTj4QjR7xPUo1vsrVllc-jtxSeRombd-7MlV84ya1Va1EjvvFb4BrSh23QyR2lpCBlN7lkuuWcXcD0nSRYQghONgjUJdBNv_Wz7cp7RYgGNyp3D70Jv-b_kFXAhD-EJAXub6bORsVcyz1hDUvSzNSx6prYKaJWhA5gVUUEgTm7iWGzqWA_WL5Q0tvDuOGvkQbJMfWdjRqjx',
  orange: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAjh6jyreGcOpuQAa9epE6zgxjUH4EfAj3etQwtv9LmW_2C4C4R33WoqYzCiXk0jrXSHWAhgc9vZQVlqUreyVVSem4CAOU7S7gpVwYsHuY3U2mTX8rc9T-o8o-kLsotwy1apmQnwt3BHOvWiOx65Gmc55F7w2TmWuyel5JokjJLd1cstF9vknPt7pLJJALbOZYWQFYV1j9LwbpDVhS5oEFaIgI3KhcKqG2837zSRkQCzPl90VFQFCa0FNd5u53G1TL1j8Lin_MUay4',
  gold: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTb2T8AcPKiNvWwjgdmpDF9zMLcpRoZmfuUZJAWwZnIWFFwrfp0EWmJoGPupIFS3aGdAZ-XXOFSxQ7ebaFVs8kvREsZxHGjsKZn5GLTBAU9ROjgn6JBuxMLrAp_3SnMegJZELKkT-x_21iVHoi-nyoEHQQpNFXEwdLKcncc8pKXKSoc7jZw7FXCXvIo-ee74mSRPG_OEzK1asa9FLPAwq7plDgpNojbnyRrHGyQG9Ljw9QVolvN4sBuUJmlE8zmX8ua7gk5Df2dKvm',
  blue: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALYI0_-QMe8qn-hCRXuTBeQiMe3ag6cj22xXRYHPBDFqWbFM4f8KY-7uRrNnuge4W6E-skEvkKHisOG9wdsFEeT-_o_ZXcIdw5RO4jJIqk1atajErB4fvIIvPtFMyvW1Qo8v-bvxLCo79VJGI3PL9D8LU7lJoS10msQLKMYsheuGu8DYWFeJkE2C4Gh4BL06hCJ_hKo3mboDMcwhSddex90xENWWDOgQDHRhqLRDd2EAQVqVeFUSrb5q4VK1XS5tNJ7VoaowUpEm5h',
  teal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjiuvbpbRfs4vxBiLFlgEud4W6-0PyRIHiO574F7f9RnH4T6JZH_eCB2FTcZ3znHpMuEnBa8C-B5yEULD_VoqZq-K8Lcn4mYtRBRFaSqX8r_DTs7ay7H4EajhKvYIxmrcTojDOYr1WG-YRaIi4dpzbLgaICO52cRn-fKPe-hYud0h_eHQCba5QAB0_Ce-ntt0zRQdWk9xo-IALZ0vV2DcgN29D5MiYA1p9kiNVQ_pm1n8cHMlQ4h5R8gkiCMN2pXPLhu6hb8fIFhVr',
  lime: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXmL0cJxzhaZDlcoJv3S6Szf-xqhQJfGzRFjqHwr3gwvIHmK7dDKSnRMOYKbeCufXT9MdTg3B24z7z41BoK1XQeBefawVc1Zc929LLyZG9dikRcY2rT9MsqUnPQ65nNCbFU7MDpaxNJ-TqR3JM7HqtUaFJIPk-C76wm1VoFbKmIMZUjZ8PJo4yNY0aTrRfkOFTYCH7E6MuIIzolEBzHap4JCaFf0NIM1QbwEshV9Y8MAbso42KH0Wv5TAd4RNBK24uasCRoLZOgLcg',
  silver: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_ADS: Collectible[] = [
  { id: 'ad-1', name: 'Aston Martin Valkyrie', brand: 'Aston Martin', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2022, price: 1299, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: IMG.lime },
  { id: 'ad-2', name: 'Bugatti Chiron', brand: 'Bugatti', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2022, price: 1199, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: IMG.blue },
  { id: 'ad-3', name: 'Koenigsegg Jesko', brand: 'Koenigsegg', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2023, price: 1199, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: IMG.teal },
  { id: 'ad-4', name: 'Lamborghini Aventador SVJ', brand: 'Lamborghini', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2021, price: 1099, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: IMG.lime },
  { id: 'ad-5', name: 'McLaren P1', brand: 'McLaren', vehicleType: 'Hypercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2015, price: 1099, rarityLevel: 'Super Treasure Hunt', series: 'HW Hypercars', image: IMG.orange },
  { id: 'ad-6', name: 'Ferrari F40', brand: 'Ferrari', vehicleType: 'Classic Supercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 1987, price: 999, rarityLevel: 'Super Treasure Hunt', series: 'HW Exotics', image: IMG.red },
  { id: 'ad-7', name: 'Porsche 911 GT3 RS', brand: 'Porsche', vehicleType: 'Supercar', scale: '1:64', condition: 'Mint (M)', releaseYear: 2023, price: 899, rarityLevel: 'Super Treasure Hunt', series: 'HW Exotics', image: IMG.silver },
  { id: 'ad-8', name: 'Nissan Skyline GT-R R34', brand: 'Nissan', vehicleType: 'JDM', scale: '1:64', condition: 'Mint (M)', releaseYear: 1999, price: 799, rarityLevel: 'Treasure Hunt', series: 'HW J-Imports', image: IMG.blue },
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
