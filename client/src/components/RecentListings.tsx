import React, { useState, useEffect } from 'react';
import type { Collectible } from '../services/api';

interface RecentListingsProps {
  items: Collectible[];
  onSelectItem: (item: Collectible) => void;
  selectedItem: Collectible | null;
  onDeleteCollectible: (id: string) => Promise<void>;
  searchQuery?: string;
}

export const RecentListings: React.FC<RecentListingsProps> = ({
  items,
  onSelectItem,
  selectedItem,
  onDeleteCollectible,
  searchQuery = '',
}) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

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
      
      {items.length === 0 ? (
        <div className="glass-panel rounded-xl flex flex-col items-center justify-center text-center py-2xl gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl">search_off</span>
          <p className="text-label-lg font-bold text-on-surface">No results found</p>
          <p className="text-label-sm text-on-surface-variant max-w-sm">
            {searchQuery
              ? <>We couldn't find any cars matching "<span className="text-on-surface font-medium">{searchQuery}</span>" in the marketplace. Try a different name, brand, or series.</>
              : 'No marketplace listings yet. Add a car to get started.'}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
        {items.map((item) => {
          const isSth = item.rarityLevel === 'Super Treasure Hunt';
          const isChase = item.rarityLevel === 'Chase';
          const isTh = item.rarityLevel === 'Treasure Hunt';
          const isSelected = selectedItem?.id === item.id;
          
          let cardBorderClass = 'border-transparent';
          let hoverBorderClass = 'hover:border-secondary';
          let glowClass = '';
          
          if (isSth) {
            glowClass = 'rarity-glow-sth';
            hoverBorderClass = 'hover:border-tertiary';
          } else if (isChase) {
            hoverBorderClass = 'hover:border-primary';
          }
          
          if (isSelected) {
            cardBorderClass = isSth 
              ? 'border-tertiary' 
              : isChase 
                ? 'border-primary' 
                : 'border-secondary';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`glass-panel rounded-xl overflow-hidden group cursor-pointer transition-all border ${cardBorderClass} ${hoverBorderClass} ${glowClass} ${
                isSelected ? 'scale-[0.98] bg-surface-container-high/55' : ''
              }`}
            >
              <div className="h-32 bg-surface-container relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={item.name}
                  src={item.image}
                />
                
                {isSth && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-tertiary text-on-tertiary text-[10px] rounded-full font-bold">
                    STH
                  </span>
                )}
                {isChase && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-on-primary text-[10px] rounded-full font-bold">
                    CHASE
                  </span>
                )}
                {isTh && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-secondary text-on-secondary text-[10px] rounded-full font-bold">
                    TH
                  </span>
                )}
                
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] rounded font-bold border border-white/10">
                  ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="p-sm">
                <div className="flex items-center justify-between mb-xs">
                  <span className={`text-[10px] font-bold uppercase ${
                    isSth 
                      ? 'text-tertiary' 
                      : isChase 
                        ? 'text-primary' 
                        : 'text-secondary'
                  }`}>
                    {item.brand}
                  </span>
                  
                  <div className="relative">
                    <button 
                      className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                      }}
                    >
                      <span className="material-symbols-outlined text-xs">more_vert</span>
                    </button>
                    {activeDropdownId === item.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-surface-container-highest border border-outline-variant rounded shadow-lg py-1 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-sm py-1.5 hover:bg-surface-container-high text-xs text-on-surface flex items-center gap-xs transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Set Featured
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setActiveDropdownId(null);
                            if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                              await onDeleteCollectible(item.id);
                            }
                          }}
                          className="w-full text-left px-sm py-1.5 hover:bg-surface-container-high text-xs text-error flex items-center gap-xs transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-label-md font-bold truncate text-on-surface">{item.name}</p>
                <p className="text-[11px] text-on-surface-variant">Series: {item.series || 'Custom Vault'}</p>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
