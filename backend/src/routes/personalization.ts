import express from 'express';
import userProfileService from '../services/userProfileService';
import { PersonalizationContextUpdateDTO } from '../models/userProfile';

const router = express.Router();

// GET /api/personalization/context - Get current personalization context
router.get('/api/personalization/context', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const context = await userProfileService.getPersonalizationContext(userId);

    res.json(context || { user_id: userId }); // Return empty context if none exists
  } catch (error) {
    console.error('Error getting personalization context:', error);
    res.status(500).json({ error: 'Failed to get personalization context' });
  }
});

// PUT /api/personalization/context - Update personalization context
router.put('/api/personalization/context', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData: PersonalizationContextUpdateDTO = req.body;

    const updatedContext = await userProfileService.createOrUpdatePersonalizationContext(userId, updateData);

    res.json(updatedContext);
  } catch (error) {
    console.error('Error updating personalization context:', error);
    res.status(500).json({ error: 'Failed to update personalization context' });
  }
});

// POST /api/personalization/opt-out - Temporarily disable personalization
router.post('/api/personalization/opt-out', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user profile to disable personalization
    const updateData = {
      personalization_enabled: false
    };

    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error disabling personalization:', error);
    res.status(500).json({ error: 'Failed to disable personalization' });
  }
});

// POST /api/personalization/opt-in - Re-enable personalization
router.post('/api/personalization/opt-in', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user profile to enable personalization
    const updateData = {
      personalization_enabled: true
    };

    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error enabling personalization:', error);
    res.status(500).json({ error: 'Failed to enable personalization' });
  }
});

export default router;