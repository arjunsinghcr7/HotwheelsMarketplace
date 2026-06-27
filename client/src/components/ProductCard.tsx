import React, { useEffect, useState } from 'react';
import type { Collectible } from '../services/api';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  item: Collectible;
  index?: number;
  isSelected?: boolean;
  isWishlisted?: boolean;
  // Overrides the rarity badge (e.g. a section badge like "BEST SELLER").
  badgeOverride?: { label: string; cls: string };
  onSelect?: (item: Collectible) => void;
  onAddToCart?: (item: Collectible) => void;
  onToggleWishlist?: (item: Collectible) => void;
  onDelete?: (item: Collectible) => void;
}

// Map a rarity tier to its badge label + colour classes.
const rarityBadge = (level: string): { label: string; cls: string } => {
  switch (level) {
    case 'Super Treasure Hunt':
      return { label: 'SUPER TREASURE HUNT', cls: 'bg-tertiary text-on-tertiary' };
    case 'Chase':
      return { label: 'CHASE', cls: 'bg-primary text-on-primary' };
    case 'Treasure Hunt':
      return { label: 'TREASURE HUNT', cls: 'bg-secondary text-on-secondary' };
    default:
      return { label: 'PREMIUM', cls: 'bg-surface-container-highest text-on-surface' };
  }
};

// Rating derived from the demand score (0–100 -> 0–5 stars).
const ratingFor = (demand?: number) => Math.round(((demand ?? 80) / 20) * 10) / 10;

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  index = 0,
  isSelected = false,
  isWishlisted = false,
  badgeOverride,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpen]);

  const badge = badgeOverride ?? rarityBadge(item.rarityLevel);
  const rating = ratingFor(item.demandScore);
  const isNew = item.releaseYear >= 2023;
  const isBestSeller = (item.demandScore ?? 0) >= 92;
  const stagger = index % 4 === 1 ? 'delay-1' : index % 4 === 2 ? 'delay-2' : index % 4 === 3 ? 'delay-3' : '';

  return (
    <div
      onClick={() => onSelect?.(item)}
      className={`card-tilt animate-slide-up ${stagger} glass-panel rounded-2xl overflow-hidden group cursor-pointer border ${
        isSelected ? 'border-primary' : 'border-outline-variant hover:border-on-surface-variant/40'
      }`}
    >
      {/* Image + badges */}
      <div className="hover-zoom relative h-44 bg-surface-container">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full tracking-wide ${badge.cls}`}>
            {badge.label}
          </span>
          {!badgeOverride && (isBestSeller ? (
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary text-on-primary tracking-wide">
              BEST SELLER
            </span>
          ) : isNew ? (
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-green-500 text-black tracking-wide">
              NEW
            </span>
          ) : null)}
        </div>

        {/* Wishlist heart */}
        {onToggleWishlist && (
          <button
            type="button"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item);
            }}
            className="btn-press absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={isWishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ff3b30' } : undefined}
            >
              favorite
            </span>
          </button>
        )}

        {/* Admin menu (only when a delete handler is supplied) */}
        {onDelete && (
          <div className="absolute bottom-2 right-2">
            <button
              type="button"
              aria-label="More actions"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-9 w-32 bg-surface-container-highest border border-outline-variant rounded-lg shadow-xl py-1 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onSelect?.(item);
                  }}
                  className="w-full text-left px-sm py-1.5 hover:bg-surface-container-high text-xs text-on-surface flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Set Featured
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(item);
                  }}
                  className="w-full text-left px-sm py-1.5 hover:bg-surface-container-high text-xs text-error flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-sm space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant truncate">
          {item.brand} · {item.vehicleType}
        </p>
        <p className="text-label-lg font-bold text-on-surface truncate" title={item.name}>
          {item.name}
        </p>

        {/* Rating + condition (quality) */}
        <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="material-symbols-outlined text-[14px] text-tertiary"
              style={i < Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              star
            </span>
          ))}
          <span className="text-[11px] text-on-surface-variant ml-0.5">{rating.toFixed(1)}</span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-medium"
            title={`Condition: ${item.condition}`}
          >
            {item.condition}
          </span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-headline-md font-bold text-on-surface">{formatPrice(item.price)}</span>
          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="ripple btn-press flex items-center gap-1 pl-2.5 pr-3 py-2 rounded-xl racing-gradient text-white text-label-sm font-bold shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton placeholder shown while the catalog loads.
export const ProductCardSkeleton: React.FC = () => (
  <div className="glass-panel rounded-2xl overflow-hidden border border-outline-variant">
    <div className="skeleton h-44 w-full" />
    <div className="p-sm space-y-2">
      <div className="skeleton h-2.5 w-1/3 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex items-center justify-between pt-1">
        <div className="skeleton h-5 w-16 rounded" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  </div>
);
