"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get('/me', (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Not authenticated' });
    res.json(req.user);
});
router.put('/preferences', async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Not authenticated' });
    const data = req.body;
    try {
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data
        });
        req.login(updated, () => { });
        res.json(updated);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
