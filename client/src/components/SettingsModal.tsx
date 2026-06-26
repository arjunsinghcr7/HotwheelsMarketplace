import React, { useState } from 'react';
import type { Theme } from '../services/theme';
import { getTheme, setTheme } from '../services/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionCount: number;
  watchlistCount: number;
  onClearCollection: () => void;
  onClearWatchlist: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  collectionCount,
  watchlistCount,
  onClearCollection,
  onClearWatchlist,
}) => {
  const [theme, setThemeState] = useState<Theme>(getTheme());

  if (!isOpen) return null;

  const chooseTheme = (t: Theme) => {
    setTheme(t);
    setThemeState(t);
  };

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'light', label: 'Light', icon: 'light_mode' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-container-high border border-outline rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-secondary">settings</span> Settings
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-md space-y-lg">
          {/* Appearance */}
          <section>
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-sm">Appearance</p>
            <div className="grid grid-cols-2 gap-sm">
              {themeOptions.map((opt) => {
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => chooseTheme(opt.value)}
                    className={`flex items-center justify-center gap-xs p-sm rounded-xl border transition-all ${
                      active
                        ? 'border-secondary text-secondary bg-secondary-container/20 font-bold'
                        : 'border-outline-variant text-on-surface-variant hover:border-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined">{opt.icon}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-2">Switch between a light and dark interface.</p>
          </section>

          {/* Data management */}
          <section>
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-sm">Your Data</p>
            <div className="space-y-sm">
              <div className="flex items-center justify-between p-sm bg-surface-container rounded-lg border border-outline-variant">
                <div className="min-w-0">
                  <p className="text-label-md text-on-surface">My Collection</p>
                  <p className="text-[11px] text-on-surface-variant">{collectionCount} car{collectionCount === 1 ? '' : 's'} stored on this device</p>
                </div>
                <button
                  onClick={() => {
                    if (collectionCount > 0 && window.confirm('Remove all cars from your collection? This cannot be undone.')) {
                      onClearCollection();
                    }
                  }}
                  disabled={collectionCount === 0}
                  className="px-sm py-1.5 rounded-lg text-label-sm text-error border border-outline-variant hover:bg-surface-container-highest transition-colors disabled:opacity-40"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center justify-between p-sm bg-surface-container rounded-lg border border-outline-variant">
                <div className="min-w-0">
                  <p className="text-label-md text-on-surface">Watchlist</p>
                  <p className="text-[11px] text-on-surface-variant">{watchlistCount} car{watchlistCount === 1 ? '' : 's'} tracked</p>
                </div>
                <button
                  onClick={() => {
                    if (watchlistCount > 0 && window.confirm('Clear your tracking watchlist?')) {
                      onClearWatchlist();
                    }
                  }}
                  disabled={watchlistCount === 0}
                  className="px-sm py-1.5 rounded-lg text-label-sm text-error border border-outline-variant hover:bg-surface-container-highest transition-colors disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* About */}
          <section>
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-sm">About</p>
            <div className="p-sm bg-surface-container rounded-lg border border-outline-variant text-[11px] text-on-surface-variant">
              HotWheels Paradise — collection, marketplace, and an AI price assistant.
              Your collection and watchlist are stored privately in this browser.
            </div>
          </section>
        </div>

        <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-md py-sm bg-surface-container-highest hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
