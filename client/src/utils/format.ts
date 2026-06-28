// Shared price/number formatting utilities.
//
// Prices are STORED in USD. The user can pick a display currency in Settings →
// Preferences; formatPrice converts from USD using approximate static rates and
// formats with the right locale/symbol. Call setActiveCurrency() when the
// preference changes (the app re-renders so every price updates live).

// Approximate USD -> X conversion rates (demo only; not live FX).
const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 157, INR: 83 };
const LOCALES: Record<string, string> = { USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', JPY: 'ja-JP', INR: 'en-IN' };

const formatters: Record<string, Intl.NumberFormat> = {};
function formatter(code: string): Intl.NumberFormat {
  return (formatters[code] ??= new Intl.NumberFormat(LOCALES[code] ?? 'en-US', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'JPY' ? 0 : 2,
  }));
}

// Read the saved currency once at load so the first render is already correct.
function readStoredCurrency(): string {
  try {
    const code = JSON.parse(localStorage.getItem('hw_settings') || '{}')?.preferences?.currency;
    return code && code in RATES ? code : 'USD';
  } catch {
    return 'USD';
  }
}

let activeCurrency = readStoredCurrency();

export function setActiveCurrency(code: string): void {
  activeCurrency = code in RATES ? code : 'USD';
}

export function getActiveCurrency(): string {
  return activeCurrency;
}

/**
 * Format a USD price in the user's chosen display currency, e.g. 149.99 ->
 * "$149.99" / "₹12,449.17" / "¥23,548". Coerces strings and falls back to 0.
 */
export function formatPrice(price: number | string | null | undefined): string {
  const usd = typeof price === 'string' ? parseFloat(price) : price;
  const value = usd == null || Number.isNaN(usd) ? 0 : usd;
  const code = activeCurrency in RATES ? activeCurrency : 'USD';
  return formatter(code).format(value * RATES[code]);
}
