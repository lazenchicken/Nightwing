import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user);
});

router.put('/preferences', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const data = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: (req.user as any).id },
      data
    });
    req.login(updated, () => {});
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
