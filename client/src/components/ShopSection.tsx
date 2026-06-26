import React, { useState } from 'react';
import type { Collectible } from '../services/api';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { formatPrice } from '../utils/format';

interface ShopSectionProps {
  items: Collectible[]; // already search-filtered by the parent
  isLoading: boolean;
  selectedItem: Collectible | null;
  wishlistNames: Set<string>;
  searchQuery: string;
  onSelectItem: (item: Collectible) => void;
  onAddToCart: (item: Collectible) => void;
  onToggleWishlist: (item: Collectible) => void;
  onDeleteCollectible: (id: string) => Promise<void>;
  onBrowse?: () => void;
}

type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'alpha';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Most Popular' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'alpha', label: 'Alphabetical' },
];

const RARITIES = ['Mainline', 'Treasure Hunt', 'Chase', 'Super Treasure Hunt'];

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const CheckGroup: React.FC<{ title: string; options: string[]; selected: string[]; onToggle: (v: string) => void }> = ({
  title,
  options,
  selected,
  onToggle,
}) => (
  <div>
    <p className="text-label-md font-bold text-on-surface mb-2">{title}</p>
    <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-on-surface cursor-pointer">
          <input type="checkbox" checked={selected.includes(o)} onChange={() => onToggle(o)} className="accent-[#ff3b30] w-3.5 h-3.5" />
          <span className="truncate">{o}</span>
        </label>
      ))}
    </div>
  </div>
);

export const ShopSection: React.FC<ShopSectionProps> = ({
  items,
  isLoading,
  selectedItem,
  wishlistNames,
  searchQuery,
  onSelectItem,
  onAddToCart,
  onToggleWishlist,
  onDeleteCollectible,
  onBrowse,
}) => {
  const [sort, setSort] = useState<SortKey>('popular');
  const [brands, setBrands] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Facet options derived from the current search results.
  const allBrands = [...new Set(items.map((i) => i.brand))].sort();
  const allCats = [...new Set(items.map((i) => i.vehicleType))].sort();
  const prices = items.map((i) => i.price);
  const years = items.map((i) => i.releaseYear);
  const priceCeil = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const yearLo = years.length ? Math.min(...years) : 1960;
  const yearHi = years.length ? Math.max(...years) : 2025;

  const handleDelete = async (item: Collectible) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) await onDeleteCollectible(item.id);
  };

  const activeCount = brands.length + cats.length + rarities.length + (maxPrice !== null ? 1 : 0) + (minYear !== null ? 1 : 0);
  const clearAll = () => {
    setBrands([]); setCats([]); setRarities([]); setMaxPrice(null); setMinYear(null);
  };

  let shown = items.filter(
    (i) =>
      (brands.length === 0 || brands.includes(i.brand)) &&
      (cats.length === 0 || cats.includes(i.vehicleType)) &&
      (rarities.length === 0 || rarities.includes(i.rarityLevel)) &&
      (maxPrice === null || i.price <= maxPrice) &&
      (minYear === null || i.releaseYear >= minYear)
  );
  shown = [...shown].sort((a, b) => {
    switch (sort) {
      case 'newest': return b.releaseYear - a.releaseYear;
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'alpha': return a.name.localeCompare(b.name);
      default: return (b.demandScore ?? 0) - (a.demandScore ?? 0);
    }
  });

  return (
    <div className="space-y-md">
      {/* Header: title + count + sort + mobile filter toggle */}
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <h4 className="font-headline-md text-on-surface">
          Shop All Cars <span className="text-on-surface-variant text-label-md font-normal">· {shown.length}</span>
        </h4>
        <div className="flex items-center gap-sm">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="xl:hidden btn-press flex items-center gap-1 px-sm py-2 rounded-lg bg-surface-container-high border border-outline-variant text-label-sm text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
          <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-md items-start">
        {/* Filter sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} xl:block w-full xl:w-60 shrink-0 glass-panel rounded-2xl p-md space-y-md`}>
          <div className="flex items-center justify-between">
            <p className="font-headline-md text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span> Filters
            </p>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-label-sm text-primary hover:underline">Clear all</button>
            )}
          </div>

          <CheckGroup title="Brand" options={allBrands} selected={brands} onToggle={(v) => setBrands((p) => toggle(p, v))} />
          <CheckGroup title="Category" options={allCats} selected={cats} onToggle={(v) => setCats((p) => toggle(p, v))} />
          <CheckGroup title="Rarity" options={RARITIES} selected={rarities} onToggle={(v) => setRarities((p) => toggle(p, v))} />

          {/* Price */}
          <div>
            <p className="text-label-md font-bold text-on-surface mb-2 flex items-center justify-between">
              Max Price <span className="text-secondary">{formatPrice(maxPrice ?? priceCeil)}</span>
            </p>
            <input
              type="range" min={0} max={priceCeil} step={5}
              value={maxPrice ?? priceCeil}
              onChange={(e) => setMaxPrice(Number(e.target.value) >= priceCeil ? null : Number(e.target.value))}
              className="w-full accent-[#ff3b30]"
            />
          </div>

          {/* Year */}
          <div>
            <p className="text-label-md font-bold text-on-surface mb-2 flex items-center justify-between">
              From Year <span className="text-secondary">{minYear ?? yearLo}</span>
            </p>
            <input
              type="range" min={yearLo} max={yearHi} step={1}
              value={minYear ?? yearLo}
              onChange={(e) => setMinYear(Number(e.target.value) <= yearLo ? null : Number(e.target.value))}
              className="w-full accent-[#ff3b30]"
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : shown.length === 0 ? (
            <div className="glass-panel rounded-2xl flex flex-col items-center justify-center text-center py-xl px-md gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl">search_off</span>
              <p className="text-headline-md font-bold text-on-surface">No cars found.</p>
              <p className="text-label-sm text-on-surface-variant max-w-sm">
                {searchQuery ? <>Nothing matches "<span className="text-on-surface font-medium">{searchQuery}</span>" with these filters.</> : 'Try adjusting or clearing your filters.'}
              </p>
              {activeCount > 0 ? (
                <button onClick={clearAll} className="btn-press mt-2 px-lg py-sm rounded-xl racing-gradient text-white font-bold">Clear filters</button>
              ) : onBrowse ? (
                <button onClick={onBrowse} className="btn-press mt-2 px-lg py-sm rounded-xl racing-gradient text-white font-bold">Browse Collection</button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {shown.map((item, i) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  isSelected={selectedItem?.id === item.id}
                  isWishlisted={wishlistNames.has(item.name)}
                  onSelect={onSelectItem}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
