import express from 'express';

const router = express.Router();

// POST /api/chatkit/session - Create or retrieve chat session
router.post('/api/chatkit/session', async (req, res) => {
  try {
    const { session_id, user_preferences } = req.body;

    // Forward to Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/chatkit/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        user_preferences,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

export default router;
