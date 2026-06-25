// Vercel catch-all serverless function.
//
// A catch-all ([...path]) means Vercel routes every /api/* request to this one
// function while preserving the original request URL (e.g. /api/collectibles),
// which is exactly what the Express app's routes expect — no rewrite needed.
//
// We export the Express app as the default handler.
import app from '../server/src/app';

export default app;
