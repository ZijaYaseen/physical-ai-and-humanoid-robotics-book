/**
 * BookRAGWidget - React component for RAG chatbot integration
 *
 * Features:
 * - Captures page selection
 * - Toggle between strict/augment modes
 * - Displays responses with source citations
 * - Reuses Docusaurus theme styling
 * - Fully responsive design
 * - Enhanced UI with modern aesthetics
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

interface BookRAGWidgetProps {
  selectedText?: string;
}

const BookRAGWidget: React.FC<BookRAGWidgetProps> = ({ selectedText: propSelectedText = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'strict' | 'augment'>('augment');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedTextState, setSelectedTextState] = useState<string>(propSelectedText);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Function to get selected text from the page
  const getSelectedText = (): string => {
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

  // Update selectedTextState when propSelectedText changes and populate input
  useEffect(() => {
    if (propSelectedText && !initializedRef.current) {
      setSelectedTextState(propSelectedText);
      // Populate the input field with a query about the selected text
      setInputValue(`Explain this: "${propSelectedText.substring(0, 200)}${propSelectedText.length > 200 ? '...' : ''}"`);
      initializedRef.current = true;
    }
  }, [propSelectedText]);

  // Expose a global function to open chat with text
  useEffect(() => {
    const openChatWithText = (text: string) => {
      setSelectedTextState(text);
      setInputValue(`Explain this: "${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"`);
    };

    // Make this function available globally
    (window as any).openChatWithText = openChatWithText;

    return () => {
      // Clean up the global function
      delete (window as any).openChatWithText;
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
        selected_text: selectedTextState || undefined,
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

  // Handle input focus to expand widget on mobile
  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  // Handle input blur to collapse widget on mobile
  const handleInputBlur = () => {
    setTimeout(() => setIsExpanded(false), 200); // Delay to allow clicking send button
  };

  return (
    <div className={`book-rag-widget ${isExpanded ? 'expanded' : ''}`}>
      <div className="rag-header">
        <div className="rag-title-section">
          <div className="rag-icon">🤖</div>
          <h3>Book Assistant</h3>
        </div>
        <div className="rag-controls">
          <div className="mode-selector">
            <button
              className={`mode-btn ${selectedMode === 'strict' ? 'active' : ''}`}
              onClick={() => handleModeChange('strict')}
              title="Strict mode: Answer only from selected text"
              aria-label="Strict mode"
            >
              Strict
            </button>
            <button
              className={`mode-btn ${selectedMode === 'augment' ? 'active' : ''}`}
              onClick={() => handleModeChange('augment')}
              title="Augment mode: Use full document context"
              aria-label="Augment mode"
            >
              Augment
            </button>
          </div>
          <button
            className="clear-btn"
            onClick={handleClear}
            title="Clear conversation"
            aria-label="Clear conversation"
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
              role="article"
              aria-label={`${message.role} message`}
            >
              <div className="message-header">
                <div className={`message-icon ${message.role}`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-info">
                  <span className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
                  <span className="message-time" aria-label={`Sent at ${message.timestamp.toLocaleTimeString()}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
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
                                aria-label={`Source: ${chunk.page_title || chunk.source_path}`}
                              >
                                <span className="source-title">{chunk.page_title || chunk.source_path}</span>
                              </a>
                              <div className="source-info">
                                <span className="chunk-id" aria-label={`Chunk ID: ${chunk.chunk_id}`}>ID: {chunk.chunk_id}</span>
                                <span className="source-score" aria-label={`Relevance score: ${Math.round(chunk.score * 100)}%`}>Score: {Math.round(chunk.score * 100)}%</span>
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
          <div className="message assistant" role="article" aria-label="Assistant typing">
            <div className="message-header">
              <div className="message-icon assistant">🤖</div>
              <div className="message-info">
                <span className="message-role">Assistant</span>
              </div>
            </div>
            <div className="message-content">
              <div className="typing-indicator" aria-label="Assistant is typing">
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={`Ask about the book... ${selectedTextState ? '(using selected text)' : ''}`}
          disabled={isLoading}
          className="rag-input"
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="send-btn"
          aria-label="Send message"
        >
          <span className="send-icon">➤</span>
        </button>
      </form>
    </div>
  );
};

export default BookRAGWidget;