"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../auth"));
const router = (0, express_1.Router)();
router.get('/bnet', auth_1.default.authenticate('bnet'));
router.get('/bnet/callback', auth_1.default.authenticate('bnet', { failureRedirect: '/' }), (req, res) => res.redirect('/'));
router.post('/logout', (req, res, next) => {
    req.logout(err => { if (err)
        return next(err); res.sendStatus(200); });
});
exports.default = router;
