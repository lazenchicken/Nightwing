import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// Serve React static assets (if build exists)
import path from 'path';
import fs from 'fs';
const clientBuildPath = path.join(__dirname, '../public');
if (fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
  app.use(express.static(clientBuildPath));
  // SPA fallback route
  app.get('/*', (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.warn(`⚠️ React build not found at ${clientBuildPath}, skipping static assets.`);
}

// API routes
app.use('/api', apiRouter);

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));
// Development: proxy all non-API/health traffic to Vite dev server when no build exists
if (!fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
  // using http-proxy-middleware to serve assets and HMR
  // npm install http-proxy-middleware --save
  const { createProxyMiddleware } = require('http-proxy-middleware');
  const devClientURL = `http://localhost:${process.env.FRONTEND_PORT || 5173}`;
  app.use(
    createProxyMiddleware({
      target: devClientURL,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
      // ensure API and health routes are skipped by placing before proxy
      // pathRewrite: { '^/': '/' },
    })
  );
}

const PORT = Number(process.env.PORT || 4000);
// Bind to all interfaces so localhost and Docker mappings can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend listening on http://0.0.0.0:${PORT}`);
});
