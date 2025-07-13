import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mount all /api routes, including our new /stat-comparison
app.use('/api', apiRouter);

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
