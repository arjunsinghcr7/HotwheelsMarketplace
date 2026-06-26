import React, { useRef, useState } from 'react';
import { formatPrice } from '../utils/format';
import type { MyCar } from '../services/collection';
import { fileToDataURL } from '../services/collection';

interface CollectionGalleryProps {
  cars: MyCar[];
  searchQuery: string;
  onAdd: (car: Omit<MyCar, 'id'>) => void;
  onDelete: (id: string) => void;
}

const RARITY_LEVELS = ['Mainline', 'Treasure Hunt', 'Super Treasure Hunt', 'Chase'];

const rarityColor = (level: string) => {
  if (level === 'Super Treasure Hunt') return 'bg-tertiary text-on-tertiary';
  if (level === 'Chase') return 'bg-primary text-on-primary';
  if (level === 'Treasure Hunt') return 'bg-secondary text-on-secondary';
  return 'bg-surface-container-highest text-on-surface-variant';
};

export const CollectionGallery: React.FC<CollectionGalleryProps> = ({
  cars,
  searchQuery,
  onAdd,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rarityLevel, setRarityLevel] = useState('Mainline');
  const [releaseYear, setReleaseYear] = useState('');
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataURL(file);
      setPreview(dataUrl);
    } catch {
      setError('Could not process that image. Try a different file.');
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setRarityLevel('Mainline');
    setReleaseYear('');
    setNotes('');
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter the car name.');
    if (!preview) return setError('Please upload a photo of the car.');
    const cleanPrice = price.replace('$', '').trim();
    if (!cleanPrice || isNaN(Number(cleanPrice)) || Number(cleanPrice) < 0) {
      return setError('Please enter a valid price.');
    }
    try {
      setIsSaving(true);
      onAdd({
        name: name.trim(),
        price: parseFloat(cleanPrice),
        rarityLevel,
        releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
        image: preview,
        notes: notes.trim() || undefined,
      });
      resetForm();
    } catch {
      setError('Could not save. Your browser storage may be full.');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rarityLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = cars.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-sm lg:p-lg flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">folder_special</span>
            My Collection
          </h2>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Your personal garage — upload photos and track what each car is worth.
          </p>
        </div>
        <div className="glass-panel px-md py-sm rounded-xl text-right">
          <p className="text-label-sm text-on-surface-variant">Cars Owned</p>
          <p className="text-headline-md font-bold text-on-surface">
            {cars.length}
            <span className="text-label-sm text-on-surface-variant font-normal ml-2">
              · {formatPrice(totalValue)}
            </span>
          </p>
        </div>
      </div>

      {/* Upload form */}
      <form onSubmit={handleSubmit} className="glass-panel p-md rounded-xl grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Image dropzone */}
        <div className="md:row-span-2">
          <label className="block text-label-sm text-on-surface-variant mb-xs">Car Photo</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-outline-variant hover:border-secondary bg-surface-container overflow-hidden flex items-center justify-center transition-colors"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                <span className="text-label-sm">Click to upload</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Fields */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div className="sm:col-span-2">
            <label className="block text-label-sm text-on-surface-variant mb-xs">Car Name / Series</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 1969 Dodge Charger R/T"
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Price (USD)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$0.00"
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md font-mono text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Release Year</label>
            <input
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="2024"
              type="number"
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-label-sm text-on-surface-variant mb-xs">Rarity</label>
            <div className="flex flex-wrap gap-xs">
              {RARITY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRarityLevel(level)}
                  className={`px-sm py-xs rounded-full text-label-sm border transition-all ${
                    rarityLevel === level
                      ? 'border-secondary text-secondary bg-surface-container'
                      : 'border-outline-variant text-on-surface-variant hover:border-secondary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-label-sm text-on-surface-variant mb-xs">Notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Condition, packaging, serial #, story..."
              className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
          {error && (
            <div className="sm:col-span-2 p-sm bg-error-container text-on-error-container rounded-lg text-label-sm border border-outline-variant">
              {error}
            </div>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-sm racing-gradient text-white font-headline-md rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-transform flex items-center justify-center gap-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined">garage</span>
              Add to My Collection
            </button>
          </div>
        </div>
      </form>

      {/* Gallery */}
      {cars.length === 0 ? (
        <div className="glass-panel rounded-xl p-lg flex flex-col items-center justify-center text-center gap-sm text-on-surface-variant min-h-[12rem]">
          <span className="material-symbols-outlined text-5xl">photo_library</span>
          <p className="text-label-md">Your gallery is empty. Upload your first car above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-md">
          {filtered.map((car) => (
            <div
              key={car.id}
              className="glass-panel rounded-xl overflow-hidden group border border-transparent hover:border-secondary transition-all"
            >
              <div className="h-40 bg-surface-container relative overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-full font-bold ${rarityColor(car.rarityLevel)}`}>
                  {car.rarityLevel}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${car.name} from your collection?`)) onDelete(car.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-dim/80 backdrop-blur text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur text-white text-[11px] rounded font-bold border border-white/10">
                  {formatPrice(car.price)}
                </span>
              </div>
              <div className="p-sm">
                <p className="text-label-md font-bold truncate text-on-surface">{car.name}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {car.releaseYear ? `${car.releaseYear} · ` : ''}
                  {car.notes || 'No notes'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
