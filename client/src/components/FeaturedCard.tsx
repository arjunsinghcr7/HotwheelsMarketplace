import React from 'react';
import { formatPrice } from '../utils/format';
import type { Collectible } from '../services/api';

interface FeaturedCardProps {
  item: Collectible;
  onOpenHistory: () => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onOpenHistory }) => {
  const isSth = item.rarityLevel === 'Super Treasure Hunt';
  
  return (
    <div className="xl:col-span-2 group relative rounded-xl overflow-hidden min-h-[20rem] flex flex-col justify-end shadow-2xl border border-outline-variant">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt={item.name}
        src={item.image}
      />
      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10"></div>

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex gap-xs z-10">
        <span className={`px-sm py-1 text-label-sm rounded-full font-bold shadow-lg ${
          isSth ? 'bg-tertiary text-on-tertiary' : 'bg-secondary text-on-secondary'
        }`}>
          {isSth ? 'STH' : 'TH'}
        </span>
        <span className="px-sm py-1 bg-black/50 backdrop-blur-md text-white text-label-sm rounded-full border border-white/20">
          #001/250
        </span>
      </div>

      {/* Content overlaid at the bottom */}
      <div className="relative z-10 p-md md:p-lg">
        <div className="flex items-center gap-xs mb-xs">
          <span className="text-tertiary material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <p className="text-label-md text-tertiary font-bold tracking-widest uppercase">Premium Listing</p>
        </div>

        <h3 className="font-headline-lg text-headline-lg mb-sm text-white drop-shadow-lg">{item.name}</h3>

        <div className="flex items-center gap-lg mb-md">
          <div>
            <p className="text-label-sm text-white/70">Market Value</p>
            <p className="text-headline-md text-secondary font-bold drop-shadow">{formatPrice(item.price)}</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <p className="text-label-sm text-white/70">Demand Score</p>
            <div className="flex items-center gap-xs">
              <p className="text-headline-md text-tertiary font-bold drop-shadow">{item.demandScore || 95}/100</p>
              <span className="material-symbols-outlined text-tertiary animate-pulse">local_fire_department</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenHistory}
          className="w-full md:w-auto px-lg py-sm bg-white/10 backdrop-blur-md border border-secondary text-secondary hover:bg-secondary/20 rounded-lg transition-colors text-label-md font-bold uppercase tracking-wider"
        >
          View Full History
        </button>
      </div>
    </div>
  );
};
