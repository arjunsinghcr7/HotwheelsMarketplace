// Light/dark theme, persisted in localStorage and applied as a class on <html>.
// The color tokens in tailwind.config.js read CSS variables that flip under the
// `light` class (see index.css).
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'hw_theme';

export function getTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'light') root.classList.add('light');
  else root.classList.remove('light');
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore storage failures
  }
  applyTheme(theme);
}

// Apply the saved theme as early as possible to avoid a flash.
export function initTheme(): void {
  applyTheme(getTheme());
}
