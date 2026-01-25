import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to get user ID from Better Auth session
// In a real implementation, this would verify the session with Better Auth
const getUserIdFromRequest = async (req: any): Promise<string | null> => {
  // This is a simplified approach - in reality, you'd verify the session with Better Auth
  // by checking the session token in headers/cookies against Better Auth's API
  const authHeader = req.headers.authorization;
  const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // For now, returning null to indicate the need for proper session verification
  // This would be implemented by calling Better Auth's session verification API
  return null;
};

// GET /api/profile - Get current user's profile
router.get('/', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    // NOTE: This is a simplified approach - proper session verification needed with Better Auth
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // For now, we'll simulate getting user ID from session
    // In a real implementation, you'd call Better Auth to verify the session
    // const session = await auth.api.getSession({ sessionToken });
    // const userId = session.userId;

    // For this demo, we'll use a mock approach until Better Auth session verification is properly integrated
    const userId = (req as any).user?.id || req.cookies?.['better-auth.session_token']?.split('.')[0] || null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// POST /api/profile - Create user profile (for signup)
router.post('/', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // For this demo, we'll use a mock approach
    const userId = (req as any).user?.id || req.cookies?.['better-auth.session_token']?.split('.')[0] || null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profileData = req.body;

    // Validate required fields if needed
    if (!profileData) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    // Check if profile already exists
    const existingQuery = 'SELECT user_id FROM user_profiles WHERE user_id = $1';
    const existingResult = await pool.query(existingQuery, [userId]);

    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Profile already exists' });
    }

    // Insert the user profile
    const query = `
      INSERT INTO user_profiles (
        user_id,
        programming_experience,
        os_preference,
        development_tools,
        device_type,
        personalization_enabled,
        consent_given,
        consent_timestamp,
        profile_updated_at,
        data_retention_expires
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      userId,
      profileData.programming_experience || 'beginner',
      profileData.os_preference || 'other',
      profileData.development_tools || [],
      profileData.device_type || 'other',
      profileData.personalization_enabled ?? true,
      profileData.consent_given ?? false,
      profileData.consent_timestamp || new Date(),
      new Date(),
      profileData.data_retention_expires || new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) // 3 years from now
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // For this demo, we'll use a mock approach
    const userId = (req as any).user?.id || req.cookies?.['better-auth.session_token']?.split('.')[0] || null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData = req.body;

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== 'user_id') {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    // Add updated_at timestamp
    updateFields.push(`profile_updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    // Add user_id to the end
    values.push(userId);

    const query = `
      UPDATE user_profiles
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /preferences - Update personalization preferences
router.put('/preferences', async (req, res) => {
  try {
    // Extract user ID from session/auth context
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // For this demo, we'll use a mock approach
    const userId = (req as any).user?.id || req.cookies?.['better-auth.session_token']?.split('.')[0] || null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { personalization_enabled } = req.body;

    if (typeof personalization_enabled !== 'boolean') {
      return res.status(400).json({ error: 'personalization_enabled must be a boolean' });
    }

    const query = `
      UPDATE user_profiles
      SET personalization_enabled = $1, profile_updated_at = $2
      WHERE user_id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [personalization_enabled, new Date(), userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;