import React, { useEffect, useState } from 'react';

interface BackToTopProps {
  // id of the scroll container to watch/scroll (defaults to the window).
  targetId?: string;
}

// Floating "back to top" button that appears after scrolling down. Works with a
// specific scroll container (the app's main panels scroll internally, not the
// window) or falls back to window scrolling.
export const BackToTop: React.FC<BackToTopProps> = ({ targetId }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetId ? document.getElementById(targetId) : null;
    const scroller: HTMLElement | Window = el || window;
    const getTop = () => (el ? el.scrollTop : window.scrollY);
    const onScroll = () => setShow(getTop() > 400);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [targetId]);

  const toTop = () => {
    const el = targetId ? document.getElementById(targetId) : null;
    (el || window).scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="btn-press fixed bottom-12 right-20 z-40 w-11 h-11 rounded-full bg-surface-container-high/90 backdrop-blur border border-outline-variant text-on-surface shadow-xl flex items-center justify-center hover:border-primary hover:text-primary transition-colors animate-fade-in"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  );
};
