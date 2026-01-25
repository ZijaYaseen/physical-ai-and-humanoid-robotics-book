import { Pool } from 'pg'; // Using pg for PostgreSQL/Neon
import {
  UserProfile,
  PersonalizationContext,
  ProfileUpdateDTO,
  PersonalizationContextUpdateDTO
} from '../models/userProfile';

class UserProfileService {
  private pool: Pool;

  constructor() {
    // Initialize database connection pool
    this.pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });
  }

  /**
   * Creates a new user profile
   */
  async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

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

      const result = await client.query(query, values);
      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Gets a user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const client = await this.pool.connect();

    try {
      const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
      const result = await client.query(query, [userId]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  /**
   * Updates a user profile
   */
  async updateUserProfile(userId: string, updateData: ProfileUpdateDTO): Promise<UserProfile> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [userId];
      let paramIndex = 2;

      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      // Add updated_at timestamp
      updateFields.push(`profile_updated_at = $${paramIndex}`);
      values.push(new Date());

      const query = `
        UPDATE user_profiles
        SET ${updateFields.join(', ')}
        WHERE user_id = $1
        RETURNING *
      `;

      const result = await client.query(query, values);
      await client.query('COMMIT');

      if (result.rows.length === 0) {
        throw new Error('User profile not found');
      }

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Deletes a user profile and associated data
   */
  async deleteUserProfile(userId: string): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Delete personalization context first (due to foreign key constraint)
      await client.query(
        'DELETE FROM user_personalization_context WHERE user_id = $1',
        [userId]
      );

      // Delete user profile
      const result = await client.query(
        'DELETE FROM user_profiles WHERE user_id = $1 RETURNING user_id',
        [userId]
      );

      await client.query('COMMIT');

      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Creates or updates personalization context for a user
   */
  async createOrUpdatePersonalizationContext(
    userId: string,
    contextData: Partial<PersonalizationContext>
  ): Promise<PersonalizationContext> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Check if context already exists
      const existingQuery = 'SELECT id FROM user_personalization_context WHERE user_id = $1';
      const existingResult = await client.query(existingQuery, [userId]);

      let result;

      if (existingResult.rows.length > 0) {
        // Update existing context
        const updateFields: string[] = [];
        const values: any[] = [userId];
        let paramIndex = 2;

        for (const [key, value] of Object.entries(contextData)) {
          if (value !== undefined) {
            updateFields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
          }
        }

        // Add updated_at timestamp
        updateFields.push(`updated_at = $${paramIndex}`);
        values.push(new Date());

        const query = `
          UPDATE user_personalization_context
          SET ${updateFields.join(', ')}
          WHERE user_id = $1
          RETURNING *
        `;

        result = await client.query(query, values);
      } else {
        // Create new context
        const query = `
          INSERT INTO user_personalization_context (
            user_id,
            last_course_module_visited,
            preferred_content_format,
            difficulty_override,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

        const values = [
          userId,
          contextData.last_course_module_visited,
          contextData.preferred_content_format || 'text',
          contextData.difficulty_override,
          new Date(),
          new Date()
        ];

        result = await client.query(query, values);
      }

      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Gets personalization context for a user
   */
  async getPersonalizationContext(userId: string): Promise<PersonalizationContext | null> {
    const client = await this.pool.connect();

    try {
      const query = 'SELECT * FROM user_personalization_context WHERE user_id = $1';
      const result = await client.query(query, [userId]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  /**
   * Updates personalization context for a user
   */
  async updatePersonalizationContext(
    userId: string,
    updateData: PersonalizationContextUpdateDTO
  ): Promise<PersonalizationContext> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [userId];
      let paramIndex = 2;

      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      // Add updated_at timestamp
      updateFields.push(`updated_at = $${paramIndex}`);
      values.push(new Date());

      const query = `
        UPDATE user_personalization_context
        SET ${updateFields.join(', ')}
        WHERE user_id = $1
        RETURNING *
      `;

      const result = await client.query(query, values);
      await client.query('COMMIT');

      if (result.rows.length === 0) {
        throw new Error('Personalization context not found');
      }

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Implements data retention policy enforcement
   */
  async enforceDataRetentionPolicy(): Promise<number> {
    const client = await this.pool.connect();

    try {
      // Delete profiles where retention period has expired
      const query = `
        DELETE FROM user_profiles
        WHERE data_retention_expires IS NOT NULL
        AND data_retention_expires < NOW()
      `;

      const result = await client.query(query);
      return result.rowCount || 0;
    } finally {
      client.release();
    }
  }
}

export default new UserProfileService();