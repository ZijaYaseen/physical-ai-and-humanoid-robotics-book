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

interface RetrievedChunk {
  source_path: string;
  chunk_id: string;
  text: string;
  score: number;
  page_title: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  retrievedChunks?: RetrievedChunk[];
}

interface QueryRequest {
  query: string;
  selected_text?: string;
  mode: 'strict' | 'augment';
  session_id?: string;
  top_k?: number;
}

interface QueryResponse {
  answer: string;
  retrieved: RetrievedChunk[];
  session_id: string;
  mode: string;
}

const BookRAGWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'strict' | 'augment'>('augment');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to get selected text from the page
  const getSelectedText = (): string => {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : '';
  };

  // Handle text selection on the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const text = getSelectedText();
      setSelectedText(text);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send query to backend
  const sendQuery = async (query: string) => {
    setIsLoading(true);

    try {
      const requestBody: QueryRequest = {
        query,
        selected_text: selectedText || undefined,
        mode: selectedMode,
        session_id: sessionId || undefined,
        top_k: 5
      };

      const response = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QueryResponse = await response.json();

      // Update session ID if new session was created
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString() + '-user',
        role: 'user',
        content: query,
        timestamp: new Date(),
      };

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        retrievedChunks: data.retrieved,
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error sending query:', error);

      // Add error message
      const errorMessage: Message = {
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString() + '-user-input',
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      sendQuery(inputValue);
      setInputValue('');
    }
  };

  // Handle mode change
  const handleModeChange = (mode: 'strict' | 'augment') => {
    setSelectedMode(mode);
  };

  // Clear conversation
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="book-rag-widget">
      <div className="rag-header">
        <h3>Book Assistant</h3>
        <div className="rag-controls">
          <div className="mode-selector">
            <button
              className={`mode-btn ${selectedMode === 'strict' ? 'active' : ''}`}
              onClick={() => handleModeChange('strict')}
              title="Strict mode: Answer only from selected text"
            >
              Strict
            </button>
            <button
              className={`mode-btn ${selectedMode === 'augment' ? 'active' : ''}`}
              onClick={() => handleModeChange('augment')}
              title="Augment mode: Use full document context"
            >
              Augment
            </button>
          </div>
          <button
            className="clear-btn"
            onClick={handleClear}
            title="Clear conversation"
          >
            Clear
          </button>
        </div>
      </div>

      {selectedText && (
        <div className="selected-text-preview">
          <strong>Selected text:</strong> "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
        </div>
      )}

      <div className="rag-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Ask questions about the book content!</p>
            <p>Select text on the page and ask questions about it.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role}`}
            >
              <div className="message-content">
                {message.content}
              </div>

              {message.retrievedChunks && message.retrievedChunks.length > 0 && (
                <div className="retrieved-sources">
                  <details>
                    <summary>Sources ({message.retrievedChunks.length})</summary>
                    <ul>
                      {message.retrievedChunks.map((chunk, index) => (
                        <li key={chunk.chunk_id} className="source-item">
                          <a
                            href={chunk.source_path}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {chunk.page_title || chunk.source_path}
                          </a>
                          <span className="chunk-id">ID: {chunk.chunk_id}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
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
          placeholder={`Ask about the book... ${selectedText ? '(using selected text)' : ''}`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default BookRAGWidget;