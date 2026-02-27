import express from 'express';

const router = express.Router();

// GET /api/profile - Get user profile (no auth - returns empty profile)
router.get('/api/profile', async (req, res) => {
  res.json({
    success: true,
    profile: null,
    message: 'Authentication is disabled. Profile features are not available.'
  });
});

// PUT /api/profile - Update profile (no auth - returns error)
router.put('/api/profile', async (req, res) => {
  res.status(403).json({
    error: 'Authentication is disabled. Profile features are not available.'
  });
});

export default router;
