import express from 'express';

const router = express.Router();

// POST /api/query - Proxy query to Python RAG backend
router.post('/api/query', async (req, res) => {
  try {
    const { query, selected_text, mode, session_id, top_k = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Forward to Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        selected_text,
        mode,
        session_id,
        top_k,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;
