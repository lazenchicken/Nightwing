import { Router } from 'express';
import passport from '../auth';

const router = Router();

router.get('/bnet', passport.authenticate('bnet'));

router.get(
  '/bnet/callback',
  passport.authenticate('bnet', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

router.post('/logout', (req, res, next) => {
  req.logout(err => { if (err) return next(err); res.sendStatus(200); });
});

export default router;
