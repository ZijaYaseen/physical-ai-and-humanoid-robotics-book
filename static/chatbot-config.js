// Chatbot Backend Configuration
// This file is loaded by the browser and sets the backend URL for the chatbot

// Check if we're in production (GitHub Pages) or development
const isProduction = window.location.hostname.includes('github.io');

// Set backend URL based on environment
window.CHATBOT_BACKEND_API = isProduction 
  ? 'https://zijayaseen-rag-book-chatbot.hf.space'
  : 'http://localhost:8000';

console.log('Chatbot Backend URL:', window.CHATBOT_BACKEND_API);
