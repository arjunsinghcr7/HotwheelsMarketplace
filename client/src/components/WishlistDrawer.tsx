import React from 'react';
import type { WatchItem } from '../services/collection';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  items: WatchItem[];
  onClose: () => void;
  onMoveToCart: (item: WatchItem) => void;
  onRemove: (id: string) => void;
}

const rarityColor = (level: string) => {
  if (level === 'Super Treasure Hunt') return 'text-tertiary';
  if (level === 'Chase') return 'text-primary';
  if (level === 'Treasure Hunt') return 'text-secondary';
  return 'text-on-surface-variant';
};

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, items, onClose, onMoveToCart, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-surface-container-low border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Wishlist{items.length ? ` (${items.length})` : ''}
          </h2>
          <button onClick={onClose} aria-label="Close wishlist" className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-sm p-lg">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl">heart_broken</span>
            <p className="text-headline-md font-bold text-on-surface">Your wishlist is empty</p>
            <p className="text-label-sm text-on-surface-variant">Tap the heart on any car to save it here.</p>
            <button onClick={onClose} className="btn-press mt-md px-lg py-sm rounded-xl racing-gradient text-white font-bold">
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-sm">
            {items.map((item) => (
              <div key={item.id} className="bg-surface-container rounded-xl border border-outline-variant p-sm">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0">
                    <p className="text-label-md font-bold text-on-surface truncate">{item.name}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      {item.brand} · <span className={`font-bold uppercase ${rarityColor(item.rarityLevel)}`}>{item.rarityLevel}</span>
                    </p>
                    <p className="text-label-md font-bold text-secondary mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => onRemove(item.id)} aria-label="Remove from wishlist" className="btn-press w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error/10 flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <button
                  onClick={() => onMoveToCart(item)}
                  className="btn-press mt-sm w-full px-sm py-2 rounded-lg racing-gradient text-white text-label-sm font-bold flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
