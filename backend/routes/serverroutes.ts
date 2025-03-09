import { Router } from 'express';

const router = Router();

// Define your server routes here:
router.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

export default router;
