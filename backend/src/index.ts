import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// Serve React static assets
import path from 'path';
const clientBuildPath = path.join(__dirname, '../public');
app.use(express.static(clientBuildPath));

// API routes
app.use('/api', apiRouter);

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));
// Fallback to client index.html for SPA routing
app.get('/*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
