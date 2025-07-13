"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// No real OAuth strategy: just serialize/deserialize a dummy user
passport_1.default.serializeUser((u, done) => done(null, u));
passport_1.default.deserializeUser((u, done) => done(null, u));
exports.default = passport_1.default;
