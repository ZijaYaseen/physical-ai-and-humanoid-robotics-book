/**
 * BookRAGWidget - React component for RAG chatbot integration
 */

import React, { useState, useEffect, useRef } from 'react';
import './BookRAGWidget.css';

// Simple backend URL - direct connection to Python backend
const BACKEND_URL = 'http://localhost:8000';

const BookRAGWidget = ({ selectedText: propSelectedText = '', sessionId: externalSessionId = null, onSessionIdChange = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [internalSessionId, setInternalSessionId] = useState(null);
  const [selectedTextState, setSelectedTextState] = useState(propSelectedText);
  const messagesEndRef = useRef(null);

  const effectiveSessionId = externalSessionId !== null ? externalSessionId : internalSessionId;

  // Load session history when component mounts
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/chatkit/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: effectiveSessionId || undefined })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.session_id && !effectiveSessionId && !externalSessionId) {
            setInternalSessionId(data.session_id);
            if (onSessionIdChange) onSessionIdChange(data.session_id);
          }
          if (data.messages && data.messages.length > 0 && messages.length === 0) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };
    loadSession();
  }, [effectiveSessionId, externalSessionId, onSessionIdChange]);

  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : '';
      if (!propSelectedText) {
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

  // Update selected text from prop
  useEffect(() => {
    if (propSelectedText) {
      setSelectedTextState(propSelectedText);
      const query = `Explain this: "${propSelectedText.substring(0, 200)}${propSelectedText.length > 200 ? '...' : ''}"`;
      setInputValue(query);
    }
  }, [propSelectedText]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send query to backend
  const sendQuery = async (query) => {
    setIsLoading(true);
    try {
      const requestBody = {
        query,
        selected_text: selectedTextState || undefined,
        mode: 'augment',
        session_id: effectiveSessionId || undefined,
        top_k: 5
      };

      const response = await fetch(`${BACKEND_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.session_id && !effectiveSessionId && !externalSessionId) {
        setInternalSessionId(data.session_id);
        if (onSessionIdChange) onSessionIdChange(data.session_id);
      }

      const assistantMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        retrievedChunks: data.retrieved,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending query:', error);
      const errorMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Error: ${error.message}. Backend: ${BACKEND_URL}`,
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
      const userMessage = {
        id: Date.now().toString() + '-user',
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
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
        <button className="clear-btn" onClick={handleClear} title="Clear conversation">
          <span className="clear-icon">🗑️</span>
        </button>
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
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-header">
                <div className={`message-icon ${message.role}`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-info">
                  <span className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
                  <span className="message-time">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="message-content">{message.content}</div>
              {message.retrievedChunks && message.retrievedChunks.length > 0 && (
                <div className="retrieved-sources">
                  <details className="sources-details">
                    <summary><span className="sources-summary">Sources ({message.retrievedChunks.length})</span></summary>
                    <div className="sources-content">
                      <ul className="sources-list">
                        {message.retrievedChunks.map((chunk) => (
                          <li key={chunk.chunk_id} className="source-item">
                            <div className="source-content">
                              <a href={chunk.source_path} target="_blank" rel="noopener noreferrer" className="source-link">
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
              <div className="message-info"><span className="message-role">Assistant</span></div>
            </div>
            <div className="message-content">
              <div className="typing-indicator"><span></span><span></span><span></span></div>
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
        <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-btn">
          <span className="send-icon">➤</span>
        </button>
      </form>
    </div>
  );
};

export default BookRAGWidget;
