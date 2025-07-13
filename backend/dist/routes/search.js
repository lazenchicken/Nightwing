"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const cache_1 = require("../cache");
const router = (0, express_1.Router)();
router.get('/characters', async (req, res) => {
    const q = String(req.query.search || '');
    if (!q)
        return res.status(400).json({ error: 'search param required' });
    try {
        const results = await (0, cache_1.cacheable)(`search::${q}`, 300, async () => {
            const r = await axios_1.default.get('https://raider.io/api/v1/characters/search', {
                params: { query: q, limit: 10, apikey: process.env.RAIDERIO_KEY }
            });
            return r.data.results;
        });
        res.json(results);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
