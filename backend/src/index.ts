// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

export function createApp() {
  const app = express();
  app.use(cors());
  app.get('/health', (_req, res) => res.send('OK'));
  return app;
}

async function main() {
  const port = Number(process.env.PORT ?? 4000);
  const app = createApp();
  await app.listen(port);
  console.log(`🚀 TS server listening on http://localhost:${port}`);
}

main().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
