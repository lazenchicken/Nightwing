// C:\Nightwing\backend\server.js
// Load environment variables
require('dotenv').config();
const express = require('express');
const app = express();
// Disable ETag to prevent 304 caching for API responses
app.disable('etag');
// Force no-store on all API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

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
// In-memory cache for Blizzard OAuth token
let blizzardToken = null;
let tokenExpiresAt = 0;
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

/**
 * Get a cached OAuth token, refreshing it when expired.
 */
async function getBlizzardToken() {
  const now = Date.now();
  if (blizzardToken && now < tokenExpiresAt) {
    console.log('🔑 Using cached Blizzard token');
    return blizzardToken;
  }
  console.log('🔑 Fetching new Blizzard token');
  const tokenUrl = 'https://oauth.battle.net/token';
  const creds = qs.stringify({ grant_type: 'client_credentials' });
  const resp = await axios.post(tokenUrl, creds, {
    auth: {
      username: process.env.BLIZZARD_CLIENT_ID,
      password: process.env.BLIZZARD_CLIENT_SECRET
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  blizzardToken = resp.data.access_token;
  // expires_in is in seconds
  tokenExpiresAt = now + (resp.data.expires_in || 86399) * 1000;
  console.log(`🔑 New token expires in ${resp.data.expires_in || 'unknown'}s`);
  return blizzardToken;
}
// Search characters via Blizzard Profile API
// Supports regions: us, eu, kr, tw, cn
app.get('/api/search/characters', async (req, res) => {
  const { search, pageNumber, pageSize, region } = req.query;
  if (!search) return res.json([]);
  try {
    const token = await getBlizzardToken();
    const regions = region ? [region] : ['us','eu','kr','tw','cn'];
    let combined = [];
    for (const region of regions) {
      try {
        const url = `https://${region}.api.blizzard.com/profile/wow/search/character`;
        const params = {
          namespace: `profile-${region}`,
          locale: region === 'eu' ? 'en_GB' : 'en_US',
          namePrefix: search,
          'page[size]': pageSize || 10,
          'page[number]': pageNumber || 1,
          access_token: token
        };
        console.log('Blizzard Character Search:', url, params);
        const { data } = await axios.get(url, { params });
        combined.push(...(data.results || []).map(c => ({
          id: c.data.id,
          name: c.data.name,
          realm: c.data.realm.name,
          level: c.data.level
        })));
      } catch (err) {
        console.error(`character search ${region} error`, err.message);
        // continue to next region
      }
    }
    return res.json(combined);
  } catch (err) {
    console.error('character search error', err.message);
    return res.status(500).json([]);
  }
});

// Search guilds via Blizzard Profile API
// Supports regions: us, eu, kr, tw, cn
app.get('/api/search/guilds', async (req, res) => {
  const { search, pageNumber, pageSize, region } = req.query;
  if (!search) return res.json([]);
  try {
    const token = await getBlizzardToken();
    const regions = region ? [region] : ['us','eu','kr','tw','cn'];
    let combined = [];
    for (const region of regions) {
      const url = `https://${region}.api.blizzard.com/profile/wow/search/guild`;
      const params = {
        namespace: `profile-${region}`,
        locale: 'en_US',
        namePrefix: search,
        'page[size]': pageSize || 10,
        'page[number]': pageNumber || 1,
        access_token: token
      };
      console.log('Blizzard Guild Search:', url, params);
      const { data } = await axios.get(url, { params });
      combined.push(...(data.results || []).map(g => ({
        id: g.data.id,
        name: g.data.name,
        realm: g.data.realm.name
      })));
    }
    return res.json(combined);
  } catch (err) {
    console.error('guild search error', err.message);
    return res.status(500).json([]);
  }
});

// Gear comparison endpoint: fetch equipment for a character
app.get('/api/gear-comparison', async (req, res) => {
  const { name, realm, region = 'us' } = req.query;
  if (!name || !realm) {
    return res.status(400).json({ error: 'name and realm query params required' });
  }
  try {
    const token = await getBlizzardToken();
    // Slugify realm: lowercase, spaces to hyphens
    const realmSlug = realm.toString().toLowerCase().replace(/\s+/g, '-');
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug}/${name}/equipment`;
    const params = { namespace: `profile-${region}`, locale: region === 'eu' ? 'en_GB' : 'en_US', access_token: token };
    console.log('Blizzard Equipment API:', url, params);
    const { data } = await axios.get(url, { params });
    // Return equipment list
    return res.json(data.equipment.map(slot => ({
      slot: slot.slot.name,
      id: slot.item.id,
      name: slot.item.name,
      quality: slot.item.quality.type,
      level: slot.level.value
    })));
  } catch (err) {
    console.error('gear-comparison error', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Time endpoint: fetch Blizzard server time
app.get('/api/time', async (req, res) => {
  const { region = 'us' } = req.query;
  try {
    const token = await getBlizzardToken();
    const params = {
      namespace: `dynamic-${region}`,
      locale: region === 'eu' ? 'en_GB' : 'en_US',
      access_token: token
    };
    // Try both `/index` and no-index paths
    const basePath = `data/wow/time`;
    const urlIndex = `https://${region}.api.blizzard.com/${basePath}/index`;
    const urlNoIndex = `https://${region}.api.blizzard.com/${basePath}`;
    console.log('Blizzard Time API, trying:', urlIndex, params);
    let data;
    try {
      ({ data } = await axios.get(urlIndex, { params }));
    } catch (errIndex) {
      if (errIndex.response?.status === 404) {
        console.warn('Time index 404, retrying without /index');
        ({ data } = await axios.get(urlNoIndex, { params }));
      } else throw errIndex;
    }
    return res.json({ timestamp: data.timestamp });
  } catch (err) {
    // Log full Blizzard response error
    console.error('time error status:', err.response?.status, 'data:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const errorBody = err.response?.data?.detail || err.response?.data || err.message;
    return res.status(status).json({ error: errorBody });
  }
});

// Stat comparison endpoint: stub sample data for now
app.get('/api/stat-comparison', (req, res) => {
  const { spec, realm, character } = req.query;
  console.log('Stat-comparison parameters:', { spec, realm, character });
  // Sample stat weights for demonstration
  const sample = [
    { stat: 'Haste', icy: 1.2, archon: 1.1, actual: 1.15 },
    { stat: 'Critical Strike', icy: 1.0, archon: 0.9, actual: 0.95 },
    { stat: 'Mastery', icy: 1.3, archon: 1.2, actual: 1.25 },
    { stat: 'Versatility', icy: 0.8, archon: 0.85, actual: 0.82 },
  ];
  return res.json(sample);
});

// Gear average endpoint: proxy Raider.IO gear data
// Gear average endpoint: fetch equipped and BIS gear from Raider.IO
// Gear average endpoint: proxy Raider.IO gear data
app.get('/api/gearAverage', async (req, res) => {
    const { realm, name, region = 'us', spec } = req.query;
  try {
    console.log('Fetching gear & BIS from Raider.IO:', { realm, name, region, spec });
    let url = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=gear,gear_bis`;
    // If spec slug provided (e.g. druid-balance-raids-single-target), extract spec part for raider.io
    if (spec && typeof spec === 'string') {
      const parts = spec.split('-');
      if (parts.length >= 2) {
        const specName = parts[1];
        url += `&spec=${specName}`;
      }
    }
    const resp = await axios.get(url);
    const g = resp.data.gear;
    const bis = resp.data.gear_bis;
    const items = (g.items || []).map(i => ({ slot: i.slot, item_level: i.item_level, icon: i.icon_url }));
    const averages = (bis.items || []).map(i => ({
      slot: i.slot,
      communityAvg: g.items.find(x => x.slot === i.slot)?.item_level || 0,
      bis: i.item_level
    }));
    return res.json({ item_level_equipped: g.item_level_equipped, items, averages });
  } catch (err) {
    console.error('gearAverage error', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Icy Veins stat weights endpoint: scrape static page for weights
const cheerio = require('cheerio');
app.get('/api/icyveins/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const url = `https://www.icy-veins.com/wow/building-your-${slug}`;
    console.log('Scraping Icy Veins weights from:', url);
    const html = await axios.get(url).then(r => r.data);
    const $ = cheerio.load(html);
    const weights = [];
    $('table.stats-table tbody tr').each((_, el) => {
      const stat = $(el).find('td').eq(0).text().trim();
      const weight = parseFloat($(el).find('td').eq(1).text().trim());
      if (stat && !isNaN(weight)) weights.push({ stat, weight });
    });
    return res.json(weights);
  } catch (err) {
    console.error('icyveins scrape error', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Archon.gg stats endpoint: fetch stat weights for given spec
// Archon stats endpoint: proxy via WarcraftLogs parse-weight
app.get('/api/archon', async (req, res) => {
  const { realm, name, spec } = req.query;
  if (!realm || !name || !spec) {
    return res.status(400).json({ error: 'realm, name & spec query params required' });
  }
  try {
    console.log('Proxying Archon stats from Warcraft Logs:', { realm, name, spec });
    const r = await axios.get('https://www.warcraftlogs.com/v1/parses/weight', {
      params: { realm, character: name, spec },
      headers: { Authorization: `Bearer ${process.env.ARCHON_KEY}` }
    });
    const weights = (r.data || []).map(w => ({ stat: w.stat, avgWeight: w.computedWeight }));
    return res.json(weights);
  } catch (err) {
    console.error('archon proxy error', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// RaiderIO profile endpoint: stub sample data for frontend
app.get('/api/raiderio', (req, res) => {
  const { realm, name, fields } = req.query;
  console.log('RaiderIO parameters:', { realm, name, fields });
  // Stubbed RaiderIO profile
  const stub = {
    name: name || 'Unknown',
    realm: realm || 'Unknown',
    region: 'us',
    faction: 'Alliance',
    class: 'Druid',
    spec: 'Balance',
    gear: { item_level_equipped: 700, items: [] },
    mythic_plus_scores_by_season: { current: { dungeons: [] } },
    raid_progression: {}
  };
  return res.json(stub);
});

// Talent icons endpoint: fetch selected talents and icons from Blizzard Profile API
app.get('/api/talents', async (req, res) => {
  const { realm, name, spec, region = 'us' } = req.query;
  if (!realm || !name) {
    return res.status(400).json({ error: 'realm and name query params required' });
  }
  try {
    const token = await getBlizzardToken();
    const realmSlug = realm.toString().toLowerCase().replace(/\s+/g, '-');
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug}/${name}/talents`;
    const params = {
      namespace: `profile-${region}`,
      locale: region === 'eu' ? 'en_GB' : 'en_US',
      access_token: token
    };
    console.log('Fetching talents from Blizzard:', { realm: realmSlug, name, spec, region });
    const resp = await axios.get(url, { params });
    const talents = (resp.data.talents || []).filter(t => t.selected).map(t => ({
      id: String(t.spell.id),
      icon: t.spell.icon,
      tier: t.tier_position
    }));
    // Group talents by tier ranges
    const classTalents = talents.filter(t => t.tier <= 1).map(t => ({ id: t.id, iconUrl: `https://render-${region}.worldofwarcraft.com/icons/56/${t.icon}.jpg` }));
    const heroTalents = talents.filter(t => t.tier >= 2 && t.tier <= 4).map(t => ({ id: t.id, iconUrl: `https://render-${region}.worldofwarcraft.com/icons/56/${t.icon}.jpg` }));
    const specTalents = talents.filter(t => t.tier >= 5).map(t => ({ id: t.id, iconUrl: `https://render-${region}.worldofwarcraft.com/icons/56/${t.icon}.jpg` }));
    return res.json({ classTalents, heroTalents, specTalents });
  } catch (err) {
    console.error('talents fetch error', err.message);
    return res.status(500).json({ error: err.message });
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
