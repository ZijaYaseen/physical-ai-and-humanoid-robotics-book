/**
 * BookRAGWidget - React component for RAG chatbot integration
 *
 * Features:
 * - Captures page selection
 * - Toggle between strict/augment modes
 * - Displays responses with source citations
 * - Reuses Docusaurus theme styling
 */

import React, { useState, useEffect, useRef } from 'react';
import './BookRAGWidget.css'; // Component-specific styles

const BookRAGWidget = ({ selectedText: propSelectedText = '', onQuerySent = null, sessionId: externalSessionId = null, onSessionIdChange = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('augment'); // Only mode now (strict mode removed)
  const [internalSessionId, setInternalSessionId] = useState(null);
  const [selectedTextState, setSelectedTextState] = useState(propSelectedText);
  const messagesEndRef = useRef(null);
  const initializedRef = useRef(false);
  const querySentRef = useRef(false);

  // Use external session ID if provided, otherwise use internal one
  const effectiveSessionId = externalSessionId !== null ? externalSessionId : internalSessionId;

  // Load session history when component mounts
  useEffect(() => {
    const loadSession = async () => {
      try {
        const CHATBOT_BACKEND_API = process.env.CHATBOT_BACKEND_API || 'http://127.0.0.1:8000';
        const response = await fetch(`${CHATBOT_BACKEND_API}/chatkit/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: effectiveSessionId || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();

          // Update internal session ID if new one was created (and no external session ID is provided)
          if (data.session_id && !effectiveSessionId && !externalSessionId) {
            setInternalSessionId(data.session_id);
            if (onSessionIdChange) {
              onSessionIdChange(data.session_id);
            }
          }

          // Set messages if there's history, but only if we don't already have messages
          if (data.messages && data.messages.length > 0 && messages.length === 0) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Continue with empty session if there's an error
      }
    };

    loadSession();
  }, [effectiveSessionId, externalSessionId, onSessionIdChange]); // Include effectiveSessionId in dependencies

  // Function to get selected text from the page
  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : '';
  };

  // Handle text selection on the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const text = getSelectedText();
      // Only update selectedTextState if it's not coming from the prop
      if (!propSelectedText && !initializedRef.current) {
        setSelectedTextState(text);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [propSelectedText]);

  // Update selectedTextState when propSelectedText changes and populate input field
  useEffect(() => {
    if (propSelectedText) {
      setSelectedTextState(propSelectedText);
      // Populate the input field with a query about the selected text
      const query = `Explain this: "${propSelectedText.substring(0, 200)}${propSelectedText.length > 200 ? '...' : ''}"`;
      setInputValue(query);

      // Don't automatically submit, just populate the input field
      // The user can manually submit if they want
    }
  }, [propSelectedText]); // Only depend on propSelectedText to ensure it runs when prop changes

  // Expose a global function to open chat with text
  useEffect(() => {
    const openChatWithText = (text) => {
      setSelectedTextState(text);
      const query = `Explain this: "${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"`;
      setInputValue(query);
      // Just populate the input field, don't auto-submit
    };

    // Make this function available globally
    window.openChatWithText = openChatWithText;

    return () => {
      // Clean up the global function
      delete window.openChatWithText;
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send query to backend
  const sendQuery = async (query, skipUserMessage = false) => {
    setIsLoading(true);

    try {
      const requestBody = {
        query,
        selected_text: selectedTextState || undefined,
        mode: 'augment', // Always use augment mode (strict mode removed)
        session_id: effectiveSessionId || undefined,
        top_k: 5
      };

      const response = await fetch(`${CHATBOT_BACKEND_API}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update session ID if new session was created (and no external session ID is provided)
      if (data.session_id && !effectiveSessionId && !externalSessionId) {
        setInternalSessionId(data.session_id);
        if (onSessionIdChange) {
          onSessionIdChange(data.session_id);
        }
      }

      // Add assistant message
      const assistantMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        retrievedChunks: data.retrieved,
      };

      if (skipUserMessage) {
        // For automatic queries from useEffect, add only assistant message
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // For user-initiated queries, add both user and assistant messages
        const userMessage = {
          id: Date.now().toString() + '-user',
          role: 'user',
          content: query,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending query:', error);

      // Add error message
      const errorMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendQuery(inputValue);
      setInputValue('');
    }
  };


  // Clear conversation
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="book-rag-widget">
      <div className="rag-header">
        <div className="rag-title-section">
          <div className="rag-icon">🤖</div>
          <h3>Book Assistant</h3>
        </div>
        <div className="rag-controls">
          <button
            className="clear-btn"
            onClick={handleClear}
            title="Clear conversation"
          >
            <span className="clear-icon">🗑️</span>
          </button>
        </div>
      </div>

      <div className="rag-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">📚</div>
            <h4>Ask questions about the book content!</h4>
            <p>Select text on the page and ask questions about it.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role}`}
            >
              <div className="message-header">
                <div className={`message-icon ${message.role}`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-info">
                  <span className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
                  <span className="message-time">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="message-content">
                {message.content}
              </div>

              {message.retrievedChunks && message.retrievedChunks.length > 0 && (
                <div className="retrieved-sources">
                  <details className="sources-details">
                    <summary>
                      <span className="sources-summary">Sources ({message.retrievedChunks.length})</span>
                    </summary>
                    <div className="sources-content">
                      <ul className="sources-list">
                        {message.retrievedChunks.map((chunk, index) => (
                          <li key={chunk.chunk_id} className="source-item">
                            <div className="source-content">
                              <a
                                href={chunk.source_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                              >
                                <span className="source-title">{chunk.page_title || chunk.source_path}</span>
                              </a>
                              <div className="source-info">
                                <span className="chunk-id">ID: {chunk.chunk_id}</span>
                                <span className="source-score">Score: {Math.round(chunk.score * 100)}%</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-header">
              <div className="message-icon assistant">🤖</div>
              <div className="message-info">
                <span className="message-role">Assistant</span>
              </div>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="rag-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask about the book... ${selectedTextState ? '(using selected text)' : ''}`}
          disabled={isLoading}
          className="rag-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="send-btn"
        >
          <span className="send-icon">➤</span>
        </button>
      </form>
    </div>
  );
};

export default BookRAGWidget;