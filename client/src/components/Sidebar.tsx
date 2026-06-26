import React from 'react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onOpenRarityGuide: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  onOpenRarityGuide,
  onOpenSettings,
}) => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col p-md bg-surface-container-low border-r border-outline-variant z-40 hidden xl:flex">
      <div className="mb-lg">
        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-sm">Collector Hub</p>
        <div className="space-y-1">
          <button
            onClick={() => setActiveMenu('Marketplace')}
            className={`flex items-center gap-sm p-sm w-full text-left rounded-lg transition-all ${
              activeMenu === 'Marketplace'
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-lg">storefront</span>
            <span className="text-label-md">Marketplace</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('My Collection')}
            className={`flex items-center gap-sm p-sm w-full text-left rounded-lg transition-all ${
              activeMenu === 'My Collection'
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-lg">folder_special</span>
            <span className="text-label-md">My Collection</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('Analytics')}
            className={`flex items-center gap-sm p-sm w-full text-left rounded-lg transition-all ${
              activeMenu === 'Analytics'
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-lg">monitoring</span>
            <span className="text-label-md">Analytics</span>
          </button>
          
          <button
            onClick={onOpenRarityGuide}
            className={`flex items-center gap-sm p-sm w-full text-left rounded-lg transition-all ${
              activeMenu === 'Rarity Guide'
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-lg">stars</span>
            <span className="text-label-md">Rarity Guide</span>
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-md border-t border-outline-variant">
        <div className="bg-surface-container-high p-sm rounded-xl border border-outline-variant mb-md">
          <div className="flex items-center gap-sm mb-xs">
            <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#fabd00]"></div>
            <span className="text-label-sm font-bold text-tertiary">Pro Collector</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Expert Tier Account</p>
        </div>
        
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-sm p-sm w-full text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="text-label-md">Settings</span>
        </button>
        
        <button 
          onClick={() => alert('Support ticket system opening...')}
          className="flex items-center gap-sm p-sm w-full text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="text-label-md">Support</span>
        </button>
      </div>
    </aside>
  );
};
