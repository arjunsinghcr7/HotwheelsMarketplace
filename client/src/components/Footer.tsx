import React, { useState } from 'react';
import { toast } from '../utils/toast';

const QUICK_LINKS = ['About', 'FAQ', 'Shipping', 'Returns', 'Privacy Policy', 'Terms'];

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
    <footer id="footer" className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-md py-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
        {/* Brand */}
        <div id="footer-about" className="space-y-sm">
          <p className="text-headline-md font-bold text-primary tracking-tight">HotWheels Paradise</p>
          <p className="text-label-sm text-on-surface-variant max-w-xs">
            The premium marketplace for serious die-cast collectors. Collect. Race. Display.
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
            {['sports_motorsports', 'forum', 'mail'].map((icon) => (
              <span
                key={icon}
                className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-sm">
          <p className="text-label-md font-bold uppercase tracking-wider text-on-surface">Quick Links</p>
          <ul className="space-y-1.5">
            {QUICK_LINKS.map((link) => (
              <li key={link}>
                <a href="#footer" className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="space-y-sm">
          <p className="text-label-md font-bold uppercase tracking-wider text-on-surface">Collector Hub</p>
          <ul className="space-y-1.5 text-label-sm text-on-surface-variant">
            <li>Rarity Guide</li>
            <li>Authentication</li>
            <li>Grading Standards</li>
            <li>Track Your Order</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-sm">
          <p className="text-label-md font-bold uppercase tracking-wider text-on-surface">Newsletter</p>
          <p className="text-label-sm text-on-surface-variant">
            Drops, restocks and rare finds — straight to your inbox.
          </p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button type="submit" className="btn-press px-3 py-2 rounded-lg racing-gradient text-white font-bold text-label-sm">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-outline-variant">
        <div className="max-w-6xl mx-auto px-md py-md flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant">
          <p>© 2026 HotWheels Paradise. All rights reserved.</p>
          <p>Built for collectors, by collectors.</p>
        </div>
      </div>
    </footer>
  );
};
