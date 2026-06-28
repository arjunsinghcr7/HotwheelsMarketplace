import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
// NOTE: @anthropic-ai/sdk is imported lazily inside the /api/assistant route
// (only when an API key is configured) so the rest of the API never depends on
// it loading — keeps the serverless function robust when no key is set.
// Bundled seed data. Used as the source of truth on read-only/serverless
// filesystems (e.g. Vercel) and as a fallback if the writable DB file is missing.
import seed from './seed.js';

// Database interface definition
interface Collectible {
  id: string;
  name: string;
  brand: string;
  vehicleType: string;
  scale: string;
  condition: string;
  releaseYear: number;
  price: number;
  rarityLevel: string;
  series: string;
  image: string;
  notes?: string;
  isFeatured?: boolean;
  demandScore?: number;
  sections?: string[];
}

interface Deal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  notes?: string;
}

interface TickerItem {
  name: string;
  price: number;
  change: number;
  direction: 'up' | 'down' | 'none';
}

interface CommunityReply {
  author: string;
  avatar: string;
  text: string;
  suggestedPrice?: number;
  helpful: number;
}

interface CommunityThread {
  id: string;
  author: string;
  avatar: string;
  car: string;
  rarity: string;
  question: string;
  askedAgo: string;
  replies: CommunityReply[];
}

export interface Database {
  collectibles: Collectible[];
  deals: Deal[];
  ticker: TickerItem[];
  community: CommunityThread[];
  chartData: {
    '1W': number[];
    '1M': number[];
    '1Y': number[];
  };
  stats: {
    totalCollectionValue: number;
    itemsInVault: number;
    setCompletePercent: number;
    setCompleteName: string;
  };
}

// On Vercel (and most serverless platforms) the deployment filesystem is
// read-only; only the OS temp dir is writable, and it is ephemeral — writes do
// not persist across cold starts or between concurrent instances. Locally we
// read/write the real server/db.json so data persists during development.
//
// For durable production storage, swap readDB/writeDB for a real datastore
// (Vercel KV / Postgres, Supabase, Mongo, etc.).
const ON_SERVERLESS = !!process.env.VERCEL;
const DB_PATH = ON_SERVERLESS
  ? path.join(os.tmpdir(), 'db.json')
  : path.join(process.cwd(), 'db.json');

// Read database from file helper
async function readDB(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // No writable copy yet (or unreadable) — fall back to the bundled seed.
    return JSON.parse(JSON.stringify(seed)) as Database;
  }
}

