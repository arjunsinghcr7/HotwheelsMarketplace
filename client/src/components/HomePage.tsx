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
  const inSection = (key: string) => collectibles.filter((c) => c.sections?.includes(key));
  const byDemand = [...collectibles].sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0));
  const featured = byDemand.slice(0, 4);

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

  const grid = (items: Collectible[], badge?: { label: string; cls: string }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-md">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : items.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              index={i}
              badgeOverride={badge}
              isWishlisted={wishlistNames.has(item.name)}
              onSelect={onSelect}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
    </div>
  );

  // Section badge styles matching the premium mockup.
  const BADGE = {
    best: { label: 'BEST SELLER', cls: 'bg-primary text-on-primary' },
    jdm: { label: 'JDM', cls: 'bg-purple-600 text-white' },
    latest: { label: 'NEW', cls: 'bg-green-500 text-black' },
    limited: { label: 'LIMITED', cls: 'bg-tertiary text-on-tertiary' },
    collector: { label: "COLLECTOR'S PICK", cls: 'bg-secondary text-on-secondary' },
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Cinematic background with a slow Ken-Burns zoom */}
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        {/* Lighting: side-darkening gradient, red key-light glow, vignette + floor fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(255,59,48,0.20),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-md py-xl">
          <div className="max-w-2xl">
            <p className="animate-slide-up text-label-md font-bold uppercase tracking-[0.3em] text-primary mb-md flex items-center gap-2">
              <span className="w-8 h-px bg-primary inline-block" /> Premium Die-Cast Marketplace
            </p>
            <h1 className="animate-slide-up delay-1 font-headline-xl text-[15vw] sm:text-[6rem] leading-[0.9] font-extrabold text-white tracking-tight drop-shadow-2xl">
              HOT WHEELS<br /><span className="text-primary">PARADISE</span>
            </h1>
            <p className="animate-slide-up delay-2 mt-md text-headline-md font-bold text-white/90 tracking-[0.15em] uppercase">Collect. Race. Display.</p>
            <p className="animate-slide-up delay-3 mt-sm text-body-lg text-white/70 max-w-xl">
              Discover authenticated Treasure Hunts, Super Treasure Hunts and grail-tier hypercars.
              Build the collection you've always wanted — one legendary casting at a time.
            </p>
            <div className="animate-slide-up delay-4 mt-lg flex flex-wrap gap-sm">
              <button
                onClick={onExplore}
                className="ripple btn-press px-lg py-sm rounded-xl racing-gradient text-white font-bold shadow-2xl hover:shadow-[0_0_36px_-6px_rgba(255,59,48,0.7)] transition-shadow text-label-lg"
              >
                Explore Collection
              </button>
              <button
                onClick={onShop}
                className="ripple btn-press px-lg py-sm rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white font-bold hover:bg-white/20 transition-colors text-label-lg"
              >
                Shop Now
              </button>
            </div>
            {/* Trust stats */}
            <div className="animate-fade-in mt-xl flex flex-wrap gap-lg text-white/80">
              <div>
                <p className="text-headline-md font-bold text-white">{collectibles.length || 45}+</p>
                <p className="text-[11px] uppercase tracking-wider text-white/50">Models</p>
              </div>
              <div className="w-px bg-white/15 self-stretch" />
              <div>
                <p className="text-headline-md font-bold text-white">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-white/50">Authenticated</p>
              </div>
              <div className="w-px bg-white/15 self-stretch" />
              <div>
                <p className="text-headline-md font-bold text-white">Free</p>
                <p className="text-[11px] uppercase tracking-wider text-white/50">Shipping over $100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-bounce">
          <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-md py-[5rem] space-y-[6rem]">
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
        <section id="best-sellers">
          <SectionHead eyebrow="Most wanted" title="⭐ Best Sellers" onMore={onShop} />
          {grid(inSection('best-seller'), BADGE.best)}
        </section>

        {/* ===================== JDM LEGENDS ===================== */}
        <section id="jdm-legends">
          <SectionHead eyebrow="Rising sun" title="🇯🇵 JDM Legends" onMore={onShop} />
          {grid(inSection('jdm'), BADGE.jdm)}
        </section>

        {/* ===================== LATEST ARRIVALS ===================== */}
        <section id="latest-arrivals">
          <SectionHead eyebrow="Fresh drops" title="🚀 Latest Arrivals" onMore={onShop} />
          {grid(inSection('latest'), BADGE.latest)}
        </section>

        {/* ===================== LIMITED EDITIONS ===================== */}
        <section id="limited-editions">
          <SectionHead eyebrow="Rare & numbered" title="💎 Limited Editions" onMore={onShop} />
          {grid(inSection('limited'), BADGE.limited)}
        </section>

        {/* ===================== COLLECTOR'S PICKS ===================== */}
        <section id="collector-picks">
          <SectionHead eyebrow="Grail tier" title="🏆 Collector's Picks" onMore={onShop} />
          {grid(inSection('collector'), BADGE.collector)}
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
