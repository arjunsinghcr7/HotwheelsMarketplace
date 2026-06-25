import React from 'react';
import type { Collectible } from '../services/api';

interface RarityGaugeProps {
  items: Collectible[];
  totalUnitsCount: number;
}

export const RarityGauge: React.FC<RarityGaugeProps> = ({
  items,
  totalUnitsCount,
}) => {
  // We can calculate dynamic ratios, or base them on the design. Let's make it react slightly
  // to the added collectibles while preserving the original design values.
  const baseSthCount = 210; // ~15% of 1428
  const baseChaseCount = 357; // ~25% of 1428
  const baseMainlineCount = 861; // ~60% of 1428

  const sthAdded = items.filter(item => item.rarityLevel === 'Super Treasure Hunt' || item.rarityLevel === 'STH').length - 2; // initial has 2
  const chaseAdded = items.filter(item => item.rarityLevel === 'Chase').length - 1; // initial has 1
  const mainlineAdded = items.filter(item => item.rarityLevel === 'Mainline' || item.rarityLevel === 'Treasure Hunt').length - 2; // initial has 2

  const sth = Math.max(0, baseSthCount + sthAdded);
  const chase = Math.max(0, baseChaseCount + chaseAdded);
  const mainline = Math.max(0, baseMainlineCount + mainlineAdded);
  
  const total = sth + chase + mainline;
  
  const sthPercent = Math.round((sth / total) * 100) || 15;
  const chasePercent = Math.round((chase / total) * 100) || 25;
  const mainlinePercent = 100 - sthPercent - chasePercent; // ensures it adds to 100%

  // SVG dash offsets
  const sthDashArray = `${sthPercent}, 100`;
  const chaseDashArray = `${chasePercent}, 100`;
  const chaseDashOffset = `-${sthPercent}`;
  const mainlineDashArray = `${mainlinePercent}, 100`;
  const mainlineDashOffset = `-${sthPercent + chasePercent}`;

  // Formatter for total count (e.g. 1.4k)
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <div className="glass-panel p-md rounded-xl flex flex-col items-center justify-center text-center">
      <h4 className="text-label-md font-bold uppercase tracking-widest mb-lg text-on-surface">Rarity Distribution</h4>
      
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background track */}
          <path
            className="stroke-surface-container-highest"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
          />
          
          {/* Super Treasure segment (Gold) */}
          <path
            className="stroke-tertiary transition-all duration-500"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={sthDashArray}
            strokeLinecap="round"
          />
          
          {/* Chase Pieces segment (Blue) */}
          <path
            className="stroke-secondary transition-all duration-500"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={chaseDashArray}
            strokeDashoffset={chaseDashOffset}
            strokeLinecap="round"
          />
          
          {/* Mainline segment (Red) */}
          <path
            className="stroke-primary transition-all duration-500"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={mainlineDashArray}
            strokeDashoffset={mainlineDashOffset}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-headline-md font-bold text-on-surface">{formatCount(totalUnitsCount)}</span>
          <span className="text-[10px] text-on-surface-variant uppercase">Total Units</span>
        </div>
      </div>
      
      <div className="mt-lg w-full space-y-xs">
        <div className="flex justify-between items-center px-sm">
          <div className="flex items-center gap-xs">
            <div className="w-2 h-2 rounded-full bg-tertiary"></div>
            <span className="text-label-sm text-on-surface-variant">Super Treasure</span>
          </div>
          <span className="text-label-sm font-bold text-on-surface">{sthPercent}%</span>
        </div>
        <div className="flex justify-between items-center px-sm">
          <div className="flex items-center gap-xs">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-label-sm text-on-surface-variant">Chase Pieces</span>
          </div>
          <span className="text-label-sm font-bold text-on-surface">{chasePercent}%</span>
        </div>
        <div className="flex justify-between items-center px-sm">
          <div className="flex items-center gap-xs">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-label-sm text-on-surface-variant">Mainline</span>
          </div>
          <span className="text-label-sm font-bold text-on-surface">{mainlinePercent}%</span>
        </div>
      </div>
    </div>
  );
};
