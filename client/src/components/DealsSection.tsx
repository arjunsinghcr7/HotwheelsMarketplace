import React from 'react';
import type { Deal } from '../services/api';

interface DealsSectionProps {
  deals: Deal[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ deals }) => {
  return (
    <div className="glass-panel p-md rounded-xl">
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-tertiary">loyalty</span>
        <h4 className="font-headline-md text-on-surface">Deals for You</h4>
      </div>
      
      <div className="flex gap-md overflow-x-auto pb-sm custom-scrollbar">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => alert(`Purchasing ${deal.name} deal!`)}
            className="flex-shrink-0 w-64 p-sm bg-surface-container rounded-lg border border-outline-variant flex gap-sm items-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded bg-surface-dim overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt={deal.name}
                src={deal.image}
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="text-label-sm font-bold truncate text-on-surface">{deal.name}</p>
              <p className="text-[11px] text-green-400 font-bold">
                ${deal.price.toFixed(2)}{' '}
                <span className="text-on-surface-variant line-through font-normal ml-1">
                  ${deal.originalPrice.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
