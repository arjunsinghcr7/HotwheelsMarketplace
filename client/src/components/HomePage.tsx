import React from 'react';
import type { Collectible } from '../services/api';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { Footer } from './Footer';

interface HomePageProps {
  collectibles: Collectible[];
  isLoading: boolean;
  wishlistNames: Set<string>;
  onSelect: (item: Collectible) => void;
  onShop: () => void;
  onExplore: () => void;
  onAddToCart: (item: Collectible) => void;
  onToggleWishlist: (item: Collectible) => void;
}

const HERO_BG =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop';

// A section header with an optional "View all" affordance.
const SectionHead: React.FC<{ eyebrow?: string; title: string; onMore?: () => void }> = ({
  eyebrow,
  title,
  onMore,
}) => (
  <div className="flex items-end justify-between gap-md mb-md">
    <div>
      {eyebrow && <p className="text-label-sm font-bold uppercase tracking-widest text-primary mb-1">{eyebrow}</p>}
      <h2 className="font-headline-lg text-headline-lg text-on-surface">{title}</h2>
    </div>
    {onMore && (
      <button onClick={onMore} className="text-secondary text-label-sm flex items-center gap-xs group hover:underline shrink-0">
        View all
        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
    )}
  </div>
);

export const HomePage: React.FC<HomePageProps> = ({
  collectibles,
  isLoading,
  wishlistNames,
  onSelect,
  onShop,
  onExplore,
  onAddToCart,
  onToggleWishlist,
}) => {
  const byDemand = [...collectibles].sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0));
  const featured = byDemand.slice(0, 4);
  const bestSellers = collectibles.filter((c) => (c.demandScore ?? 0) >= 92).slice(0, 4);
  const latest = [...collectibles].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 4);
  const limited = collectibles
    .filter((c) => c.rarityLevel === 'Super Treasure Hunt' || c.rarityLevel === 'Chase')
    .slice(0, 4);
  const collectorPicks = [...collectibles].sort((a, b) => b.price - a.price).slice(0, 4);

  // Categories derived from the catalog (vehicle types) with counts.
  const categoryMap = new Map<string, number>();
  for (const c of collectibles) categoryMap.set(c.vehicleType, (categoryMap.get(c.vehicleType) ?? 0) + 1);
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const CATEGORY_ICON: Record<string, string> = {
    JDM: 'speed',
    Hypercar: 'rocket_launch',
    Supercar: 'auto_awesome',
    'Classic Supercar': 'auto_awesome',
    Muscle: 'local_fire_department',
    Performance: 'bolt',
    'Sports Coupe': 'directions_car',
    'Electric Hypercar': 'electric_bolt',
  };

  const grid = (items: Collectible[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-md">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : items.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              index={i}
              isWishlisted={wishlistNames.has(item.name)}
              onSelect={onSelect}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[78vh] flex items-center overflow-hidden">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-md py-xl">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-label-md font-bold uppercase tracking-[0.3em] text-primary mb-md">Premium Die-Cast Marketplace</p>
            <h1 className="font-headline-xl text-[14vw] sm:text-[5.5rem] leading-[0.95] font-extrabold text-white tracking-tight">
              HOT WHEELS<br />PARADISE
            </h1>
            <p className="mt-md text-headline-md font-bold text-white/90 tracking-wide">Collect. Race. Display.</p>
            <p className="mt-sm text-body-lg text-white/70 max-w-xl">
              Discover authenticated Treasure Hunts, Super Treasure Hunts and grail-tier hypercars.
              Build the collection you've always wanted — one legendary casting at a time.
            </p>
            <div className="mt-lg flex flex-wrap gap-sm">
              <button
                onClick={onExplore}
                className="btn-press px-lg py-sm rounded-xl racing-gradient text-white font-bold shadow-2xl hover:shadow-[0_0_30px_-5px_rgba(255,59,48,0.6)] transition-shadow"
              >
                Explore Collection
              </button>
              <button
                onClick={onShop}
                className="btn-press px-lg py-sm rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white font-bold hover:bg-white/20 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-md py-xl space-y-xl">
        {/* ===================== FEATURED ===================== */}
        <section>
          <SectionHead eyebrow="Hand-picked" title="Featured Cars" onMore={onShop} />
          {grid(featured)}
        </section>

        {/* ===================== SHOP BY CATEGORY ===================== */}
        <section id="categories">
          <SectionHead eyebrow="Browse" title="Shop by Category" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-md">
            {(categories.length ? categories : [['Exotic', 0], ['Muscle', 0], ['JDM', 0]] as [string, number][]).map(
              ([name, count], i) => (
                <button
                  key={name}
                  onClick={onShop}
                  className={`card-lift animate-slide-up glass-panel rounded-2xl p-md flex flex-col items-center gap-2 text-center hover:border-primary border border-outline-variant ${
                    i % 4 === 1 ? 'delay-1' : i % 4 === 2 ? 'delay-2' : i % 4 === 3 ? 'delay-3' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">{CATEGORY_ICON[name] ?? 'directions_car'}</span>
                  <span className="text-label-md font-bold text-on-surface">{name}</span>
                  {count > 0 && <span className="text-[11px] text-on-surface-variant">{count} models</span>}
                </button>
              )
            )}
          </div>
        </section>

        {/* ===================== BEST SELLERS ===================== */}
        <section>
          <SectionHead eyebrow="Most wanted" title="Best Sellers" onMore={onShop} />
          {grid(bestSellers.length ? bestSellers : featured)}
        </section>

        {/* ===================== LATEST ARRIVALS ===================== */}
        <section id="latest-arrivals">
          <SectionHead eyebrow="Fresh drops" title="Latest Arrivals" onMore={onShop} />
          {grid(latest)}
        </section>

        {/* ===================== LIMITED EDITIONS ===================== */}
        <section id="limited-editions">
          <SectionHead eyebrow="Rare & numbered" title="Limited Editions" onMore={onShop} />
          {grid(limited)}
        </section>

        {/* ===================== COLLECTOR PICKS ===================== */}
        <section>
          <SectionHead eyebrow="Grail tier" title="Collector Picks" onMore={onShop} />
          {grid(collectorPicks)}
        </section>

        {/* ===================== TESTIMONIALS ===================== */}
        <section>
          <SectionHead eyebrow="Loved by collectors" title="What Collectors Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {[
              { name: 'Marcus R.', role: 'STH Hunter', text: 'Pulled a grail GT3 RS in mint condition. Authentication was flawless and shipping was lightning fast.' },
              { name: 'Aisha K.', role: 'JDM Collector', text: 'The best curated JDM selection I have found anywhere. My R34 arrived exactly as described.' },
              { name: 'Diego M.', role: 'Hypercar Fan', text: 'Finally a marketplace that feels premium. The detail and condition grading are next level.' },
            ].map((t, i) => (
              <div key={t.name} className={`glass-panel rounded-2xl p-md animate-slide-up ${i === 1 ? 'delay-1' : i === 2 ? 'delay-2' : ''}`}>
                <div className="flex gap-0.5 mb-sm text-tertiary">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <span key={s} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-body-md text-on-surface/90">“{t.text}”</p>
                <p className="mt-sm text-label-md font-bold text-on-surface">{t.name}</p>
                <p className="text-[11px] text-on-surface-variant">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== NEWSLETTER CTA ===================== */}
        <section className="relative overflow-hidden rounded-2xl border border-outline-variant">
          <div className="absolute inset-0 racing-gradient opacity-90" />
          <div className="relative z-10 p-xl text-center">
            <h2 className="font-headline-lg text-headline-lg text-white">Never miss a drop</h2>
            <p className="text-white/80 mt-sm max-w-xl mx-auto">
              Join thousands of collectors getting first access to restocks, rare finds and member-only releases.
            </p>
            <button onClick={onExplore} className="btn-press mt-md px-lg py-sm rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors">
              Start Collecting
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};
