import React, { useEffect, useState } from 'react';
import { fetchTicker } from '../services/api';
import type { TickerItem } from '../services/api';

export const LiveTicker: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    async function loadTicker() {
      try {
        const data = await fetchTicker();
        setTickerItems(data);
      } catch (error) {
        console.error('Failed to load ticker', error);
      }
    }
    loadTicker();
    
    // Refresh ticker every 10 seconds to simulate live updates
    const interval = setInterval(loadTicker, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full h-8 bg-surface-container-lowest border-t border-outline-variant z-50 flex items-center px-md">
      <div className="flex items-center gap-xs pr-md border-r border-outline-variant h-full">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Live Market</span>
      </div>
      
      <div className="flex-1 overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-lg items-center">
          {/* Map original items */}
          {tickerItems.map((item, idx) => {
            const isUp = item.direction === 'up';
            const isDown = item.direction === 'down';
            const colorClass = isUp 
              ? 'text-green-400' 
              : isDown 
                ? 'text-red-400' 
                : 'text-on-surface';
            const arrow = isUp ? '▲' : isDown ? '▼' : '-';
            
            return (
              <span key={`orig-${idx}`} className="text-[10px] flex items-center gap-xs text-on-surface">
                {item.name}:{' '}
                <span className={`${colorClass} font-semibold`}>
                  ${item.price.toFixed(2)} {arrow} {item.change.toFixed(1)}%
                </span>
              </span>
            );
          })}
          
          {/* Duplicate map for seamless marquee loop */}
          {tickerItems.map((item, idx) => {
            const isUp = item.direction === 'up';
            const isDown = item.direction === 'down';
            const colorClass = isUp 
              ? 'text-green-400' 
              : isDown 
                ? 'text-red-400' 
                : 'text-on-surface';
            const arrow = isUp ? '▲' : isDown ? '▼' : '-';
            
            return (
              <span key={`dup-${idx}`} className="text-[10px] flex items-center gap-xs text-on-surface">
                {item.name}:{' '}
                <span className={`${colorClass} font-semibold`}>
                  ${item.price.toFixed(2)} {arrow} {item.change.toFixed(1)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
