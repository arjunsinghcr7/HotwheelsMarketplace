import React, { useState } from 'react';

export interface CarFormData {
  name: string;
  brand: string;
  vehicleType: string;
  scale: string;
  condition: string;
  releaseYear: number;
  price: number;
  rarityLevel: string;
  notes: string;
}

type Action = 'buy' | 'sell' | 'track';

interface VaultDiscoveryFormProps {
  onBuy: (data: CarFormData) => Promise<void> | void;
  onSell: (data: CarFormData) => Promise<void> | void;
  onTrack: (data: CarFormData) => Promise<void> | void;
  onClose?: () => void;
}

export const VaultDiscoveryForm: React.FC<VaultDiscoveryFormProps> = ({ onBuy, onSell, onTrack, onClose }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Hot Wheels');
  const [vehicleType, setVehicleType] = useState('Muscle');
  const [scale, setScale] = useState('1:64');
  const [condition, setCondition] = useState('Mint (M)');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [price, setPrice] = useState('');
  const [rarityLevel, setRarityLevel] = useState('Treasure Hunt'); // Default in screen layout
  const [notes, setNotes] = useState('');
  const [activeAction, setActiveAction] = useState<Action | ''>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const rarityLevels = ['Mainline', 'Treasure Hunt', 'Super Treasure Hunt', 'Chase'];

  // Validate inputs and build the payload, or return null and surface an error.
  const buildData = (): CarFormData | null => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Product Name / Series is required.');
      return null;
    }
    if (!releaseYear || isNaN(Number(releaseYear))) {
      setErrorMessage('Please enter a valid Release Year.');
      return null;
    }
    const cleanPrice = price.replace('$', '').trim();
    if (!cleanPrice || isNaN(Number(cleanPrice)) || Number(cleanPrice) < 0) {
      setErrorMessage('Please enter a valid positive Price.');
      return null;
    }

    return {
      name: name.trim(),
      brand,
      vehicleType,
      scale,
      condition,
      releaseYear: parseInt(releaseYear),
      price: parseFloat(cleanPrice),
      rarityLevel,
      notes,
    };
  };

  const SUCCESS_TEXT: Record<Action, string> = {
    buy: 'Added to your collection — see the Collection tab.',
    sell: 'Listed on the marketplace — see Recent Listings.',
    track: 'Now tracking this car in your watchlist.',
  };

  const handleAction = async (action: Action) => {
    if (activeAction) return; // prevent double-submits
    const data = buildData();
    if (!data) return;

    try {
      setActiveAction(action);
      if (action === 'buy') await onBuy(data);
      else if (action === 'sell') await onSell(data);
      else await onTrack(data);

      // Reset the entry fields
      setName('');
      setPrice('');
      setNotes('');
      setRarityLevel('Treasure Hunt');
      setSuccessMessage(SUCCESS_TEXT[action]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Action failed. Please try again.');
    } finally {
      setActiveAction('');
    }
  };

  // Enter key in the form triggers the primary action (Buy).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction('buy');
  };

  return (
    <section className="w-full h-full border-r border-outline-variant flex flex-col bg-surface-container-lowest">
      <div className="p-md border-b border-outline-variant flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface">Vault Discovery</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-md custom-scrollbar space-y-lg">
        {errorMessage && (
          <div className="p-sm bg-error-container text-on-error-container rounded-lg text-label-sm border border-outline-variant">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-sm bg-secondary-container text-on-secondary-container rounded-lg text-label-sm border border-outline-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {successMessage}
          </div>
        )}

        <div className="space-y-md">
          {/* Product Name */}
          <div className="group flex flex-col">
            <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
              Product Name / Series
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all text-body-md text-on-surface placeholder:text-on-surface-variant/40"
              placeholder="e.g. 1968 Chevy Camaro"
              type="text"
            />
          </div>

          {/* Brand & Type */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface"
              >
                <option>Hot Wheels</option>
                <option>Matchbox</option>
                <option>M2 Machines</option>
              </select>
            </div>
            <div className="group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface"
              >
                <option>Muscle</option>
                <option>Exotic</option>
                <option>Truck</option>
                <option>Vintage</option>
              </select>
            </div>
          </div>

          {/* Scale & Condition */}
          <div className="grid grid-cols-3 gap-sm">
            <div className="group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Scale
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface"
              >
                <option>1:64</option>
                <option>1:43</option>
                <option>1:24</option>
              </select>
            </div>
            <div className="col-span-2 group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface"
              >
                <option>Mint (M)</option>
                <option>Near Mint (NM)</option>
                <option>Very Good (VG)</option>
              </select>
            </div>
          </div>

          {/* Year & Price */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Release Year
              </label>
              <input
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface"
                placeholder="2024"
                type="number"
              />
            </div>
            <div className="group flex flex-col">
              <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
                Price (USD)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md font-mono text-on-surface"
                placeholder="$0.00"
                type="text"
              />
            </div>
          </div>

          {/* Rarity Level */}
          <div className="group flex flex-col">
            <label className="block text-label-sm text-on-surface-variant mb-xs">
              Rarity Level
            </label>
            <div className="flex flex-wrap gap-xs">
              {rarityLevels.map((level) => {
                const isActive = rarityLevel === level;
                let activeClasses = '';
                if (isActive) {
                  if (level === 'Treasure Hunt') activeClasses = 'border-secondary text-secondary';
                  else if (level === 'Super Treasure Hunt') activeClasses = 'border-tertiary text-tertiary';
                  else if (level === 'Chase') activeClasses = 'border-primary text-primary';
                  else activeClasses = 'border-on-surface text-on-surface';
                }
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setRarityLevel(level)}
                    className={`px-sm py-xs bg-surface-container border rounded-full text-label-sm transition-all ${
                      isActive 
                        ? activeClasses 
                        : 'border-outline-variant hover:border-secondary text-on-surface-variant'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="group flex flex-col">
            <label className="block text-label-sm text-on-surface-variant group-focus-within:text-secondary mb-xs transition-colors">
              Seller/Owner Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none transition-all text-body-md resize-none text-on-surface placeholder:text-on-surface-variant/40"
              placeholder="Add specific details about the carding or storage..."
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-sm">
          {/* Buy: add to your personal collection */}
          <button
            type="submit"
            disabled={!!activeAction}
            title="Add this car to your collection"
            className="flex flex-col items-center justify-center gap-1 py-sm racing-gradient text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="text-label-sm">{activeAction === 'buy' ? 'Buying…' : 'Buy'}</span>
          </button>

          {/* Sell: list on the marketplace */}
          <button
            type="button"
            onClick={() => handleAction('sell')}
            disabled={!!activeAction}
            title="List this car on the marketplace"
            className="flex flex-col items-center justify-center gap-1 py-sm bg-surface-container border border-secondary text-secondary font-bold rounded-xl hover:bg-secondary/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">sell</span>
            <span className="text-label-sm">{activeAction === 'sell' ? 'Listing…' : 'Sell'}</span>
          </button>

          {/* Track: add to the price watchlist */}
          <button
            type="button"
            onClick={() => handleAction('track')}
            disabled={!!activeAction}
            title="Track this car's price"
            className="flex flex-col items-center justify-center gap-1 py-sm bg-surface-container border border-tertiary text-tertiary font-bold rounded-xl hover:bg-tertiary/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">visibility</span>
            <span className="text-label-sm">{activeAction === 'track' ? 'Tracking…' : 'Track'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
