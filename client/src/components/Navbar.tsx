import React from 'react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="flex justify-between items-center w-full px-margin-desktop h-16 fixed top-0 z-50 bg-surface-dim border-b border-outline-variant">
      <div className="flex items-center gap-lg">
        <span 
          className="text-headline-md font-headline-md font-bold text-primary tracking-tighter cursor-pointer"
          onClick={() => setActiveTab('Marketplace')}
        >
          HotWheels Paradise
        </span>
        <div className="hidden md:flex gap-md items-center">
          <nav className="flex gap-sm">
            <button
              onClick={() => setActiveTab('Marketplace')}
              className={`px-sm py-xs font-label-md transition-colors hover:bg-surface-container-high ${
                activeTab === 'Marketplace'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('Collection')}
              className={`px-sm py-xs font-label-md transition-colors hover:bg-surface-container-high ${
                activeTab === 'Collection'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setActiveTab('Community')}
              className={`px-sm py-xs font-label-md transition-colors hover:bg-surface-container-high ${
                activeTab === 'Community'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant'
              }`}
            >
              Community
            </button>
          </nav>
        </div>
      </div>
      
      <div className="flex items-center gap-md">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            id="navbar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-label-md transition-all text-on-surface placeholder:text-on-surface-variant/50"
            placeholder="Search the vault..."
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-xs">
          <button
            id="notifications-btn"
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div
            id="profile-dropdown"
            className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant cursor-pointer overflow-hidden"
            title="User Profile"
          >
            <img 
              className="w-full h-full object-cover" 
              alt="A professional profile headshot of a serious male collector in his 30s." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6tw_BZmhf8Dz3kAAkBB9QOwRRjDPdvPld16xv4xb2aTJd5KHNGxQ72UWkZKHqIM1j6A2kJWGrEC9orVXQy9lnRPe4tjo49UIaouf9LGzbSBqoMxgThmIW4oeCmBDX9TL2MhttDhiN7_0z1BWkmbxew67XcTfIFsocIv3nrohaowusqfsx9Hn_fwFL_XzZmjE36AMu2hEDafSE5Bt_nsGv6SrjCieUHZRoaBIiRIpx5LLSAmdkIighxSaitRn60LBJWWihGw9hwD9-"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
