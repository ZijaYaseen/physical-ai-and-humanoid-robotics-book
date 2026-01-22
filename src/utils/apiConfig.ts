/**
 * API Configuration for Dynamic Backend URL
 * This allows the frontend to work both in development and production
 */

// Determine the backend API URL based on environment
const getApiBaseUrl = (): string => {
  // In production (GitHub Pages), use environment variable or default to current domain
  if (typeof window !== 'undefined') {
    // Check if we're in a production environment
    const currentHost = window.location.hostname;

    // For local development, use localhost
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:8000';
    }

    // For GitHub Pages, construct the backend URL
    // You can set this via environment variable or use a default
    const githubPagesDomain = process.env.REACT_APP_GITHUB_PAGES_DOMAIN || 'https://zijayaseen.github.io';
    const backendDomain = process.env.REACT_APP_BACKEND_URL ||
                         `https://${process.env.RENDER_SERVICE_NAME || 'your-render-service-name'}.onrender.com`;

    // If we're on GitHub Pages, use the Render backend
    if (currentHost.includes('github.io')) {
      return backendDomain;
    }

    // Default fallback
    return backendDomain;
  }

  // Server-side fallback
  return process.env.BACKEND_URL || 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  RAG_ENDPOINT: `${getApiBaseUrl()}/api/query`,
  SESSION_ENDPOINT: `${getApiBaseUrl()}/api/chatkit/session`,
  HEALTH_ENDPOINT: `${getApiBaseUrl()}/api/health`,

  // Timeout configurations
  TIMEOUT: 30000, // 30 seconds

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Utility function to get the correct API URL
export const getApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }
  return `${API_CONFIG.BASE_URL}/${endpoint}`;
};

export default API_CONFIG;