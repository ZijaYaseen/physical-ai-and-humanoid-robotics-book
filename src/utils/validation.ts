// Validation utilities for authentication flows

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProfileData = (profileData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (profileData.programming_experience && !['beginner', 'intermediate', 'advanced'].includes(profileData.programming_experience)) {
    errors.push('Programming experience must be one of: beginner, intermediate, advanced');
  }

  if (profileData.os_preference && !['windows', 'macos', 'linux', 'other'].includes(profileData.os_preference)) {
    errors.push('OS preference must be one of: windows, macos, linux, other');
  }

  if (profileData.device_type && !['desktop', 'laptop', 'tablet', 'other'].includes(profileData.device_type)) {
    errors.push('Device type must be one of: desktop, laptop, tablet, other');
  }

  if (profileData.development_tools && !Array.isArray(profileData.development_tools)) {
    errors.push('Development tools must be an array of strings');
  }

  if (profileData.personalization_enabled !== undefined && typeof profileData.personalization_enabled !== 'boolean') {
    errors.push('Personalization enabled must be a boolean');
  }

  if (profileData.consent_given !== undefined && typeof profileData.consent_given !== 'boolean') {
    errors.push('Consent given must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};