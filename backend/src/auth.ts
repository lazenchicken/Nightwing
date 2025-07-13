import express from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// No real OAuth strategy: just serialize/deserialize a dummy user
passport.serializeUser((u, done) => done(null, u));
passport.deserializeUser((u, done) => done(null, u));

export default passport;
