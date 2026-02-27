import express from 'express';

const router = express.Router();

// POST /api/signup/skills - Save skills (no auth - returns success without saving)
router.post('/api/signup/skills', async (req, res) => {
  res.json({
    success: true,
    message: 'Authentication is disabled. Skills are not being saved.'
  });
});

// GET /api/user/skills - Get skills (no auth - returns empty)
router.get('/api/user/skills', async (req, res) => {
  res.json({
    skills: [],
    message: 'Authentication is disabled.'
  });
});

export default router;
