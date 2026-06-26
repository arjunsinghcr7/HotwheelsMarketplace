// Shared price/number formatting utilities.
//
// All monetary values in the app are stored as numbers (USD). Render them
// through formatPrice() so currency styling is consistent everywhere — product
// cards, cart, checkout, order summary, admin, etc.

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Format a numeric USD price as a currency string, e.g. 1250 -> "$1,250.00".
 * Coerces strings to numbers and falls back to "$0.00" for invalid input so a
 * bad value never crashes the UI.
 */
export function formatPrice(price: number | string | null | undefined): string {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  if (value == null || Number.isNaN(value)) return priceFormatter.format(0);
  return priceFormatter.format(value);
}
