// C:\Nightwing\backend\server.js
// Load environment variables
require('dotenv').config();
const express = require('express');
const app = express();

app.get('/health', (_req, res) => res.send('OK'));

// Use dynamic PORT (for Railway) or fallback to 4000
const PORT = process.env.PORT || 4000;
// If running on Windows behind HTTP proxy, configure axios
const isWindows = process.platform === 'win32';
if (isWindows && process.env.HTTP_PROXY) {
  const axios = require('axios');
  const { HttpsProxyAgent } = require('https-proxy-agent');
  axios.defaults.httpsAgent = new HttpsProxyAgent(process.env.HTTP_PROXY);
}
// Start server after all routes are defined
// Blizzard OAuth helper
const axios = require('axios');
const qs = require('querystring');
// DNS promises API
const dns = require('dns').promises;
const { exec } = require('child_process');

// DNS lookup endpoint: returns A/AAAA records for a given host
app.get('/api/dns', async (req, res) => {
  const { host: hostQ, region } = req.query;
  // Derive host from query or region, default to US API
  const host = hostQ || (region ? `${region}.api.blizzard.com` : 'us.api.blizzard.com');
  try {
    const records = await dns.lookup(host, { all: true });
    return res.json({ host, records });
  } catch (err) {
    console.error('dns lookup error', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Ping endpoint: performs ICMP ping using host or region (us/eu)
app.get('/api/ping', (req, res) => {
  const { host: hostQ, region } = req.query;
  const host = hostQ || (region ? `${region}.api.blizzard.com` : 'us.api.blizzard.com');
  const countFlag = process.platform === 'win32' ? '-n' : '-c';
  exec(`ping ${countFlag} 4 ${host}`, (error, stdout, stderr) => {
    if (error) {
      console.error('ping error', stderr || error.message);
      return res.status(500).json({ error: stderr || error.message });
    }
    return res.json({ host, output: stdout });
  });
});

async function getBlizzardToken() {
  const tokenUrl = 'https://oauth.battle.net/token';
  const creds = qs.stringify({ grant_type: 'client_credentials' });
  const resp = await axios.post(tokenUrl, creds, {
    auth: {
      username: process.env.BLIZZARD_CLIENT_ID,
      password: process.env.BLIZZARD_CLIENT_SECRET
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return resp.data.access_token;
}
// Search characters via Blizzard Profile API
app.get('/api/search/characters', async (req, res) => {
  const { search } = req.query;
  if (!search) return res.json([]);
  try {
    const token = await getBlizzardToken();
    // Search across US and EU regions
    const regions = ['us', 'eu'];
    let combined = [];
    for (const region of regions) {
      const url = `https://${region}.api.blizzard.com/profile/wow/character/search`;
      const { data } = await axios.get(url, {
        params: {
          namespace: `profile-${region}`,
          locale: 'en_US',
          access_token: token,
          namePrefix: search,
          'page[size]': 10,
          'page[number]': 1
        }
      });
      combined.push(...(data.results || []).map(c => ({
        name: c.data.name,
        realm: c.data.realm.name
      })));
    }
    // Return top 10 combined matches
    const results = combined.slice(0, 10);
    return res.json(results);
  } catch (err) {
    console.error('character search error', err.message);
    return res.status(500).json([]);
  }
});

// Search guilds via Blizzard Profile API
app.get('/api/search/guilds', async (req, res) => {
  const { search } = req.query;
  if (!search) return res.json([]);
  try {
    const token = await getBlizzardToken();
    // Search across US and EU regions
    const regions = ['us', 'eu'];
    let combinedGuilds = [];
    for (const region of regions) {
      const url = `https://${region}.api.blizzard.com/profile/wow/guild/search`;
      const { data } = await axios.get(url, {
        params: {
          namespace: `profile-${region}`,
          locale: 'en_US',
          access_token: token,
          namePrefix: search,
          'page[size]': 10,
          'page[number]': 1
        }
      });
      combinedGuilds.push(...(data.results || []).map(g => ({
        name: g.data.name,
        realm: g.data.realm.name
      })));
    }
    // Return top 10 combined matches
    const results = combinedGuilds.slice(0, 10);
    return res.json(results);
  } catch (err) {
    console.error('guild search error', err.message);
    return res.status(500).json([]);
  }
});

// Serve static frontend in production (must come after API routes)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  // Only serve index.html for non-API routes
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start listening
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
