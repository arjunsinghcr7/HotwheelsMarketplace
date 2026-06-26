import React, { useEffect, useRef, useState } from 'react';
import type { Profile } from '../services/profile';
import { ProfileMenu } from './ProfileMenu';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateSection: (sectionId: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  profile: Profile;
  onSignIn: (email: string, username: string) => void;
  onSignOut: () => void;
  onUpdateProfile: (patch: Partial<Profile>) => void;
}

type NavItem = { label: string; kind: 'tab' | 'section'; value: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', kind: 'tab', value: 'Home' },
  { label: 'Shop', kind: 'tab', value: 'Marketplace' },
  { label: 'Collections', kind: 'tab', value: 'Collection' },
  { label: 'New Arrivals', kind: 'section', value: 'latest-arrivals' },
  { label: 'Limited Editions', kind: 'section', value: 'limited-editions' },
  { label: 'About', kind: 'section', value: 'footer-about' },
  { label: 'Contact', kind: 'section', value: 'footer' },
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onNavigateSection,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  profile,
  onSignIn,
  onSignOut,
  onUpdateProfile,
}) => {
  const [logoOk, setLogoOk] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown on outside click.
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [profileOpen]);

  const handleNav = (item: NavItem) => {
    if (item.kind === 'tab') setActiveTab(item.value);
    else onNavigateSection(item.value);
  };

  return (
    <header className="flex justify-between items-center w-full px-margin-desktop h-16 fixed top-0 z-50 bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex items-center gap-lg min-w-0">
        <button onClick={() => setActiveTab('Home')} className="shrink-0 flex items-center" aria-label="HotWheels Paradise — Home">
          {logoOk ? (
            <img
              src="/logo.png"
              alt="HotWheels Paradise"
              onError={() => setLogoOk(false)}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="text-headline-md font-headline-md font-bold text-primary tracking-tighter cursor-pointer">
              HotWheels Paradise
            </span>
          )}
        </button>
        <nav className="hidden xl:flex gap-1 items-center">
          {NAV_ITEMS.map((item) => {
            const active = item.kind === 'tab' && activeTab === item.value;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className={`px-sm py-xs rounded-lg text-label-md whitespace-nowrap transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-sm">
        {/* Search */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            title="Search the vault"
            onClick={() => document.getElementById('navbar-search')?.focus()}
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary text-sm p-0.5 rounded transition-colors cursor-pointer"
          >
            search
          </button>
          <input
            id="navbar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') setSearchQuery('');
            }}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-9 py-2 w-56 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-label-md transition-all text-on-surface placeholder:text-on-surface-variant/50"
            placeholder="Search the vault..."
            type="text"
          />
          {searchQuery && (
            <button
              type="button"
              title="Clear search"
              onClick={() => setSearchQuery('')}
              className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-sm p-0.5 rounded-full hover:bg-surface-container-high transition-colors"
            >
              close
            </button>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          aria-label={`Wishlist, ${wishlistCount} items`}
          className="btn-press relative p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined">favorite</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          aria-label={`Cart, ${cartCount} items`}
          className="btn-press relative p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Account"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className="btn-press w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant overflow-hidden hover:border-primary transition-colors"
          >
            <img className="w-full h-full object-cover" alt={profile.loggedIn ? profile.username : 'Account'} src={profile.avatar} />
          </button>
          {profileOpen && (
            <ProfileMenu
              profile={profile}
              onSignIn={(email, username) => { onSignIn(email, username); setProfileOpen(false); }}
              onSignOut={() => { onSignOut(); setProfileOpen(false); }}
              onUpdate={onUpdateProfile}
            />
          )}
        </div>
      </div>
    </header>
  );
};