// Write database to file helper
async function writeDB(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// System prompt for the AI shopping concierge + appraiser.
const ASSISTANT_SYSTEM = `You are the shopping concierge for "HotWheels Paradise", a premium die-cast marketplace. Be concise, practical, and friendly.

Your two main jobs:
1. RECOMMEND cars from the store catalog provided below. Match the shopper's budget, brand, category, rarity or vibe. Only recommend cars that appear in the catalog, and always cite the exact name and price. Suggest 2–4 options with a one-line reason each.
2. REVIEW a specific car from the catalog when asked. Give a short verdict: what it is, its rarity/desirability, whether the price looks fair, and who it suits. Use the catalog's price and demand score as ground truth.

You can also help with pricing and condition grading.
When pricing, reason from: rarity tier (Mainline, Treasure Hunt (TH), Super Treasure Hunt (STH), Chase), brand, release year/age, and condition. Give an estimated price range in USD with a one-line rationale.

When the user uploads a PHOTO, assess the visible condition: paint/Spectraflame quality, wheels/tires, packaging (carded vs loose, blister/card creases), and any visible defects or rub. Give a condition grade (Mint (M), Near Mint (NM), Very Good (VG), or worse) and a price range, and note what you cannot tell from the image. If the photo is unclear, say so.

Keep answers short (a few sentences). Never invent a serial number or specific provenance you cannot see.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// Parse a data URL ("data:image/png;base64,XXXX") into media type + raw base64.
function parseDataUrl(dataUrl: string): { mediaType: string; data: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;
  return { mediaType: match[1], data: match[2] };
}

// Build a compact catalog listing to ground the AI in real inventory + prices.
function buildCatalogContext(cars: Collectible[]): string {
  if (!cars.length) return 'STORE CATALOG: (currently unavailable)';
  const lines = cars
    .map((c) => `- ${c.name} | ${c.brand} | ${c.vehicleType} | ${c.releaseYear} | $${c.price.toFixed(2)} | ${c.rarityLevel} | demand ${c.demandScore ?? '-'}/100`)
    .join('\n');
  return `CURRENT STORE CATALOG (the only cars in stock — recommend ONLY from this list and cite exact name + price):\n${lines}`;
}

// Find the catalog car whose name best matches a free-text query.
function findCar(t: string, cars: Collectible[]): Collectible | null {
  let best: Collectible | null = null;
  let bestScore = 0;
  for (const c of cars) {
    const name = c.name.toLowerCase();
    const model = name.replace(c.brand.toLowerCase(), '').replace(/[()]/g, '').trim();
    const tokens = model.split(/\s+/).filter((w) => w.length > 2);
    const hits = tokens.filter((w) => t.includes(w)).length;
    const score = hits + (t.includes(name) ? 5 : 0);
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return bestScore >= 1 ? best : null;
}

// Levenshtein distance for fuzzy brand matching ("buggati" -> "bugatti").
function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

// Detect a brand in the query, tolerating small typos.
function findBrand(t: string, cars: Collectible[]): string | null {
  const brands = [...new Set(cars.map((c) => c.brand))];
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

// Offline catalog recommender, optionally scoped to a brand.
function recommendFromCatalog(t: string, cars: Collectible[], forcedBrand: string | null = null): string {
  let list = [...cars];
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
  return `${heading}\n` + top.map((c) => `• **${c.name}** — $${c.price.toFixed(2)} · ${c.rarityLevel}, ${c.vehicleType}${loose ? ` (open-box ~$${(c.price * 0.6).toFixed(0)}–$${(c.price * 0.8).toFixed(0)})` : ''}`).join('\n');
}

// Offline single-car review (optionally open-box/loose aware via the query).
function reviewCar(c: Collectible, t = ''): string {
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
  if (/loose|open[\s-]?box|used|worn|played/.test(t)) {
    const lo = (c.price * 0.6).toFixed(2);
    const hi = (c.price * 0.8).toFixed(2);
    return base + `\n\nFor an **open-box / loose** example, expect roughly **$${lo} – $${hi}** (under the $${c.price.toFixed(2)} carded/mint price).`;
  }
  return base;
}

// Answer superlative questions ("priciest", "cheapest", "rarest", …).
function superlative(t: string, cars: Collectible[]): string | null {
  const top = (sorted: Collectible[], label: string): string | null => {
    const c = sorted[0];
    if (!c) return null;
    return `The ${label} car in the store is the **${c.name}** — **$${c.price.toFixed(2)}**, ${c.rarityLevel} (${c.brand} ${c.vehicleType}, demand ${c.demandScore ?? 80}/100).`;
  };
  if (/priciest|most expensive|highest price|costliest|dearest/.test(t)) return top([...cars].sort((a, b) => b.price - a.price), 'most expensive');
  if (/cheapest|least expensive|lowest price|most affordable/.test(t)) return top([...cars].sort((a, b) => a.price - b.price), 'most affordable');
  if (/rarest|most rare/.test(t)) return top([...cars].sort((a, b) => (b.rarityLevel === 'Super Treasure Hunt' ? 1 : 0) - (a.rarityLevel === 'Super Treasure Hunt' ? 1 : 0) || (b.demandScore ?? 0) - (a.demandScore ?? 0)), 'rarest');
  if (/most popular|best ?sell|highest demand|hottest|most wanted/.test(t)) return top([...cars].sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0)), 'most popular');
  if (/newest|latest car|latest model|latest arrival/.test(t)) return top([...cars].sort((a, b) => b.releaseYear - a.releaseYear), 'newest');
  if (/oldest/.test(t)) return top([...cars].sort((a, b) => a.releaseYear - b.releaseYear), 'oldest');
  return null;
}

// Offline assistant: catalog-aware recommend/review + rule-based pricing & condition.
function heuristicReply(text: string, hasImage: boolean, catalog: Collectible[] = []): string {
  const t = text.toLowerCase().trim();
  const conditionGuide =
    'Condition grades:\n' +
    '• **Mint (M)** — flawless, usually still carded with a crisp blister.\n' +
    '• **Near Mint (NM)** — tiny flaws or light card wear.\n' +
    '• **Very Good (VG)** — visible wear, loose, or minor paint rub.\n\n' +
    'What to check: paint/Spectraflame finish, wheels & tires (Real Riders add value), and packaging creases.';

  // Greeting / help
  if (/^(hi|hey|hello|yo|help|what can you do)\b/.test(t)) {
    return "Hi! I'm your HotWheels Paradise concierge. I can recommend cars from the store, review a specific model, or help with pricing and condition. Try \"recommend a JDM car under $30\" or \"review the Ferrari F40\".";
  }

  // Superlatives ("priciest", "cheapest", "rarest", "most popular"…).
  if (catalog.length) {
    const sup = superlative(t, catalog);
    if (sup) return sup;
  }

  // A specific catalog car is named → price / review THAT car.
  if (catalog.length) {
    const car = findCar(t, catalog);
    if (car) return reviewCar(car, t);
    // A brand is named (typo-tolerant) → show/price that brand's lineup.
    const brand = findBrand(t, catalog);
    if (brand) return recommendFromCatalog(t, catalog, brand);
  }

  // No specific car → general recommendation / browse intent.
  if (catalog.length && /(recommend|suggest|looking for|what should|show me|find me|best|top|gift|budget|cheap|under \$?\d|below \$?\d|jdm|hypercar|supercar|muscle|coupe|sedan|electric|drift|rally)/.test(t)) {
    return recommendFromCatalog(t, catalog);
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

  // Vintage bump
  const yearMatch = t.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  let yearNote = '';
  if (yearMatch && Number(yearMatch[1]) < 1975) yearNote = ' Pre-1975 Redline-era castings can command a premium above this.';

  const imageNote = hasImage
    ? "\n\nI can't grade the photo itself in offline mode — but using the guide above, tell me what you see (paint, wheels, packaging) and I'll factor it in."
    : '';

  return `Ballpark for a **${tier}** piece: **${range}**.${conditionNote}${yearNote} Name a specific car (e.g. "Bugatti Chiron") and I'll give its exact listed price.` + imageNote;
}

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '12mb' })); // allow base64 image uploads to the assistant

  // Endpoint: GET /api/collectibles
  app.get('/api/collectibles', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      res.json(db.collectibles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read collectibles' });
    }
  });

  // Endpoint: POST /api/collectibles
  app.post('/api/collectibles', async (req: Request, res: Response) => {
    try {
      const { name, brand, vehicleType, scale, condition, releaseYear, price, rarityLevel, notes, series } = req.body;

      // Validation
      if (!name || !brand || !price || !releaseYear) {
        return res.status(400).json({ error: 'Missing required fields: name, brand, price, releaseYear' });
      }

      const parsedPrice = parseFloat(price);
      const parsedYear = parseInt(releaseYear);

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Price must be a valid non-negative number' });
      }

      if (isNaN(parsedYear) || parsedYear < 1800) {
        return res.status(400).json({ error: 'Release year must be a valid year' });
      }

      const db = await readDB();

      // Default image if none provided
      let image = req.body.image;
      if (!image) {
        // Choose placeholder based on brand/type
        image = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop';
      }

      const newCollectible: Collectible = {
        id: Date.now().toString(),
        name,
        brand,
        vehicleType: vehicleType || 'Muscle',
        scale: scale || '1:64',
        condition: condition || 'Mint (M)',
        releaseYear: parsedYear,
        price: parsedPrice,
        rarityLevel: rarityLevel || 'Mainline',
        series: series || 'Vault Custom Series',
        image,
        notes: notes || ''
      };

      db.collectibles.push(newCollectible);

      // Update stats dynamically
      db.stats.itemsInVault += 1;
      db.stats.totalCollectionValue = parseFloat((db.stats.totalCollectionValue + parsedPrice).toFixed(2));

      await writeDB(db);

      res.status(201).json(newCollectible);
    } catch (error) {
      console.error('Error adding collectible:', error);
      res.status(500).json({ error: 'Failed to add collectible' });
    }
  });

  // Endpoint: DELETE /api/collectibles/:id
  app.delete('/api/collectibles/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await readDB();
      const index = db.collectibles.findIndex((item) => item.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Collectible not found' });
      }
      const removedItem = db.collectibles[index];
      db.collectibles.splice(index, 1);

      // Adjust stats
      db.stats.itemsInVault = Math.max(0, db.stats.itemsInVault - 1);
      db.stats.totalCollectionValue = parseFloat(Math.max(0, db.stats.totalCollectionValue - removedItem.price).toFixed(2));

      await writeDB(db);
      res.json({ message: 'Collectible deleted successfully', id });
    } catch (error) {
      console.error('Error deleting collectible:', error);
      res.status(500).json({ error: 'Failed to delete collectible' });
    }
  });

  // Endpoint: GET /api/deals
  app.get('/api/deals', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      res.json(db.deals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read deals' });
    }
  });

  // Endpoint: GET /api/market-ticker
  app.get('/api/market-ticker', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      res.json(db.ticker);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read market ticker' });
    }
  });

  // Endpoint: GET /api/market-chart
  app.get('/api/market-chart', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      const timeframe = (req.query.timeframe as '1W' | '1M' | '1Y') || '1M';

      if (!['1W', '1M', '1Y'].includes(timeframe)) {
        return res.status(400).json({ error: 'Invalid timeframe. Supported: 1W, 1M, 1Y' });
      }

      const data = db.chartData[timeframe];
      res.json({ timeframe, data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to read chart data' });
    }
  });

  // Endpoint: GET /api/stats
  app.get('/api/stats', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      res.json(db.stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read stats' });
    }
  });

  // Endpoint: GET /api/community — collector price-check threads
  app.get('/api/community', async (req: Request, res: Response) => {
    try {
      const db = await readDB();
      res.json(db.community || []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read community threads' });
    }
  });

  // Endpoint: POST /api/community — post a new price-check question
  app.post('/api/community', async (req: Request, res: Response) => {
    try {
      const { car, question, author, rarity } = req.body;
      if (!car || !question) {
        return res.status(400).json({ error: 'Missing required fields: car, question' });
      }

      const db = await readDB();
      if (!db.community) db.community = [];

      const cleanAuthor = (typeof author === 'string' && author.trim()) || 'You';
      const newThread: CommunityThread = {
        id: `t_${Date.now()}`,
        author: cleanAuthor,
        avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(cleanAuthor.toLowerCase())}`,
        car: String(car).trim(),
        rarity: (typeof rarity === 'string' && rarity.trim()) || 'Mainline',
        question: String(question).trim(),
        askedAgo: 'just now',
        replies: [],
      };

      db.community.unshift(newThread);
      await writeDB(db);
      res.status(201).json(newThread);
    } catch (error) {
      console.error('Error posting community thread:', error);
      res.status(500).json({ error: 'Failed to post community thread' });
    }
  });

  // Endpoint: POST /api/assistant — AI pricing & condition agent (Claude, with vision)
  app.post('/api/assistant', async (req: Request, res: Response) => {
    try {
      const messages: ChatMessage[] = Array.isArray(req.body?.messages) ? req.body.messages : [];
      const imageDataUrl: string | undefined = req.body?.imageDataUrl;

      if (messages.length === 0) {
        return res.status(400).json({ error: 'No messages provided' });
      }

      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      const lastUserText = lastUser?.text || '';

      // Load the live catalog so the assistant can recommend/review real stock.
      let catalog: Collectible[] = [];
      try {
        catalog = (await readDB()).collectibles;
      } catch {
        // catalog stays empty — assistant still works for pricing/condition
      }

      // Graceful fallback when the AI service isn't configured (no API key).
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.json({ reply: heuristicReply(lastUserText, !!imageDataUrl, catalog), source: 'offline' });
      }

      // Lazy-load the SDK only when we actually have a key to use.
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic();

      // Build the message history; attach the image (if any) to the latest user turn.
      const parsedImage = imageDataUrl ? parseDataUrl(imageDataUrl) : null;
      const apiMessages = messages.map((m, i) => {
        const isLast = i === messages.length - 1;
        if (isLast && m.role === 'user' && parsedImage) {
          return {
            role: 'user' as const,
            content: [
              {
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: parsedImage.mediaType as 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp',
                  data: parsedImage.data,
                },
              },
              { type: 'text' as const, text: m.text || 'Assess this car: condition and a fair price range.' },
            ],
          };
        }
        return { role: m.role, content: m.text };
      });

      const response = await client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        system: `${ASSISTANT_SYSTEM}\n\n${buildCatalogContext(catalog)}`,
        messages: apiMessages,
      });

      const reply = response.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('')
        .trim();

      res.json({ reply: reply || 'Sorry, I could not generate a response.', source: 'ai' });
    } catch (error: any) {
      // Fall back to the offline estimator if the AI call fails, so the user
      // still gets a useful answer instead of an error.
      console.error('Assistant error:', error?.message || error);
      const lastUser = [...(req.body?.messages || [])].reverse().find((m: any) => m?.role === 'user');
      res.json({
        reply: heuristicReply(lastUser?.text || '', !!req.body?.imageDataUrl),
        source: 'offline',
      });
    }
  });

  // Unknown route -> JSON 404 (so clients never try to parse an HTML/text body)
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
  });

  // Catch-all error handler -> always respond with JSON
  app.use((err: Error, req: Request, res: Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export default createApp();
