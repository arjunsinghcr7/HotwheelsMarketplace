import React, { useRef, useState } from 'react';
import type { Theme } from '../services/theme';
import { getTheme, setTheme } from '../services/theme';
import type { Profile } from '../services/profile';
import { fileToDataURL } from '../services/collection';
import type { Settings, Address, PaymentCard } from '../services/settings';
import { getSettings, saveSettings, getOrders } from '../services/settings';
import { formatPrice } from '../utils/format';
import { toast } from '../utils/toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionCount: number;
  watchlistCount: number;
  cartCount: number;
  collectionValue: number;
  onClearCollection: () => void;
  onClearWatchlist: () => void;
  profile: Profile;
  onUpdateProfile: (patch: Partial<Profile>) => void;
  onSignOut: () => void;
}

const SECTIONS = [
  { key: 'account', label: 'Account', icon: 'person' },
  { key: 'security', label: 'Security', icon: 'lock' },
  { key: 'addresses', label: 'Addresses', icon: 'local_shipping' },
  { key: 'payment', label: 'Payment Methods', icon: 'credit_card' },
  { key: 'preferences', label: 'Preferences', icon: 'public' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications' },
  { key: 'wishlist', label: 'Wishlist Settings', icon: 'favorite' },
  { key: 'orders', label: 'Order History', icon: 'package_2' },
  { key: 'appearance', label: 'Appearance', icon: 'palette' },
  { key: 'collector', label: 'Collector Preferences', icon: 'sports_motorsports' },
  { key: 'stats', label: 'Collection Stats', icon: 'monitoring' },
  { key: 'help', label: 'Help & Support', icon: 'help' },
];

const BRANDS = ['Porsche', 'Ferrari', 'Lamborghini', 'Nissan', 'Toyota', 'McLaren', 'Bugatti', 'BMW', 'Mercedes-Benz', 'Ford'];
const RARITIES = ['Any', 'Mainline', 'Treasure Hunt', 'Chase', 'Super Treasure Hunt'];

const Toggle: React.FC<{ on: boolean; onChange: () => void; label: string; desc?: string }> = ({ on, onChange, label, desc }) => (
  <button onClick={onChange} className="flex items-center justify-between w-full p-sm bg-surface-container rounded-lg border border-outline-variant text-left">
    <div className="min-w-0 pr-2">
      <p className="text-label-md text-on-surface">{label}</p>
      {desc && <p className="text-[11px] text-on-surface-variant">{desc}</p>}
    </div>
    <span className={`shrink-0 w-10 h-6 rounded-full relative transition-colors ${on ? 'bg-primary' : 'bg-surface-container-highest'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-[1.125rem]' : 'left-0.5'}`} />
    </span>
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-label-sm text-on-surface-variant mb-1">{label}</span>
    {children}
  </label>
);

const inputCls =
  'w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-md text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary';

const Heading: React.FC<{ icon: string; title: string; sub?: string }> = ({ icon, title, sub }) => (
  <div className="mb-md">
    <h4 className="font-headline-md text-on-surface flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      {title}
    </h4>
    {sub && <p className="text-label-sm text-on-surface-variant mt-1">{sub}</p>}
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  collectionCount,
  watchlistCount,
  cartCount,
  collectionValue,
  onClearCollection,
  onClearWatchlist,
  profile,
  onUpdateProfile,
  onSignOut,
}) => {
  const [active, setActive] = useState('account');
  const [settings, setSettings] = useState<Settings>(() => getSettings());
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [addr, setAddr] = useState<Omit<Address, 'id'>>({ label: 'Home', name: '', line1: '', city: '', zip: '', country: 'United States' });
  const [card, setCard] = useState({ brand: 'Visa', last4: '', exp: '' });

  if (!isOpen) return null;

  const update = (patch: Partial<Settings>) => setSettings((s) => saveSettings({ ...s, ...patch }));
  const chooseTheme = (t: Theme) => { setTheme(t); setThemeState(t); };
  const orders = getOrders();

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      onUpdateProfile({ avatar: await fileToDataURL(file, 256) });
    } catch {
      toast('Could not read that image', 'error');
    }
  };

  const addAddress = () => {
    if (!addr.name.trim() || !addr.line1.trim()) { toast('Name and address are required', 'error'); return; }
    update({ addresses: [...settings.addresses, { ...addr, id: `ad_${Date.now()}` }] });
    setAddr({ label: 'Home', name: '', line1: '', city: '', zip: '', country: 'United States' });
    toast('Address saved', 'success');
  };
  const addCard = () => {
    if (!/^\d{4}$/.test(card.last4) || !/^\d{2}\/\d{2}$/.test(card.exp)) { toast('Enter last 4 digits and MM/YY', 'error'); return; }
    update({ payments: [...settings.payments, { ...card, id: `pm_${Date.now()}` } as PaymentCard] });
    setCard({ brand: 'Visa', last4: '', exp: '' });
    toast('Card added (mock)', 'success');
  };

  const Stat = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <div className="glass-panel rounded-xl p-md">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <p className="text-headline-md font-bold text-on-surface mt-1">{value}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );

  const content: Record<string, React.ReactNode> = {
    account: (
      <div>
        <Heading icon="person" title="Account" sub="Your public profile across the marketplace." />
        <div className="flex items-center gap-md mb-md">
          <div className="relative">
            <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-outline-variant" />
            <button onClick={() => fileRef.current?.click()} aria-label="Change avatar" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full racing-gradient text-white flex items-center justify-center border-2 border-surface-container-high">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatar(e.target.files?.[0])} />
          </div>
          <div>
            <p className="text-label-lg font-bold text-on-surface">{profile.username}</p>
            <p className="text-[11px] text-on-surface-variant">{profile.loggedIn ? profile.email : 'Not signed in'}</p>
          </div>
        </div>
        <div className="space-y-sm">
          <Field label="Username"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button
            onClick={() => { onUpdateProfile({ username: name.trim() || profile.username, email: email.trim(), loggedIn: true }); }}
            className="btn-press px-md py-sm rounded-xl racing-gradient text-white font-bold"
          >
            Save Account
          </button>
        </div>
      </div>
    ),
    security: (
      <div>
        <Heading icon="lock" title="Security" sub="Keep your account protected." />
        <div className="space-y-sm">
          <Toggle on={settings.security.twoFactor} onChange={() => update({ security: { twoFactor: !settings.security.twoFactor } })} label="Two-factor authentication" desc="Require a code at sign-in (mock)." />
          <button onClick={() => toast('Password reset link sent (mock)', 'info')} className="w-full p-sm bg-surface-container rounded-lg border border-outline-variant text-left text-label-md text-on-surface hover:border-primary transition-colors flex items-center justify-between">
            Change password <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </button>
          <button onClick={() => { onSignOut(); onClose(); }} className="btn-press w-full p-sm rounded-lg border border-outline-variant text-error font-bold flex items-center justify-center gap-2 hover:bg-error/10">
            <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
          </button>
        </div>
      </div>
    ),
    addresses: (
      <div>
        <Heading icon="local_shipping" title="Addresses" sub="Where your cars ship to." />
        <div className="space-y-sm mb-md">
          {settings.addresses.length === 0 && <p className="text-label-sm text-on-surface-variant">No saved addresses yet.</p>}
          {settings.addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between p-sm bg-surface-container rounded-lg border border-outline-variant">
              <div className="min-w-0">
                <p className="text-label-md font-bold text-on-surface">{a.label} · {a.name}</p>
                <p className="text-[11px] text-on-surface-variant">{a.line1}, {a.city} {a.zip}, {a.country}</p>
              </div>
              <button onClick={() => update({ addresses: settings.addresses.filter((x) => x.id !== a.id) })} aria-label="Delete" className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-sm">
          <Field label="Label"><input className={inputCls} value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} /></Field>
          <Field label="Full name"><input className={inputCls} value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Address"><input className={inputCls} value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} /></Field></div>
          <Field label="City"><input className={inputCls} value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></Field>
          <Field label="ZIP"><input className={inputCls} value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} /></Field>
        </div>
        <button onClick={addAddress} className="btn-press mt-sm px-md py-sm rounded-xl racing-gradient text-white font-bold">Add address</button>
      </div>
    ),
    payment: (
      <div>
        <Heading icon="credit_card" title="Payment Methods" sub="Demo only — no real card data is stored." />
        <div className="space-y-sm mb-md">
          {settings.payments.length === 0 && <p className="text-label-sm text-on-surface-variant">No payment methods yet.</p>}
          {settings.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-sm bg-surface-container rounded-lg border border-outline-variant">
              <p className="text-label-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-secondary">credit_card</span>{p.brand} •••• {p.last4} <span className="text-on-surface-variant text-[11px]">exp {p.exp}</span></p>
              <button onClick={() => update({ payments: settings.payments.filter((x) => x.id !== p.id) })} aria-label="Remove" className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-sm">
          <Field label="Brand">
            <select className={inputCls} value={card.brand} onChange={(e) => setCard({ ...card, brand: e.target.value })}>
              <option>Visa</option><option>Mastercard</option><option>Amex</option>
            </select>
          </Field>
          <Field label="Last 4"><input className={inputCls} maxLength={4} placeholder="4242" value={card.last4} onChange={(e) => setCard({ ...card, last4: e.target.value.replace(/\D/g, '') })} /></Field>
          <Field label="Exp MM/YY"><input className={inputCls} placeholder="08/27" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></Field>
        </div>
        <button onClick={addCard} className="btn-press mt-sm px-md py-sm rounded-xl racing-gradient text-white font-bold">Add card</button>
      </div>
    ),
    preferences: (
      <div>
        <Heading icon="public" title="Preferences" sub="Localise your experience." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
          <Field label="Currency">
            <select className={inputCls} value={settings.preferences.currency} onChange={(e) => update({ preferences: { ...settings.preferences, currency: e.target.value } })}>
              <option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option><option>INR</option>
            </select>
          </Field>
          <Field label="Language">
            <select className={inputCls} value={settings.preferences.language} onChange={(e) => update({ preferences: { ...settings.preferences, language: e.target.value } })}>
              <option>English</option><option>Spanish</option><option>Japanese</option><option>German</option>
            </select>
          </Field>
          <Field label="Region">
            <select className={inputCls} value={settings.preferences.region} onChange={(e) => update({ preferences: { ...settings.preferences, region: e.target.value } })}>
              <option>United States</option><option>Europe</option><option>Japan</option><option>India</option>
            </select>
          </Field>
        </div>
      </div>
    ),
    notifications: (
      <div>
        <Heading icon="notifications" title="Notifications" sub="Choose what we ping you about." />
        <div className="space-y-sm">
          {([
            ['priceDrops', 'Price drops', 'When a watched car gets cheaper'],
            ['newArrivals', 'New arrivals', 'Fresh drops in the store'],
            ['orderUpdates', 'Order updates', 'Shipping and delivery status'],
            ['communityReplies', 'Community replies', 'Replies to your price checks'],
            ['newsletter', 'Newsletter', 'Weekly collector digest'],
          ] as const).map(([k, label, desc]) => (
            <Toggle key={k} on={settings.notifications[k]} onChange={() => update({ notifications: { ...settings.notifications, [k]: !settings.notifications[k] } })} label={label} desc={desc} />
          ))}
        </div>
      </div>
    ),
    wishlist: (
      <div>
        <Heading icon="favorite" title="Wishlist Settings" sub={`${watchlistCount} car${watchlistCount === 1 ? '' : 's'} on your wishlist.`} />
        <div className="space-y-sm">
          <Toggle on={settings.wishlist.notifyPriceDrop} onChange={() => update({ wishlist: { ...settings.wishlist, notifyPriceDrop: !settings.wishlist.notifyPriceDrop } })} label="Notify on price drops" desc="Alert me when a wishlisted car drops in price." />
          <Toggle on={settings.wishlist.publicWishlist} onChange={() => update({ wishlist: { ...settings.wishlist, publicWishlist: !settings.wishlist.publicWishlist } })} label="Public wishlist" desc="Let other collectors view your wishlist." />
          <button onClick={() => { if (watchlistCount > 0 && window.confirm('Clear your wishlist?')) onClearWatchlist(); }} disabled={watchlistCount === 0} className="w-full p-sm rounded-lg border border-outline-variant text-error text-label-md hover:bg-error/10 disabled:opacity-40">
            Clear wishlist
          </button>
        </div>
      </div>
    ),
    orders: (
      <div>
        <Heading icon="package_2" title="Order History" sub={orders.length ? `${orders.length} order${orders.length === 1 ? '' : 's'}.` : undefined} />
        {orders.length === 0 ? (
          <div className="glass-panel rounded-xl p-lg text-center">
            <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl">receipt_long</span>
            <p className="text-on-surface font-bold mt-2">No orders yet</p>
            <p className="text-label-sm text-on-surface-variant">Place an order from the cart and it'll show up here.</p>
          </div>
        ) : (
          <div className="space-y-sm">
            {orders.map((o) => (
              <div key={o.id} className="p-sm bg-surface-container rounded-lg border border-outline-variant">
                <div className="flex items-center justify-between">
                  <p className="text-label-md font-bold text-on-surface">Order #{o.id.slice(-6)}</p>
                  <p className="text-label-md font-bold text-primary">{formatPrice(o.total)}</p>
                </div>
                <p className="text-[11px] text-on-surface-variant">{new Date(o.date).toLocaleDateString()} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s)</p>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{o.items.map((i) => i.name).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    appearance: (
      <div>
        <Heading icon="palette" title="Appearance" sub="Switch between light and dark." />
        <div className="grid grid-cols-2 gap-sm">
          {([{ value: 'dark', label: 'Dark', icon: 'dark_mode' }, { value: 'light', label: 'Light', icon: 'light_mode' }] as const).map((opt) => (
            <button key={opt.value} onClick={() => chooseTheme(opt.value)} className={`flex items-center justify-center gap-xs p-md rounded-xl border transition-all ${theme === opt.value ? 'border-primary text-primary bg-primary/10 font-bold' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
              <span className="material-symbols-outlined">{opt.icon}</span>{opt.label}
            </button>
          ))}
        </div>
      </div>
    ),
    collector: (
      <div>
        <Heading icon="sports_motorsports" title="Collector Preferences" sub="Personalise your hunt — powers smarter recommendations." />
        <div className="space-y-md">
          <div>
            <p className="text-label-sm text-on-surface-variant mb-1">Favourite brands</p>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => {
                const on = settings.collector.favoriteBrands.includes(b);
                return (
                  <button key={b} onClick={() => update({ collector: { ...settings.collector, favoriteBrands: on ? settings.collector.favoriteBrands.filter((x) => x !== b) : [...settings.collector.favoriteBrands, b] } })}
                    className={`px-3 py-1.5 rounded-full text-label-sm border transition-colors ${on ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <Field label="Preferred rarity">
              <select className={inputCls} value={settings.collector.preferredRarity} onChange={(e) => update({ collector: { ...settings.collector, preferredRarity: e.target.value } })}>
                {RARITIES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Collecting focus">
              <select className={inputCls} value={settings.collector.focus} onChange={(e) => update({ collector: { ...settings.collector, focus: e.target.value } })}>
                <option>Everything</option><option>JDM</option><option>Hypercars</option><option>Muscle</option><option>Classics</option>
              </select>
            </Field>
          </div>
          <Field label={`Budget per car: ${formatPrice(settings.collector.budgetMax)}`}>
            <input type="range" min={10} max={300} step={5} value={settings.collector.budgetMax} onChange={(e) => update({ collector: { ...settings.collector, budgetMax: Number(e.target.value) } })} className="w-full accent-[#ff3b30]" />
          </Field>
          <Field label="Collecting goal">
            <input className={inputCls} placeholder="e.g. Complete the JDM Legends set" value={settings.collector.goal} onChange={(e) => update({ collector: { ...settings.collector, goal: e.target.value } })} />
          </Field>
        </div>
      </div>
    ),
    stats: (
      <div>
        <Heading icon="monitoring" title="Collection Stats" sub="A snapshot of your vault." />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
          <Stat label="Cars owned" value={String(collectionCount)} icon="garage" />
          <Stat label="Collection value" value={formatPrice(collectionValue)} icon="payments" />
          <Stat label="On wishlist" value={String(watchlistCount)} icon="favorite" />
          <Stat label="In cart" value={String(cartCount)} icon="shopping_cart" />
          <Stat label="Orders" value={String(orders.length)} icon="package_2" />
          <Stat label="Total spent" value={formatPrice(orders.reduce((s, o) => s + o.total, 0))} icon="receipt_long" />
        </div>
        <button onClick={() => { if (collectionCount > 0 && window.confirm('Remove all cars from your collection?')) onClearCollection(); }} disabled={collectionCount === 0} className="mt-md w-full p-sm rounded-lg border border-outline-variant text-error text-label-md hover:bg-error/10 disabled:opacity-40">
          Clear my collection
        </button>
      </div>
    ),
    help: (
      <div>
        <Heading icon="help" title="Help & Support" sub="We've got your back." />
        <div className="space-y-sm">
          {['FAQ', 'Shipping & Returns', 'Authentication & Grading', 'Track an order'].map((q) => (
            <button key={q} onClick={() => toast('Opening help article (mock)…', 'info')} className="w-full p-sm bg-surface-container rounded-lg border border-outline-variant text-left text-label-md text-on-surface hover:border-primary transition-colors flex items-center justify-between">
              {q} <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
          ))}
          <a href="mailto:support@hotwheelsparadise.com" className="block w-full p-sm rounded-lg racing-gradient text-white font-bold text-center">Contact support</a>
          <p className="text-[11px] text-on-surface-variant text-center pt-1">HotWheels Paradise · v1.0 · Designed &amp; Developed by Arjun Singh</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center sm:p-md bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-surface-container-high border border-outline sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh]">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">settings</span> Settings
          </h3>
          <button onClick={onClose} aria-label="Close" className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-0 flex-1">
          {/* Section nav */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto custom-scrollbar p-sm md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-outline-variant">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex items-center gap-sm p-sm rounded-lg whitespace-nowrap text-left transition-colors ${
                  active === s.key ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{s.icon}</span>
                <span className="text-label-md">{s.label}</span>
              </button>
            ))}
          </nav>

          {/* Active section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-md min-h-0">{content[active]}</div>
        </div>
      </div>
    </div>
  );
};
