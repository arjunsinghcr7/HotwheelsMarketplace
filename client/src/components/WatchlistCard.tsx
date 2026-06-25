import React from 'react';
import type { WatchItem } from '../services/collection';

interface WatchlistCardProps {
  items: WatchItem[];
  onRemove: (id: string) => void;
}

const rarityColor = (level: string) => {
  if (level === 'Super Treasure Hunt') return 'text-tertiary';
  if (level === 'Chase') return 'text-primary';
  if (level === 'Treasure Hunt') return 'text-secondary';
  return 'text-on-surface-variant';
};

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ items, onRemove }) => {
  return (
    <div className="glass-panel p-md rounded-xl">
      <div className="flex items-center justify-between mb-md">
        <h4 className="font-headline-md text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">visibility</span>
          Tracking Watchlist
        </h4>
        <span className="text-label-sm text-on-surface-variant">{items.length} tracked</span>
      </div>

      {items.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant">
          Nothing tracked yet. Use <span className="text-secondary font-bold">Track</span> on the Vault Discovery form to watch a car's price here.
        </p>
      ) : (
        <div className="space-y-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-sm bg-surface-container rounded-lg p-sm border border-outline-variant"
            >
              <span className="material-symbols-outlined text-on-surface-variant">monitoring</span>
              <div className="flex-1 min-w-0">
                <p className="text-label-md font-bold truncate text-on-surface">{item.name}</p>
                <p className={`text-[11px] font-bold uppercase ${rarityColor(item.rarityLevel)}`}>
                  {item.brand}{item.releaseYear ? ` · ${item.releaseYear}` : ''} · {item.rarityLevel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-label-sm text-on-surface-variant">Target</p>
                <p className="text-label-md font-bold text-secondary">
                  ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-highest transition-colors"
                title="Stop tracking"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
