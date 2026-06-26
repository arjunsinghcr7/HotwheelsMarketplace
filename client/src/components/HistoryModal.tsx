import React from 'react';
import { formatPrice } from '../utils/format';
import type { Collectible } from '../services/api';

interface HistoryModalProps {
  item: Collectible;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock historic sales entries
  const historyData = [
    { date: 'Jun 20, 2026', action: 'Bought', price: item.price, condition: item.condition, collector: 'Collector #0492' },
    { date: 'May 15, 2026', action: 'Sold', price: item.price * 0.92, condition: item.condition, collector: 'Collector #0121' },
    { date: 'Apr 10, 2026', action: 'Valued', price: item.price * 0.85, condition: 'Near Mint (NM)', collector: 'Vault System' },
    { date: 'Jan 05, 2026', action: 'Minted', price: item.price * 0.50, condition: 'Mint (M)', collector: 'Factory Release' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-surface-container-high border border-outline rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface">Price History: {item.name}</h3>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-md overflow-y-auto max-h-[60vh] space-y-md custom-scrollbar">
          <div className="flex gap-md items-center bg-surface-container p-sm rounded-lg border border-outline-variant">
            <img 
              className="w-16 h-16 object-cover rounded bg-surface-dim"
              src={item.image} 
              alt={item.name} 
            />
            <div>
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">{item.brand}</p>
              <h4 className="text-label-md font-bold text-on-surface">{item.name}</h4>
              <p className="text-xs text-on-surface-variant">Series: {item.series} | Year: {item.releaseYear}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse text-label-sm text-on-surface">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant">
                <th className="py-2">Date</th>
                <th className="py-2">Action</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2">Condition</th>
                <th className="py-2">Party</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 font-mono text-[11px]">{row.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.action === 'Bought' 
                        ? 'bg-green-400/10 text-green-400' 
                        : row.action === 'Sold' 
                          ? 'bg-secondary/10 text-secondary' 
                          : 'bg-on-surface-variant/10 text-on-surface-variant'
                    }`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-right font-bold text-on-surface">
                    {formatPrice(row.price)}
                  </td>
                  <td className="py-3 text-on-surface-variant">{row.condition}</td>
                  <td className="py-3 text-on-surface-variant">{row.collector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-md py-sm bg-surface-container-highest hover:bg-surface-container-high text-on-surface rounded-lg transition-colors text-label-md font-bold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
