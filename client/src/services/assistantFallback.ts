// Client-side offline concierge. Used whenever the /api/assistant call fails or
// is unreachable, so the assistant still recommends/reviews/prices real catalog
// cars (and helps with condition) instead of erroring. Uses the bundled CATALOG
// so it works with no backend at all, and tolerates brand typos.
import { CATALOG } from '../data/catalog';
import type { Collectible } from './api';

// Levenshtein edit distance (for fuzzy brand matching like "buggati" -> "bugatti").
function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[m][n];
}

// Find the catalog car whose MODEL name best matches the query (brand dropped,
// so "best ford" recommends Fords while "skyline" matches the model).
function findCar(t: string): Collectible | null {
  let best: Collectible | null = null;
  let bestScore = 0;
  for (const c of CATALOG) {
    const name = c.name.toLowerCase();
    const model = name.replace(c.brand.toLowerCase(), '').replace(/[()]/g, '').trim();
    const tokens = model.split(/\s+/).filter((w) => w.length > 2);
    const hits = tokens.filter((w) => t.includes(w)).length;
    const score = hits + (t.includes(name) ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return bestScore >= 1 ? best : null;
}

// Detect a brand in the query, tolerating small typos.
function findBrand(t: string): string | null {
  const brands = [...new Set(CATALOG.map((c) => c.brand))];
  const words = t.split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
  for (const b of brands) {
    for (const bw of b.toLowerCase().split(/[^a-z0-9]+/)) {
      if (bw.length < 3) continue;
      for (const w of words) {
        if (w === bw) return b;
        if (w.length >= 4 && bw.length >= 4 && lev(w, bw) <= 2) return b;
      }
    }
  }
  return null;
}

const openBoxNote = (c: Collectible) => ` (open-box ~$${(c.price * 0.6).toFixed(0)}–$${(c.price * 0.8).toFixed(0)})`;

// Recommend / list cars from the catalog, optionally scoped to a brand.
function recommend(t: string, forcedBrand: string | null = null): string {
  let list = [...CATALOG];
  const budget = t.match(/(?:under|below|less than|<)\s*\$?(\d+)/);
  if (budget) list = list.filter((c) => c.price <= Number(budget[1]));
  if (forcedBrand) {
    list = list.filter((c) => c.brand === forcedBrand);
  } else {
    const facet = list.filter((c) => t.includes(c.brand.toLowerCase()) || t.includes(c.vehicleType.toLowerCase()));
    if (facet.length) list = facet;
  }
  if (/\bjdm\b/.test(t)) list = list.filter((c) => c.sections?.includes('jdm') || /jdm|japanese|drift|rotary/i.test(c.vehicleType));
  if (/super treasure|\bsth\b/.test(t)) list = list.filter((c) => c.rarityLevel === 'Super Treasure Hunt');
  else if (/\bchase\b/.test(t)) list = list.filter((c) => c.rarityLevel === 'Chase');
  else if (/\bth\b|treasure/.test(t)) list = list.filter((c) => c.rarityLevel === 'Treasure Hunt');
  list.sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0));
  const top = list.slice(0, 4);
  if (!top.length) return "I couldn't find a catalog match — try a brand (Porsche, Nissan…), a category (JDM, Hypercar…), or a budget like \"under $50\".";
  const loose = /loose|open[\s-]?box|out of|used|worn/.test(t);
  const heading = forcedBrand ? `${forcedBrand} in the store:` : 'Here are my top picks from the store:';
  return `${heading}\n` + top.map((c) => `• **${c.name}** — $${c.price.toFixed(2)} · ${c.rarityLevel}, ${c.vehicleType}${loose ? openBoxNote(c) : ''}`).join('\n');
}

function review(c: Collectible, t = ''): string {
  const tierNote: Record<string, string> = {
    'Super Treasure Hunt': 'a grail-tier Super Treasure Hunt — Spectraflame paint, Real Riders, highly sought-after',
    Chase: 'a limited Chase piece, much harder to find than mainline',
    'Treasure Hunt': 'a Treasure Hunt — a limited run a step above mainline',
    Mainline: 'a standard mainline release, easy to find',
  };
  const demand = c.demandScore ?? 80;
  const heat = demand >= 92 ? 'red-hot demand' : demand >= 85 ? 'strong demand' : 'steady interest';
  const base =
    `**${c.name}** — ${c.brand} · ${c.vehicleType}, ${c.releaseYear}\n` +
    `It's ${tierNote[c.rarityLevel] ?? 'a collectible release'} with ${heat} (${demand}/100). ` +
    `Listed at **$${c.price.toFixed(2)}** in ${c.condition} condition — fair for this tier. ` +
    (demand >= 90 ? 'A safe buy that holds value — grab it if the condition checks out.' : 'A solid pickup if it fits your collection theme.');
  if (/loose|open[\s-]?box|out of|used|worn|played/.test(t)) {
    const lo = (c.price * 0.6).toFixed(2);
    const hi = (c.price * 0.8).toFixed(2);
    return base + `\n\nFor an **open-box / loose** example, expect roughly **$${lo} – $${hi}** (under the $${c.price.toFixed(2)} carded/mint price).`;
  }
  return base;
}

