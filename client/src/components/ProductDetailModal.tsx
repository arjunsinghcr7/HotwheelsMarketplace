import React, { useEffect } from 'react';
import type { Collectible } from '../services/api';
import { formatPrice } from '../utils/format';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  item: Collectible | null;
  isOpen: boolean;
  collectibles: Collectible[];
  recentlyViewed: Collectible[];
  wishlistNames: Set<string>;
  onClose: () => void;
  onAddToCart: (item: Collectible) => void;
  onToggleWishlist: (item: Collectible) => void;
  onOpenDetails: (item: Collectible) => void;
  onBuy: (item: Collectible) => void;
  onSell: (item: Collectible) => void;
  onTrack: (item: Collectible) => void;
}

const rarityBadge = (level: string) => {
  switch (level) {
    case 'Super Treasure Hunt': return 'bg-tertiary text-on-tertiary';
    case 'Chase': return 'bg-primary text-on-primary';
    case 'Treasure Hunt': return 'bg-secondary text-on-secondary';
    default: return 'bg-surface-container-highest text-on-surface';
  }
};

const Spec: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
    <span className="text-label-sm text-on-surface-variant">{label}</span>
    <span className="text-label-md font-medium text-on-surface text-right">{value}</span>
  </div>
);

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  collectibles,
  recentlyViewed,
  wishlistNames,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onOpenDetails,
  onBuy,
  onSell,
  onTrack,
}) => {
  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const rating = Math.round(((item.demandScore ?? 80) / 20) * 10) / 10;
  const wishlisted = wishlistNames.has(item.name);
  const related = collectibles
    .filter((c) => c.id !== item.id && (c.brand === item.brand || c.vehicleType === item.vehicleType))
    .slice(0, 4);
  const recent = recentlyViewed.filter((c) => c.id !== item.id).slice(0, 6);

  return (
    <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-0 sm:p-md" role="dialog" aria-modal="true" aria-label={`${item.name} details`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl max-h-[100vh] sm:max-h-[92vh] overflow-y-auto custom-scrollbar bg-surface-container-low sm:rounded-2xl border border-outline-variant shadow-2xl animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-surface-container-highest/90 backdrop-blur border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg p-md md:p-lg">
          {/* Gallery */}
          <div className="space-y-sm">
            <div className="hover-zoom relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant aspect-[4/3]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-full ${rarityBadge(item.rarityLevel)}`}>
                {item.rarityLevel}
              </span>
            </div>
            {/* Thumbnail strip (single source image) */}
            <div className="flex gap-2">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-md">
            <div>
              <p className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">{item.brand} · {item.vehicleType}</p>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">{item.name}</h2>
              <div className="flex items-center gap-1 mt-2" aria-label={`Rated ${rating} of 5`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="material-symbols-outlined text-[18px] text-tertiary" style={i < Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : undefined}>star</span>
                ))}
                <span className="text-label-sm text-on-surface-variant ml-1">{rating.toFixed(1)} · {item.demandScore ?? 80} demand</span>
              </div>
            </div>

            <p className="text-headline-md font-bold text-primary">{formatPrice(item.price)}</p>

            {item.notes && <p className="text-body-md text-on-surface-variant">{item.notes}</p>}

            {/* Actions */}
            <div className="flex gap-sm">
              <button onClick={() => onAddToCart(item)} className="btn-press flex-1 flex items-center justify-center gap-2 px-md py-sm rounded-xl racing-gradient text-white font-bold shadow-lg">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={() => onToggleWishlist(item)}
                aria-pressed={wishlisted}
                className="btn-press px-md py-sm rounded-xl bg-surface-container-high border border-outline-variant text-on-surface hover:border-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined" style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ff3b30' } : undefined}>favorite</span>
                <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Buy / Sell / Track this specific car */}
            <div className="grid grid-cols-3 gap-sm">
              <button
                onClick={() => onBuy(item)}
                title="Buy — add this car to your collection"
                className="btn-press flex items-center justify-center gap-1.5 px-sm py-sm rounded-xl racing-gradient text-white font-bold shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                Buy
              </button>
              <button
                onClick={() => onSell(item)}
                title="Sell — list this car on the marketplace"
                className="btn-press flex items-center justify-center gap-1.5 px-sm py-sm rounded-xl bg-surface-container-high text-secondary border border-secondary font-bold hover:bg-secondary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">sell</span>
                Sell
              </button>
              <button
                onClick={() => onTrack(item)}
                title="Track — add this car to your watchlist"
                className="btn-press flex items-center justify-center gap-1.5 px-sm py-sm rounded-xl bg-surface-container-high text-tertiary border border-tertiary font-bold hover:bg-tertiary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                Track
              </button>
            </div>

            {/* Specifications */}
            <div>
              <p className="text-label-md font-bold uppercase tracking-wider text-on-surface mb-1">Specifications</p>
              <Spec label="Brand" value={item.brand} />
              <Spec label="Series" value={item.series || '—'} />
              <Spec label="Scale" value={item.scale} />
              <Spec label="Material" value="Die-cast metal" />
              <Spec label="Year" value={item.releaseYear} />
              <Spec label="Condition" value={item.condition} />
              <Spec label="Rarity" value={item.rarityLevel} />
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="px-md md:px-lg pb-lg">
            <h3 className="font-headline-md text-on-surface mb-md">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {related.map((c, i) => (
                <ProductCard
                  key={c.id}
                  item={c}
                  index={i}
                  isWishlisted={wishlistNames.has(c.name)}
                  onSelect={onOpenDetails}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recent.length > 0 && (
          <div className="px-md md:px-lg pb-lg">
            <h3 className="font-headline-md text-on-surface mb-md">Recently viewed</h3>
            <div className="flex gap-sm overflow-x-auto custom-scrollbar pb-2">
              {recent.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpenDetails(c)}
                  className="card-lift flex-shrink-0 w-36 text-left bg-surface-container rounded-xl border border-outline-variant overflow-hidden"
                >
                  <div className="h-20 overflow-hidden">
                    <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-on-surface truncate">{c.name}</p>
                    <p className="text-[11px] text-secondary font-bold">{formatPrice(c.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
