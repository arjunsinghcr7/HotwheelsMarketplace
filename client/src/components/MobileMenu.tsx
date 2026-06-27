import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeMenu: string;
  onSetTab: (tab: string) => void;
  onSetMenu: (menu: string) => void;
  onNavigateSection: (id: string) => void;
  onOpenRarityGuide: () => void;
  onOpenSettings: () => void;
}

type Item = { label: string; icon: string; menu?: string; run: () => void };

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  activeMenu,
  onSetTab,
  onSetMenu,
  onNavigateSection,
  onOpenRarityGuide,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  // Wrap each action so it also closes the menu.
  const go = (fn: () => void) => () => {
    fn();
    onClose();
  };

  const primary: Item[] = [
    { label: 'Home', icon: 'home', run: go(() => onSetTab('Home')) },
    { label: 'Shop', icon: 'storefront', menu: 'Marketplace', run: go(() => onSetTab('Marketplace')) },
    { label: 'My Collection', icon: 'collections_bookmark', menu: 'My Collection', run: go(() => onSetMenu('My Collection')) },
    { label: 'Analytics', icon: 'monitoring', menu: 'Analytics', run: go(() => onSetMenu('Analytics')) },
    { label: 'Community', icon: 'forum', menu: 'Community', run: go(() => onSetTab('Community')) },
  ];

  const discover: Item[] = [
    { label: 'New Arrivals', icon: 'auto_awesome', run: go(() => onNavigateSection('latest-arrivals')) },
    { label: 'Limited Editions', icon: 'diamond', run: go(() => onNavigateSection('limited-editions')) },
    { label: "Collector's Picks", icon: 'workspace_premium', run: go(() => onNavigateSection('collector-picks')) },
  ];

  const more: Item[] = [
    { label: 'About', icon: 'info', run: go(() => onNavigateSection('footer-about')) },
    { label: 'Contact', icon: 'mail', run: go(() => onNavigateSection('footer')) },
    { label: 'Rarity Guide', icon: 'stars', run: go(onOpenRarityGuide) },
    { label: 'Settings', icon: 'settings', run: go(onOpenSettings) },
  ];

  const Row = ({ items, heading }: { items: Item[]; heading: string }) => (
    <div className="space-y-1">
      <p className="text-label-sm uppercase tracking-widest text-on-surface-variant px-sm">{heading}</p>
      {items.map((it) => {
        const active = it.menu && activeMenu === it.menu;
        return (
          <button
            key={it.label}
            onClick={it.run}
            className={`flex items-center gap-sm p-sm w-full text-left rounded-lg transition-colors ${
              active ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{it.icon}</span>
            <span className="text-label-md">{it.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] xl:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-surface-container-low border-r border-outline-variant shadow-2xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <span className="font-headline-md font-bold text-primary tracking-tight">HotWheels Paradise</span>
          <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-md border-b border-outline-variant">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                onSetTab('Marketplace');
                onClose();
              }
            }}
            className="relative"
          >
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the vault…"
              aria-label="Search"
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-9 pr-3 py-2.5 text-label-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </form>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">
          <Row items={primary} heading="Browse" />
          <Row items={discover} heading="Discover" />
          <Row items={more} heading="More" />
        </nav>
      </div>
    </div>
  );
};
