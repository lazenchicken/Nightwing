import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';
import passport from './auth';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 1) Create & connect the Redis client
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch(err => console.error('❌ Redis connection error:', err));

// 2) Create the RedisStore class bound to express-session
const RedisStore = connectRedis(session);

// 3) Configure session middleware to use RedisStore
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),  // ← note the `new`
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // set to true if HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24  // 1 day
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Mount API and health endpoints
app.use('/api', apiRouter);
app.get('/health', (_req, res) => res.send('OK'));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
