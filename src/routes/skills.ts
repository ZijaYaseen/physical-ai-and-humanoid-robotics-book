import express from 'express';
import userProfileService from '../services/userProfileService';

const router = express.Router();

// POST /api/signup/skills - Save user skills selection during signup
router.post('/api/signup/skills', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { skills } = req.body;

    // Validate skills input
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    // Validate each skill (basic validation - you might want to check against a predefined list)
    for (const skill of skills) {
      if (typeof skill !== 'string' || skill.trim().length === 0) {
        return res.status(400).json({ error: 'Each skill must be a non-empty string' });
      }
    }

    // Update user profile with skills
    const updateData = {
      development_tools: skills
    };

    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      profile: updatedProfile,
      message: 'Skills updated successfully'
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// GET /api/user/skills - Get user's selected skills
router.get('/api/user/skills', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await userProfileService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      skills: profile.development_tools || []
    });
  } catch (error) {
    console.error('Error getting skills:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
});

export default router;