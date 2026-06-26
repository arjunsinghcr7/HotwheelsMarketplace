export interface Collectible {
  id: string;
  name: string;
  brand: string;
  vehicleType: string;
  scale: string;
  condition: string;
  releaseYear: number;
  price: number;
  rarityLevel: string;
  series?: string;
  image: string;
  notes?: string;
  isFeatured?: boolean;
  demandScore?: number;
}

export interface Deal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  notes?: string;
}

export interface TickerItem {
  name: string;
  price: number;
  change: number;
  direction: 'up' | 'down' | 'none';
}

export interface Stats {
  totalCollectionValue: number;
  itemsInVault: number;
  setCompletePercent: number;
  setCompleteName: string;
}

// Same-origin in production (Vercel serves the API under /api). In local dev the
// Vite proxy (see vite.config.ts) forwards /api to the Express server on :5001.
// Override with VITE_API_URL when pointing at a separately hosted backend.
import { localAssistantReply } from './assistantFallback';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchCollectibles(): Promise<Collectible[]> {
  const res = await fetch(`${API_BASE}/collectibles`);
  if (!res.ok) throw new Error('Failed to fetch collectibles');
  return res.json();
}

export async function addCollectible(data: Omit<Collectible, 'id' | 'image'> & { image?: string }): Promise<Collectible> {
  const res = await fetch(`${API_BASE}/collectibles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to add collectible');
  }
  return res.json();
}

export async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch(`${API_BASE}/deals`);
  if (!res.ok) throw new Error('Failed to fetch deals');
  return res.json();
}

export async function fetchTicker(): Promise<TickerItem[]> {
  const res = await fetch(`${API_BASE}/market-ticker`);
  if (!res.ok) throw new Error('Failed to fetch ticker');
  return res.json();
}

export async function fetchChartData(timeframe: '1W' | '1M' | '1Y'): Promise<number[]> {
  const res = await fetch(`${API_BASE}/market-chart?timeframe=${timeframe}`);
  if (!res.ok) throw new Error('Failed to fetch chart data');
  const body = await res.json();
  return body.data;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export interface AssistantMessage {
  role: 'user' | 'assistant';
  text: string;
}

// Ask the AI pricing/condition agent. Optionally include an image (data URL)
// for the latest user turn so it can assess condition from a photo.
// Never throws — if the backend is unreachable or errors, it returns a
// locally-computed offline estimate so the assistant always replies.
export async function askAssistant(
  messages: AssistantMessage[],
  imageDataUrl?: string
): Promise<{ reply: string; source: 'ai' | 'offline' }> {
  const lastUserText = [...messages].reverse().find((m) => m.role === 'user')?.text || '';
  try {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, imageDataUrl }),
    });
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch {
    return { reply: localAssistantReply(lastUserText, !!imageDataUrl), source: 'offline' };
  }
}

export async function deleteCollectible(id: string): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/collectibles/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to delete collectible');
  }
  return res.json();
}

