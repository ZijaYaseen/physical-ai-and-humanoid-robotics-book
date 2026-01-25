import express from 'express';
import userProfileService from '../services/userProfileService';
import { ProfileUpdateDTO } from '../models/userProfile';

const router = express.Router();

// POST /api/profile - Create user profile (for signup)
router.post('/api/profile', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profileData = req.body;

    // Validate required fields if needed
    if (!profileData) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    // Check if profile already exists
    const existingProfile = await userProfileService.getUserProfile(userId);
    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists' });
    }

    const createdProfile = await userProfileService.createUserProfile(userId, profileData);

    res.status(201).json(createdProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// GET /api/profile - Get current user's profile
router.get('/api/profile', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    // This is a placeholder - actual implementation depends on how auth is integrated
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await userProfileService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/profile - Update user profile
router.put('/api/profile', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData: ProfileUpdateDTO = req.body;

    // Validate required fields if needed
    if (!updateData) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/profile - Delete user profile
router.delete('/api/profile', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await userProfileService.deleteUserProfile(userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// POST /api/profile/export - Export user data for GDPR compliance
router.post('/api/profile/export', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user profile
    const profile = await userProfileService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // In a real implementation, you'd also gather other user data
    const userData = {
      profile,
      createdAt: profile.profile_updated_at,
      // Add other related data as needed
    };

    // Send as JSON for now - in production, this might be a downloadable file
    res.json(userData);
  } catch (error) {
    console.error('Error exporting profile:', error);
    res.status(500).json({ error: 'Failed to export profile data' });
  }
});

// PUT /api/profile/preferences - Update personalization preferences
router.put('/api/profile/preferences', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { personalization_enabled } = req.body;

    if (typeof personalization_enabled !== 'boolean') {
      return res.status(400).json({ error: 'personalization_enabled must be a boolean' });
    }

    const updateData: ProfileUpdateDTO = {
      personalization_enabled
    };

    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;