import express, { Request, Response } from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
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

export interface Database {
  collectibles: Collectible[];
  deals: Deal[];
  ticker: TickerItem[];
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

// System prompt for the AI pricing/condition assistant.
const ASSISTANT_SYSTEM = `You are an expert Hot Wheels and die-cast collectible appraiser embedded in a collector marketplace app.
Help users price their cars and judge condition. Be concise, practical, and friendly.

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

// Offline fallback: a rough rule-based estimate when no API key is configured.
function heuristicReply(text: string, hasImage: boolean): string {
  const t = text.toLowerCase();

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
  if (/(mint|sealed|carded|unopened)/.test(t)) conditionNote = ' Mint/carded examples sit at the top of that range.';
  else if (/(loose|played|damaged|rub|crease|worn)/.test(t)) conditionNote = ' Loose or worn examples sit at the bottom of that range.';

  const imageNote = hasImage
    ? '\n\n(Live photo-condition analysis needs the AI service. Set ANTHROPIC_API_KEY in the deployment to enable it.)'
    : '';

  return `Rough estimate for a **${tier}** piece: **${range}**.${conditionNote}` +
    `\n\nThis is an offline rule-of-thumb. For a real appraisal that factors in the exact casting, year, and a photo, configure the AI service.${imageNote}`;
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

      // Graceful fallback when the AI service isn't configured.
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.json({ reply: heuristicReply(lastUserText, !!imageDataUrl), source: 'offline' });
      }

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
        system: ASSISTANT_SYSTEM,
        messages: apiMessages,
      });

      const reply = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();

      res.json({ reply: reply || 'Sorry, I could not generate a response.', source: 'ai' });
    } catch (error: any) {
      console.error('Assistant error:', error?.message || error);
      res.status(500).json({ error: 'The assistant is unavailable right now. Please try again.' });
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
