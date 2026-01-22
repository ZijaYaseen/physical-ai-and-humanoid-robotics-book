import express from 'express';
import ragService from '../services/ragService';

const router = express.Router();

// POST /api/query - Enhanced query endpoint that includes user context
router.post('/api/query', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    // Original query data
    const { query, topK = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Process the query with RAG service which handles user context injection and personalization
    const response = await ragService.processQuery(userId, query, topK);

    res.json(response);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;