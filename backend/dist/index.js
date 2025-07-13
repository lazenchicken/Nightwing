"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const auth_1 = __importDefault(require("./auth"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// 1) Create & connect the Redis client
const redisClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
redisClient.connect()
    .then(() => console.log('✅ Redis connected'))
    .catch(err => console.error('❌ Redis connection error:', err));
// 2) Create the RedisStore class bound to express-session
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
// 3) Configure session middleware to use RedisStore
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    store: new RedisStore({ client: redisClient }), // ← note the `new`
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
app.use(auth_1.default.initialize());
app.use(auth_1.default.session());
// Mount API and health endpoints
app.use('/api', api_1.default);
app.get('/health', (_req, res) => res.send('OK'));
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
