"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const cache_1 = require("../cache");
const router = (0, express_1.Router)();
router.get('/:realm/:guildName', async (req, res) => {
    const { realm, guildName } = req.params;
    try {
        const data = await (0, cache_1.cacheable)(`guild::${realm}::${guildName}`, 300, async () => {
            const r = await axios_1.default.get('https://raider.io/api/v1/guilds/profile', {
                params: {
                    region: 'us',
                    realm,
                    guildName,
                    fields: 'members,mythic_plus_best_runs,raid_progression',
                    apikey: process.env.RAIDERIO_KEY
                }
            });
            return r.data.members.map((m) => ({
                character: { name: m.name, realm },
                spec_role: m.spec_role,
                mythic_plus_scores_by_season: { current: m.mythic_plus_best_runs },
                raid_progression: m.raid_progression
            }));
        });
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