// Answer superlative questions ("priciest", "most pricey", "cheapest", …).
function superlative(t: string): string | null {
  const plural = /cars|ones|models|few|some|list|options|\btop\b/.test(t);
  const top = (sorted: Collectible[], label: string): string | null => {
    const list = sorted.slice(0, plural ? 3 : 1);
    if (!list.length) return null;
    if (list.length === 1) {
      const c = list[0];
      return `The ${label} car in the store is the **${c.name}** — **$${c.price.toFixed(2)}**, ${c.rarityLevel} (${c.brand} ${c.vehicleType}, demand ${c.demandScore ?? 80}/100).`;
    }
    return `The ${label} cars in the store:\n` + list.map((c) => `• **${c.name}** — $${c.price.toFixed(2)} · ${c.rarityLevel}, ${c.brand} ${c.vehicleType}`).join('\n');
  };
  if (/pric(iest|est|ey|ier)|expensive|costl(iest|y|ier)|dearest|highest[\s-]?price/.test(t)) return top([...CATALOG].sort((a, b) => b.price - a.price), 'most expensive');
  if (/cheap(est|er)?|least expensive|lowest[\s-]?price|affordable/.test(t)) return top([...CATALOG].sort((a, b) => a.price - b.price), 'cheapest');
  if (/rare|rarst|most rare/.test(t)) return top([...CATALOG].sort((a, b) => (b.rarityLevel === 'Super Treasure Hunt' ? 1 : 0) - (a.rarityLevel === 'Super Treasure Hunt' ? 1 : 0) || (b.demandScore ?? 0) - (a.demandScore ?? 0)), 'rarest');
  if (/most popular|best ?sell|highest demand|hottest|most wanted/.test(t)) return top([...CATALOG].sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0)), 'most popular');
  if (/newest|latest car|latest model|latest arrival/.test(t)) return top([...CATALOG].sort((a, b) => b.releaseYear - a.releaseYear), 'newest');
  if (/oldest/.test(t)) return top([...CATALOG].sort((a, b) => a.releaseYear - b.releaseYear), 'oldest');
  return null;
}

export function localAssistantReply(text: string, hasImage: boolean): string {
  const t = (text || '').toLowerCase().trim();

  const conditionGuide =
    'Condition grades:\n' +
    '• **Mint (M)** — flawless, usually still carded with a crisp blister.\n' +
    '• **Near Mint (NM)** — tiny flaws or light card wear.\n' +
    '• **Very Good (VG)** — visible wear, loose, or minor paint rub.\n\n' +
    'What to check: paint/Spectraflame finish, wheels & tires (Real Riders add value), and packaging creases.';

  // Greeting / help
  if (/^(hi|hey|hello|yo|help|what can you do)\b/.test(t)) {
    return "Hi! I'm your HotWheels Paradise concierge. I can price or review any car, recommend cars by budget/brand/category, or help grade condition. Try \"price of the Bugatti Chiron\", \"review the Ferrari F40\", or \"best JDM under $30\".";
  }

  // Superlatives ("priciest", "cheapest", "rarest", "most popular"…).
  const sup = superlative(t);
  if (sup) return sup;

  // A specific model is named → price / review THAT car.
  const car = findCar(t);
  if (car) return review(car, t);

  // A brand is named (typo-tolerant) → show/price that brand's lineup.
  const brand = findBrand(t);
  if (brand) return recommend(t, brand);

  // General recommendation / browse intent.
  if (/(recommend|suggest|looking for|what should|show me|find me|best|top|gift|budget|cheap|under \$?\d|below \$?\d|jdm|hypercar|supercar|muscle|coupe|sedan|electric|drift|rally)/.test(t)) {
    return recommend(t);
  }

  // Condition / grading question.
  if (/(grade|grading|condition|mint|near mint|how do i tell)/.test(t)) {
    return conditionGuide;
  }

  // Generic rarity-based pricing (when no specific car/brand was named).
  if (/(price|worth|value|how much|cost)/.test(t) || /\b(sth|th|chase|mainline|treasure)\b/.test(t)) {
    let tier = 'Mainline';
    let range = '$5 – $20';
    if (t.includes('super treasure') || /\bsth\b/.test(t)) { tier = 'Super Treasure Hunt'; range = '$150 – $400'; }
    else if (t.includes('chase')) { tier = 'Chase'; range = '$100 – $600'; }
    else if (t.includes('treasure') || /\bth\b/.test(t)) { tier = 'Treasure Hunt'; range = '$40 – $120'; }
    const note = hasImage ? "\n\nUpload-grading needs the AI online, but tell me the paint/wheels/packaging and I'll factor it in." : '';
    return `Ballpark for a **${tier}** piece: **${range}**. Name a specific car (e.g. "Bugatti Chiron") and I'll give its exact listed price.${note}`;
  }

  // Helpful default — never a dead end.
  return "I can price or review any car in the store, or recommend cars by budget, brand or category. Try \"price of the Nissan Skyline\", \"review the McLaren 765LT\", or \"best hypercar under $150\".";
}
