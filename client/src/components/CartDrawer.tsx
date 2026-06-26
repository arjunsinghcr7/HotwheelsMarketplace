import React, { useState } from 'react';
import type { CartItem } from '../services/collection';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onPlaceOrder: () => void; // clears the cart in the parent
}

const TAX_RATE = 0.08;
const FREE_SHIP_THRESHOLD = 100;
const FLAT_SHIPPING = 9.99;

export const computeTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
};

type Step = 'cart' | 'checkout' | 'done';

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, items, onClose, onQtyChange, onRemove, onPlaceOrder }) => {
  const [step, setStep] = useState<Step>('cart');
  const [orderNo] = useState(() => Math.floor(100000 + (items.length + 1) * 7919) % 999999);

  if (!isOpen) return null;

  const { subtotal, tax, shipping, total } = computeTotals(items);
  const count = items.reduce((n, i) => n + i.qty, 0);

  const close = () => {
    onClose();
    // reset to cart view for next open (after the panel animates out)
    setTimeout(() => setStep('cart'), 250);
  };

  const placeOrder = () => {
    onPlaceOrder();
    setStep('done');
  };

  const TotalsBlock = (
    <div className="space-y-1.5 text-label-md">
      <Row label="Subtotal" value={formatPrice(subtotal)} />
      <Row label={`Tax (${Math.round(TAX_RATE * 100)}%)`} value={formatPrice(tax)} />
      <Row label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
      <div className="h-px bg-outline-variant my-2" />
      <div className="flex items-center justify-between text-on-surface">
        <span className="font-bold">Grand Total</span>
        <span className="text-headline-md font-bold text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-surface-container-low border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              {step === 'done' ? 'task_alt' : step === 'checkout' ? 'receipt_long' : 'shopping_cart'}
            </span>
            {step === 'done' ? 'Order Confirmed' : step === 'checkout' ? 'Checkout' : `Your Cart${count ? ` (${count})` : ''}`}
          </h2>
          <button onClick={close} aria-label="Close cart" className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* ---------------- DONE ---------------- */}
        {step === 'done' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-sm p-lg animate-fade-in">
            <span className="material-symbols-outlined text-secondary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Thank you!</h3>
            <p className="text-on-surface-variant">Your order <span className="text-on-surface font-bold">#{orderNo}</span> has been placed.</p>
            <p className="text-label-sm text-on-surface-variant max-w-xs">A confirmation has been sent to your email. Your cars are being prepped for shipment.</p>
            <button onClick={close} className="btn-press mt-md px-lg py-sm rounded-xl racing-gradient text-white font-bold">
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          /* ---------------- EMPTY ---------------- */
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-sm p-lg">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl">remove_shopping_cart</span>
            <p className="text-headline-md font-bold text-on-surface">Your cart is empty</p>
            <p className="text-label-sm text-on-surface-variant">Add some cars to get started.</p>
            <button onClick={close} className="btn-press mt-md px-lg py-sm rounded-xl racing-gradient text-white font-bold">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* ---------------- ITEMS ---------------- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-sm">
              {step === 'checkout' && (
                <p className="text-label-sm text-on-surface-variant">Review your order below, then place it.</p>
              )}
              {items.map((item) => (
                <div key={item.id} className="flex gap-sm bg-surface-container rounded-xl border border-outline-variant p-2 transition-all">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-surface-dim flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-bold text-on-surface truncate">{item.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{item.brand}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-label-md font-bold text-secondary">{formatPrice(item.price)}</span>
                      {step === 'cart' ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => onQtyChange(item.id, item.qty - 1)} aria-label="Decrease quantity" className="btn-press w-7 h-7 rounded-lg bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-6 text-center text-label-md font-bold text-on-surface">{item.qty}</span>
                          <button onClick={() => onQtyChange(item.id, item.qty + 1)} aria-label="Increase quantity" className="btn-press w-7 h-7 rounded-lg bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary">
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                          <button onClick={() => onRemove(item.id)} aria-label="Remove item" className="btn-press w-7 h-7 ml-1 rounded-lg flex items-center justify-center text-error hover:bg-error/10">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-label-sm text-on-surface-variant">Qty {item.qty}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------------- FOOTER ---------------- */}
            <div className="p-md border-t border-outline-variant space-y-md bg-surface-container-lowest">
              {TotalsBlock}
              {step === 'cart' ? (
                <div className="flex gap-sm">
                  <button onClick={close} className="btn-press flex-1 px-md py-sm rounded-xl bg-surface-container-highest border border-outline-variant text-on-surface font-bold hover:border-secondary transition-colors">
                    Continue Shopping
                  </button>
                  <button onClick={() => setStep('checkout')} className="btn-press flex-1 px-md py-sm rounded-xl racing-gradient text-white font-bold shadow-lg">
                    Checkout
                  </button>
                </div>
              ) : (
                <div className="flex gap-sm">
                  <button onClick={() => setStep('cart')} className="btn-press px-md py-sm rounded-xl bg-surface-container-highest border border-outline-variant text-on-surface font-bold hover:border-secondary transition-colors">
                    Back
                  </button>
                  <button onClick={placeOrder} className="btn-press flex-1 px-md py-sm rounded-xl racing-gradient text-white font-bold shadow-lg flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-on-surface-variant">
    <span>{label}</span>
    <span className="text-on-surface">{value}</span>
  </div>
);
