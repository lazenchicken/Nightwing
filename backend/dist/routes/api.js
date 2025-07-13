"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const cache_1 = require("../cache");
const router = (0, express_1.Router)();
// … your existing proxyCached endpoints …
// NEW: merge Icy Veins, Archon.gg & Warcraft Logs weights
router.get('/stat-comparison', async (req, res) => {
    try {
        const spec = String(req.query.spec || 'druid-balance-pve');
        // 1) Icy Veins scrape
        const icyP = (0, cache_1.cacheable)(`icy:${spec}`, 600, async () => {
            const html = (await axios_1.default.get(`https://www.icy-veins.com/wow/${spec}`)).data;
            const cheerio = require('cheerio');
            const $ = cheerio.load(html);
            const out = [];
            $('h2:contains("Stat Priority")').next('table')
                .find('tbody tr').each((_, row) => {
                const cols = $(row).find('td');
                const stat = cols.eq(0).text().trim();
                const w = parseFloat(cols.eq(1).text().replace(/[^0-9.]/g, ''));
                if (stat && !isNaN(w))
                    out.push({ stat, weight: w });
            });
            return out;
        });
        // 2) Archon.gg
        const archonP = (0, cache_1.cacheable)(`archon:${spec}`, 600, async () => {
            const { data } = await axios_1.default.get('https://api.archon.gg/stats', { params: { spec, key: process.env.ARCHON_KEY } });
            return data;
        });
        // 3) Warcraft Logs computed weights
        const actualP = (0, cache_1.cacheable)(`wcl:${spec}`, 600, async () => {
            const { data } = await axios_1.default.get('https://www.warcraftlogs.com/v1/parses/weight', { params: { spec, metric: 'dps', api_key: process.env.WARCRAFTLOGS_KEY } });
            return data;
        });
        const [icy, archon, actual] = await Promise.all([icyP, archonP, actualP]);
        const keys = new Set();
        icy.forEach(w => keys.add(w.stat));
        archon.forEach(w => keys.add(w.stat));
        actual.forEach(w => keys.add(w.stat));
        const merged = Array.from(keys).map(stat => ({
            stat,
            icy: icy.find(w => w.stat === stat)?.weight ?? 0,
            archon: archon.find(w => w.stat === stat)?.avgWeight ?? 0,
            actual: actual.find(w => w.stat === stat)?.computedWeight ?? 0
        }));
        res.json(merged);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
