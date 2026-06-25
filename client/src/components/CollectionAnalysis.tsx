import React from 'react';
import type { MyCar } from '../services/collection';

interface CollectionAnalysisProps {
  cars: MyCar[];
}

const RARITY_META: { key: string; color: string; dot: string }[] = [
  { key: 'Super Treasure Hunt', color: 'text-tertiary', dot: 'bg-tertiary' },
  { key: 'Chase', color: 'text-primary', dot: 'bg-primary' },
  { key: 'Treasure Hunt', color: 'text-secondary', dot: 'bg-secondary' },
  { key: 'Mainline', color: 'text-on-surface', dot: 'bg-on-surface-variant' },
];

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export const CollectionAnalysis: React.FC<CollectionAnalysisProps> = ({ cars }) => {
  const count = cars.length;
  const totalValue = cars.reduce((s, c) => s + c.price, 0);
  const avg = count ? totalValue / count : 0;
  const sorted = [...cars].sort((a, b) => b.price - a.price);
  const mostValuable = sorted[0];
  const leastValuable = sorted[sorted.length - 1];
  const maxPrice = mostValuable?.price || 1;

  // Value grouped by rarity
  const byRarity = RARITY_META.map((r) => {
    const items = cars.filter((c) => c.rarityLevel === r.key);
    const value = items.reduce((s, c) => s + c.price, 0);
    return { ...r, items: items.length, value, share: totalValue ? (value / totalValue) * 100 : 0 };
  }).filter((r) => r.items > 0);

  if (count === 0) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar p-sm lg:p-lg">
        <div className="glass-panel rounded-xl p-lg flex flex-col items-center justify-center text-center gap-sm text-on-surface-variant min-h-[16rem]">
          <span className="material-symbols-outlined text-5xl">monitoring</span>
          <p className="text-label-md">No cars to analyze yet.</p>
          <p className="text-label-sm">Add cars in <span className="text-secondary font-bold">My Collection</span> to see your price analysis here.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Collection Value', value: money(totalValue), icon: 'payments', accent: 'text-secondary' },
    { label: 'Cars Owned', value: count.toString(), icon: 'directions_car', accent: 'text-white' },
    { label: 'Average Value', value: money(avg), icon: 'functions', accent: 'text-white' },
    { label: 'Most Valuable', value: money(maxPrice), icon: 'trophy', accent: 'text-tertiary' },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-sm lg:p-lg flex flex-col gap-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">monitoring</span>
          Collection Analysis
        </h2>
        <p className="text-label-sm text-on-surface-variant mt-1">
          Price breakdown across the {count} car{count === 1 ? '' : 's'} in your collection.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-md">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel p-md rounded-xl">
            <div className="flex justify-between items-start mb-sm">
              <p className="text-label-sm text-on-surface-variant">{s.label}</p>
              <span className={`material-symbols-outlined ${s.accent}`}>{s.icon}</span>
            </div>
            <p className={`text-headline-md font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
        {/* Per-car value bars */}
        <div className="xl:col-span-2 glass-panel p-md rounded-xl">
          <h4 className="text-label-md font-bold uppercase tracking-widest text-on-surface mb-md">
            Value by Car
          </h4>
          <div className="space-y-sm">
            {sorted.map((car) => (
              <div key={car.id} className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded bg-surface-container overflow-hidden flex-shrink-0">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-label-sm text-on-surface truncate">{car.name}</span>
                    <span className="text-label-sm font-bold text-on-surface ml-2">{money(car.price)}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, (car.price / maxPrice) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value by rarity */}
        <div className="glass-panel p-md rounded-xl">
          <h4 className="text-label-md font-bold uppercase tracking-widest text-on-surface mb-md">
            Value by Rarity
          </h4>
          <div className="space-y-md">
            {byRarity.map((r) => (
              <div key={r.key}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`}></span>
                    <span className="text-label-sm text-on-surface-variant">{r.key}</span>
                  </div>
                  <span className={`text-label-sm font-bold ${r.color}`}>{Math.round(r.share)}%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className={`${r.dot} h-full rounded-full transition-all duration-500`} style={{ width: `${r.share}%` }}></div>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {r.items} car{r.items === 1 ? '' : 's'} · {money(r.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="mt-lg pt-md border-t border-outline-variant space-y-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-tertiary text-sm">trophy</span> Top car
              </span>
              <span className="text-label-sm font-bold text-on-surface truncate ml-2">{mostValuable.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">trending_down</span> Entry car
              </span>
              <span className="text-label-sm font-bold text-on-surface truncate ml-2">{leastValuable.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
