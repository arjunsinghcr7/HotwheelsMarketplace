// Vercel serverless function entrypoint.
//
// Vercel turns every file in this top-level /api folder into a serverless
// function. We export the Express app as the default handler; the rewrite in
// vercel.json routes all /api/* requests here, and the app's own routes
// (defined as /api/...) match the original request path.
import app from '../server/src/app';

export default app;
