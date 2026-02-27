import express from 'express';

const router = express.Router();

// GET /api/personalization/context - Get personalization context (no auth)
router.get('/api/personalization/context', async (req, res) => {
  res.json({
    personalization_enabled: false,
    message: 'Authentication is disabled. Personalization features are not available.'
  });
});

// PUT /api/personalization/context - Update context (no auth - returns error)
router.put('/api/personalization/context', async (req, res) => {
  res.status(403).json({
    error: 'Authentication is disabled. Personalization features are not available.'
  });
});

export default router;
