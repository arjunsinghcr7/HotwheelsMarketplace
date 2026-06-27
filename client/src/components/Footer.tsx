import React, { useState } from 'react';
import { toast } from '../utils/toast';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Best Sellers', href: '#best-sellers' },
      { label: 'JDM Legends', href: '#jdm-legends' },
      { label: 'Latest Arrivals', href: '#latest-arrivals' },
      { label: 'Limited Editions', href: '#limited-editions' },
      { label: "Collector's Picks", href: '#collector-picks' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#footer' },
      { label: 'Shipping', href: '#footer' },
      { label: 'Returns', href: '#footer' },
      { label: 'Track Your Order', href: '#footer' },
      { label: 'Contact', href: 'mailto:support@hotwheelsparadise.com' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#footer-about' },
      { label: 'Careers', href: '#footer' },
      { label: 'Privacy Policy', href: '#footer' },
      { label: 'Terms of Service', href: '#footer' },
      { label: 'Authentication', href: '#footer' },
    ],
  },
];

const SOCIALS = [
  { icon: 'sports_motorsports', label: 'Community', href: '#footer' },
  { icon: 'forum', label: 'Forum', href: '#footer' },
  { icon: 'mail', label: 'Email', href: 'mailto:support@hotwheelsparadise.com' },
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast('Enter a valid email address', 'error');
      return;
    }
    toast('Subscribed — welcome to the Paradise list!', 'success');
    setEmail('');
  };

  return (
    <footer id="footer" className="mt-xl border-t border-outline-variant bg-surface-container-lowest">
      {/* Newsletter band */}
      <div className="border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-md py-xl flex flex-col lg:flex-row lg:items-center justify-between gap-lg">
          <div className="max-w-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Join the Paradise list</h3>
            <p className="text-label-md text-on-surface-variant mt-1">
              Drops, restocks and rare finds — delivered before they sell out.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-2 w-full lg:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="flex-1 lg:w-72 bg-surface-container border border-outline-variant rounded-xl px-md py-3 text-label-md text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button type="submit" className="ripple btn-press px-lg py-3 rounded-xl racing-gradient text-white font-bold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-6xl mx-auto px-md py-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-lg">
        {/* Brand */}
        <div id="footer-about" className="col-span-2 space-y-sm">
          <p className="text-headline-md font-bold text-primary tracking-tight">HotWheels Paradise</p>
          <p className="text-label-sm text-on-surface-variant max-w-xs">
            The premium marketplace for serious die-cast collectors. Authenticated castings,
            grail-tier hypercars, and the legends that started it all. Collect. Race. Display.
          </p>
          <div className="flex items-center gap-sm pt-1">
            <a
              href="https://github.com/arjunsinghcr7/HotwheelsMarketplace"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.46-2.3 1.2-3.1-.12-.3-.52-1.48.1-3.08 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.07.75.81 1.2 1.85 1.2 3.11 0 4.43-2.7 5.41-5.27 5.7.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
              </svg>
            </a>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="space-y-sm">
            <p className="text-label-md font-bold uppercase tracking-wider text-on-surface">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-outline-variant">
        <div className="max-w-6xl mx-auto px-md py-md flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant">
          <p>© 2026 HotWheels Paradise. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <a href="#footer" className="hover:text-on-surface transition-colors">Privacy</a>
            <a href="#footer" className="hover:text-on-surface transition-colors">Terms</a>
            <span>
              Designed &amp; Developed by <span className="text-on-surface font-bold">Arjun Singh</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
