# Chatbot Integration Notes

## Overview
The global "select text → Ask AI" functionality has been implemented across the Docusaurus site. The system consists of:

1. **Global Chat Widget** (`src/components/rag/BookRAGWidget.tsx`) - The main chat interface
2. **Selection Detection** (`src/components/SelectionAskButton.jsx`) - Detects text selection and shows "Ask AI" button
3. **Theme Integration** (`src/theme/Root.jsx`) - Makes components available on all pages

## How It Works

### Text Selection → Ask AI Flow
1. User selects text anywhere on the page (excluding code blocks and inputs)
2. If selection is >2 characters and not whitespace, a floating "Ask AI" button appears
3. When clicked, the selected text is passed to the chat widget
4. The chat widget opens (if not already open) and pre-fills the input field

### Global Access
- The `window.openChatWithText(text)` function is available globally
- Can be called programmatically to open chat with specific text
- Components are loaded via `src/theme/Root.jsx` using `BrowserOnly`

## Files Created/Modified
- `src/theme/Root.jsx` - Theme override for global components
- `src/components/SelectionAskButton.jsx` - Text selection detection and button
- `src/components/rag/BookRAGWidget.tsx` - Updated to support programmatic text input
- `DEVNOTES/ADD_CHATBOT.md` - This file

## Backend Integration
The chat widget connects to the backend API at `http://127.0.0.1:8000/api/query`
- Ensure the backend service is running for full functionality
- The API accepts `query`, `selected_text`, and `mode` parameters

## Styling
- Floating button uses royal blue (#4169E1) to match the site theme
- Proper z-index to appear above all content
- Responsive positioning for different screen sizes
- Smooth hover animations and transitions

## Limitations
- Selection length is limited to 2000 characters
- Button won't appear in code blocks or editable fields
- Requires client-side JavaScript to function
- Backend API must be running separately