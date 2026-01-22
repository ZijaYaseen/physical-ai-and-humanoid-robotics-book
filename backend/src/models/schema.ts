import { pgTable, uuid, varchar, boolean, text, timestamp } from 'drizzle-orm/pg-core';

// User Profiles table (references Better Auth's user table indirectly)
export const userProfiles = pgTable('user_profiles', {
  user_id: uuid('user_id').primaryKey().notNull(),
  programming_experience: varchar('programming_experience', { length: 20 }).$type<'beginner' | 'intermediate' | 'advanced'>(),
  os_preference: varchar('os_preference', { length: 20 }).$type<'windows' | 'macos' | 'linux' | 'other'>(),
  development_tools: text('development_tools').array(),
  device_type: varchar('device_type', { length: 20 }).$type<'desktop' | 'laptop' | 'tablet' | 'other'>(),
  personalization_enabled: boolean('personalization_enabled').default(true),
  consent_given: boolean('consent_given').default(false),
  consent_timestamp: timestamp('consent_timestamp', { withTimezone: true }),
  profile_updated_at: timestamp('profile_updated_at', { withTimezone: true }).defaultNow(),
  data_retention_expires: timestamp('data_retention_expires', { withTimezone: true }),
});

// Personalization Context table
export const userPersonalizationContext = pgTable('user_personalization_context', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  last_course_module_visited: varchar('last_course_module_visited', { length: 100 }),
  preferred_content_format: varchar('preferred_content_format', { length: 20 }).$type<'text' | 'video' | 'interactive' | 'audio'>().default('text'),
  difficulty_override: varchar('difficulty_override', { length: 20 }).$type<'beginner' | 'intermediate' | 'advanced'>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});