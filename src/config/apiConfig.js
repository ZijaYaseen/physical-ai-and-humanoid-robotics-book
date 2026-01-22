/**
 * API Configuration for Dynamic Backend URL
 * This allows the frontend to work both in development and production
 */

// Determine the backend API URL based on environment
const getBackendBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Check for environment variables first
    const envBackendUrl = process.env.REACT_APP_BACKEND_URL;
    if (envBackendUrl) {
      return envBackendUrl;
    }

    // For GitHub Pages deployment
    if (hostname.includes('github.io')) {
      // Replace with your actual Hugging Face Space backend URL
      return 'https://your-username-space-name.hf.space';
    }

    // For local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }

    // Default fallback
    return 'http://localhost:8000';
  }

  // Server-side or build time fallback
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
};

const BACKEND_BASE_URL = getBackendBaseUrl();

// Export all API endpoints
export const API_ENDPOINTS = {
  // RAG endpoints
  RAG_QUERY: `${BACKEND_BASE_URL}/api/query`,
  RAG_SESSION: `${BACKEND_BASE_URL}/api/chatkit/session`,

  // Auth endpoints
  AUTH_SESSION: `${BACKEND_BASE_URL}/api/auth/session`,
  AUTH_SIGNIN: `${BACKEND_BASE_URL}/api/auth/sign-in`,
  AUTH_SIGNUP: `${BACKEND_BASE_URL}/api/auth/sign-up`,
  AUTH_SIGNOUT: `${BACKEND_BASE_URL}/api/auth/sign-out`,
  AUTH_GOOGLE_OAUTH: `${BACKEND_BASE_URL}/api/auth/oauth2/google`,
  AUTH_GITHUB_OAUTH: `${BACKEND_BASE_URL}/api/auth/oauth2/github`,
  AUTH_FORGOT_PASSWORD: `${BACKEND_BASE_URL}/api/auth/forgot-password`,

  // Profile endpoints
  PROFILE_BASE: `${BACKEND_BASE_URL}/api/profile`,

  // Health check
  HEALTH: `${BACKEND_BASE_URL}/api/health`,
  ROOT_HEALTH: `${BACKEND_BASE_URL}/health`
};

export const BACKEND_CONFIG = {
  BASE_URL: BACKEND_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export default API_ENDPOINTS;