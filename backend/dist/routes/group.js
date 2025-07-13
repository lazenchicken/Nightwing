"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const cache_1 = require("../cache");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    const chars = req.body.characters || [];
    try {
        const results = await Promise.all(chars.map(({ realm, name }) => (0, cache_1.cacheable)(`group::${realm}::${name}`, 300, async () => {
            const r = await axios_1.default.get('https://raider.io/api/v1/characters/profile', {
                params: {
                    realm,
                    name,
                    fields: 'mythic_plus_scores_by_season:current,gear,raid_progression',
                    apikey: process.env.RAIDERIO_KEY
                }
            });
            return { realm, name, ...r.data };
        })));
        res.json(results);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
