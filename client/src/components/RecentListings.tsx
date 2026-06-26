import React from 'react';
import type { Collectible } from '../services/api';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

interface RecentListingsProps {
  items: Collectible[];
  onSelectItem: (item: Collectible) => void;
  selectedItem: Collectible | null;
  onDeleteCollectible: (id: string) => Promise<void>;
  onAddToCart?: (item: Collectible) => void;
  onToggleWishlist?: (item: Collectible) => void;
  wishlistNames?: Set<string>;
  isLoading?: boolean;
  searchQuery?: string;
  onBrowse?: () => void;
}

export const RecentListings: React.FC<RecentListingsProps> = ({
  items,
  onSelectItem,
  selectedItem,
  onDeleteCollectible,
  onAddToCart,
  onToggleWishlist,
  wishlistNames,
  isLoading = false,
  searchQuery = '',
  onBrowse,
}) => {
  const handleDelete = async (item: Collectible) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      await onDeleteCollectible(item.id);
    }
  };

  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center">
        <h4 className="font-headline-md text-on-surface">Recent Marketplace Listings</h4>
        <button className="text-secondary text-label-sm flex items-center gap-xs group hover:underline">
          View All{' '}
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center text-center py-xl px-md gap-sm animate-fade-in">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl">
            {searchQuery ? 'search_off' : 'directions_car'}
          </span>
          <p className="text-headline-md font-bold text-on-surface">No cars found.</p>
          <p className="text-label-sm text-on-surface-variant max-w-sm">
            {searchQuery ? (
              <>
                Nothing matches "<span className="text-on-surface font-medium">{searchQuery}</span>".
                Try a different name, brand, series, or year.
              </>
            ) : (
              'No marketplace listings yet. Start your collection to see cars here.'
            )}
          </p>
          {onBrowse && (
            <button
              onClick={onBrowse}
              className="btn-press mt-2 px-lg py-sm rounded-xl racing-gradient text-white font-bold shadow-lg"
            >
              Browse Collection
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
          {items.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              index={i}
              isSelected={selectedItem?.id === item.id}
              isWishlisted={wishlistNames?.has(item.name)}
              onSelect={onSelectItem}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
