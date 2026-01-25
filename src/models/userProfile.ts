// User Profile Model Interface
export interface UserProfile {
  user_id: string; // UUID
  programming_experience: 'beginner' | 'intermediate' | 'advanced';
  os_preference: 'windows' | 'macos' | 'linux' | 'other';
  development_tools: string[];
  device_type: 'desktop' | 'laptop' | 'tablet' | 'other';
  personalization_enabled: boolean;
  consent_given: boolean;
  consent_timestamp?: Date;
  profile_updated_at: Date;
  data_retention_expires?: Date;
}

// Personalization Context Model Interface
export interface PersonalizationContext {
  id: string; // UUID
  user_id: string; // UUID (references user_profiles.user_id)
  last_course_module_visited?: string;
  preferred_content_format: 'text' | 'video' | 'interactive' | 'audio';
  difficulty_override?: 'beginner' | 'intermediate' | 'advanced';
  created_at: Date;
  updated_at: Date;
}

// Profile Update DTO
export interface ProfileUpdateDTO {
  programming_experience?: 'beginner' | 'intermediate' | 'advanced';
  os_preference?: 'windows' | 'macos' | 'linux' | 'other';
  development_tools?: string[];
  device_type?: 'desktop' | 'laptop' | 'tablet' | 'other';
  personalization_enabled?: boolean;
  consent_given?: boolean;
}

// Personalization Context Update DTO
export interface PersonalizationContextUpdateDTO {
  last_course_module_visited?: string;
  preferred_content_format?: 'text' | 'video' | 'interactive' | 'audio';
  difficulty_override?: 'beginner' | 'intermediate' | 'advanced';
}