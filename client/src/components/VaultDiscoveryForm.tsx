import React, { useState } from 'react';

interface VaultDiscoveryFormProps {
  onAddCollectible: (data: {
    name: string;
    brand: string;
    vehicleType: string;
    scale: string;
    condition: string;
    releaseYear: number;
    price: number;
    rarityLevel: string;
    notes: string;
  }) => Promise<void>;
}

export const VaultDiscoveryForm: React.FC<VaultDiscoveryFormProps> = ({ onAddCollectible }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Hot Wheels');
  const [vehicleType, setVehicleType] = useState('Muscle');
  const [scale, setScale] = useState('1:64');
  const [condition, setCondition] = useState('Mint (M)');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [price, setPrice] = useState('');
  const [rarityLevel, setRarityLevel] = useState('Treasure Hunt'); // Default in screen layout
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const rarityLevels = ['Mainline', 'Treasure Hunt', 'Super Treasure Hunt', 'Chase'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!name.trim()) {
      setErrorMessage('Product Name / Series is required.');
      return;
    }
    if (!releaseYear || isNaN(Number(releaseYear))) {
      setErrorMessage('Please enter a valid Release Year.');
      return;
    }
    const cleanPrice = price.replace('$', '').trim();
    if (!cleanPrice || isNaN(Number(cleanPrice)) || Number(cleanPrice) < 0) {
      setErrorMessage('Please enter a valid positive Price.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddCollectible({
        name,
        brand,
        vehicleType,
        scale,
        condition,
        releaseYear: parseInt(releaseYear),
        price: parseFloat(cleanPrice),
        rarityLevel,
        notes,
      });

      // Reset form
      setName('');
      setPrice('');
      setNotes('');
      setRarityLevel('Treasure Hunt');
      alert('Collectible added successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add collectible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full h-full border-r border-outline-variant flex flex-col bg-surface-container-lowest">
      <div className="p-md border-b border-outline-variant flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface">Vault Discovery</h2>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
          filter_alt
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-md custom-scrollbar space-y-lg">
        {errorMessage && (
          <div className="p-sm bg-error-container text-on-error-container rounded-lg text-label-sm border border-outline-variant">
            {errorMessage}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-md racing-gradient text-white font-headline-md rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-sm disabled:opacity-50 disabled:scale-100"
        >
          <span className="material-symbols-outlined">track_changes</span>
          {isSubmitting ? 'Processing...' : 'Buy, Sell & Track Collection'}
        </button>
      </form>
    </section>
  );
};
