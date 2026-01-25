import express from 'express';
import userProfileService from '../../services/userProfileService';
import { UserProfile } from '../../models/userProfile';

const router = express.Router();

// POST /api/chatkit/session - Session endpoint with user profile context
router.post('/api/chatkit/session', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const userId = (req as any).user?.id; // Assuming user info is attached to request by auth middleware

    // Get user profile if authenticated
    let userProfile: UserProfile | null = null;
    if (userId) {
      userProfile = await userProfileService.getUserProfile(userId);
    }

    // Create session data with user context
    const sessionData = {
      sessionId: generateSessionId(), // Helper function to generate unique session ID
      timestamp: new Date(),
      userId: userId || null,
      userContext: userProfile ? {
        id: userProfile.user_id,
        experienceLevel: userProfile.programming_experience,
        osPreference: userProfile.os_preference,
        familiarTools: userProfile.development_tools,
        deviceType: userProfile.device_type,
        personalizationEnabled: userProfile.personalization_enabled,
        consentGiven: userProfile.consent_given
      } : null,
      preferences: {
        // Default preferences if no user context
        enablePersonalization: userProfile ? userProfile.personalization_enabled : false,
        responseComplexity: userProfile ? deriveResponseComplexity(userProfile.programming_experience) : 'medium',
        preferredLanguage: 'en',
        contextWindowSize: 5 // Number of previous messages to consider
      },
      ragContext: userProfile ? {
        // Context specifically for RAG system
        experienceLevel: userProfile.programming_experience,
        osPreference: userProfile.os_preference,
        familiarTools: userProfile.development_tools,
        personalizationEnabled: userProfile.personalization_enabled
      } : null
    };

    res.json(sessionData);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Helper function to generate session ID
function generateSessionId(): string {
  return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Helper function to derive response complexity based on user experience
function deriveResponseComplexity(experienceLevel: string): string {
  switch (experienceLevel) {
    case 'beginner':
      return 'simple';
    case 'intermediate':
      return 'medium';
    case 'advanced':
      return 'detailed';
    default:
      return 'medium';
  }
}

export default router;