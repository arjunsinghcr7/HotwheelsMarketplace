// Client-side offline concierge. Used whenever the /api/assistant call fails or
// is unreachable, so the assistant still recommends/reviews real catalog cars
// (and helps with pricing/condition) instead of erroring or giving a generic
// answer. Uses the bundled CATALOG so it works with no backend at all.
import { CATALOG } from '../data/catalog';
import type { Collectible } from './api';

// Find the catalog car whose name best matches a free-text query.
function findCar(t: string): Collectible | null {
  let best: Collectible | null = null;
  let bestScore = 0;
  for (const c of CATALOG) {
    const name = c.name.toLowerCase();
    // Match on the MODEL words (drop the brand) so "best ford" recommends Fords
    // rather than matching a single Ford by its brand word.
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

function recommend(t: string): string {
  let list = [...CATALOG];
  const budget = t.match(/(?:under|below|less than|<)\s*\$?(\d+)/);
  if (budget) list = list.filter((c) => c.price <= Number(budget[1]));
  const facet = list.filter((c) => t.includes(c.brand.toLowerCase()) || t.includes(c.vehicleType.toLowerCase()));
  if (facet.length) list = facet;
  if (/\bjdm\b/.test(t)) list = list.filter((c) => c.sections?.includes('jdm') || /jdm|japanese|drift|rotary/i.test(c.vehicleType));
  if (/super treasure|\bsth\b/.test(t)) list = list.filter((c) => c.rarityLevel === 'Super Treasure Hunt');
  else if (/\bchase\b/.test(t)) list = list.filter((c) => c.rarityLevel === 'Chase');
  else if (/\bth\b|treasure/.test(t)) list = list.filter((c) => c.rarityLevel === 'Treasure Hunt');
  list.sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0));
  const top = list.slice(0, 4);
  if (!top.length) return "I couldn't find a catalog match — try a brand (Porsche, Nissan…), a category (JDM, Hypercar…), or a budget like \"under $50\".";
  return 'Here are my top picks from the store:\n' + top.map((c) => `• **${c.name}** — $${c.price.toFixed(2)} · ${c.rarityLevel}, ${c.brand} ${c.vehicleType}`).join('\n');
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

  // If the user asked about an open-box / loose example, give the lower range.
  if (/loose|open[\s-]?box|used|worn|played/.test(t)) {
    const lo = (c.price * 0.6).toFixed(2);
    const hi = (c.price * 0.8).toFixed(2);
    return base + `\n\nFor an **open-box / loose** example, expect roughly **$${lo} – $${hi}** (under the $${c.price.toFixed(2)} carded/mint price).`;
  }
  return base;
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
    return "Hi! I'm your HotWheels Paradise concierge. I can recommend cars from the store, review a specific model, or help with pricing & condition. Try \"recommend a JDM car under $30\" or \"review the Ferrari F40\".";
  }

  // A specific catalog car is named → price / review THAT car (covers
  // "best price for an open-box skyline", "review the F40", "is the Enzo worth it").
  const car = findCar(t);
  if (car) return review(car, t);

  // No specific car → general recommendation / browse intent.
  if (/(recommend|suggest|looking for|what should|show me|find me|best|top|gift|budget|cheap|under \$?\d|below \$?\d|jdm|hypercar|supercar|muscle|coupe|sedan)/.test(t)) {
    return recommend(t);
  }

  // Condition / grading question (not a pricing question)
  if (/(grade|grading|condition|mint|near mint|how do i tell)/.test(t) && !/(worth|price|value|\$|how much)/.test(t)) {
    return conditionGuide;
  }

  // Pricing
  let tier = 'Mainline';
  let range = '$5 – $20';
  if (t.includes('super treasure') || /\bsth\b/.test(t)) {
    tier = 'Super Treasure Hunt';
    range = '$150 – $400';
  } else if (t.includes('chase')) {
    tier = 'Chase';
    range = '$100 – $600';
  } else if (t.includes('treasure') || /\bth\b/.test(t)) {
    tier = 'Treasure Hunt';
    range = '$40 – $120';
  }

  let conditionNote = '';
  if (/(mint|sealed|carded|unopened)/.test(t)) conditionNote = ' A mint/carded example sits at the top of that range.';
  else if (/(loose|played|damaged|rub|crease|worn)/.test(t)) conditionNote = ' A loose or worn example sits at the bottom of that range.';

  const imageNote = hasImage
    ? "\n\nI can't grade the photo itself in offline mode — but tell me what you see (paint, wheels, packaging) and I'll factor it in."
    : '';

  return `Ballpark for a **${tier}** piece: **${range}**.${conditionNote}` + imageNote;
}
