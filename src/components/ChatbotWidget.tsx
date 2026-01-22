import React, { useState, useEffect, useRef } from 'react';

interface ChatbotWidgetProps {
  apiUrl?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ apiUrl = undefined }) => {
  // Dynamically determine the API URL based on environment
  const getApiUrl = (): string => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('github.io')) {
        // For GitHub Pages, use your Hugging Face Space backend
        return 'https://your-username-space-name.hf.space/api/query';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // For local development
        return 'http://localhost:8000/api/query';
      }
    }
    // Fallback to environment variable or localhost
    return process.env.REACT_APP_API_URL || 'http://localhost:8000/api/query';
  };

  const resolvedApiUrl = apiUrl || getApiUrl();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [useSelectionOnly, setUseSelectionOnly] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add CSS animation for bounce effect
  useEffect(() => {
    const styleId = 'chatbot-bounce-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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

      if (text) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setTooltipPosition({ x: rect.right - 30, y: rect.top - 40 });
          setShowTooltip(true);

          // Hide tooltip after 5 seconds if not clicked
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
          }
          tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
          }, 5000);
        }
      } else {
        setShowTooltip(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('mouseup', handleSelectionChange);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle tooltip click
  const handleTooltipClick = () => {
    setShowTooltip(false);
    setInputValue(selectedText);
    setIsOpen(true);
  };

  // Function to send query to backend
  const sendQuery = async (query: string) => {
    setIsLoading(true);

    try {
      const requestBody = {
        query,
        selected_text: selectedText || undefined,
        mode: useSelectionOnly ? 'strict' : 'augment',
        top_k: 5
      };

      const response = await fetch(resolvedApiUrl, {
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

  // Clear conversation
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip for selected text */}
      {showTooltip && selectedText && (
        <button
          onClick={handleTooltipClick}
          style={{
            position: 'fixed',
            zIndex: 1000,
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            border: 'none',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
          aria-label="Ask AI about selected text"
        >
          Ask AI
        </button>
      )}

      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            zIndex: 1000,
            cursor: 'pointer',
            fontSize: '24px',
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
          }}
          aria-label="Open AI Assistant"
        >
          <span style={{ fontSize: '24px' }} aria-hidden="true">🤖</span>
        </button>
      )}

      {/* Chat widget modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '100%',
            maxWidth: '480px',
            height: '70vh',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e5e7eb',
            zIndex: 999,
            overflow: 'hidden',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          {/* Header */}
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 id="chatbot-title" style={{ fontSize: '18px', fontWeight: '600' }}>AI Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Clear conversation"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '16px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>AI Assistant</h3>
                <p style={{ fontSize: '14px' }}>Ask questions about the book content!</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Select text on the page and ask questions about it.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '12px 16px',
                        borderRadius: message.role === 'user'
                          ? '20px 4px 20px 20px'
                          : '4px 20px 20px 20px',
                        backgroundColor: message.role === 'user' ? '#3b82f6' : '#ffffff',
                        color: message.role === 'user' ? 'white' : '#374151',
                        border: message.role === 'user' ? 'none' : '1px solid #e5e7eb',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      padding: '12px 16px',
                      borderRadius: '4px 20px 20px 20px',
                      maxWidth: '80%'
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0.2s'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0.4s'
                        }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '16px',
            backgroundColor: 'white'
          }}>
            {selectedText && (
              <div style={{
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                fontSize: '14px'
              }}>
                <div style={{
                  fontWeight: '500',
                  color: '#1e40af',
                  marginBottom: '4px'
                }}>Selected text:</div>
                <div style={{
                  color: '#374151'
                }}>{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}</div>
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px'
                  }}>
                    <input
                      type="checkbox"
                      checked={useSelectionOnly}
                      onChange={(e) => setUseSelectionOnly(e.target.checked)}
                      style={{
                        marginRight: '8px',
                        borderRadius: '4px',
                        width: '16px',
                        height: '16px'
                      }}
                    />
                    <span style={{ color: '#374151' }}>Use selection only</span>
                  </label>
                </div>
              </div>
            )}

            <form style={{ display: 'flex', gap: '8px' }} onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedText ? "Ask about selected text..." : "Type your message..."}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '24px',
                  padding: '12px 16px',
                  fontSize: '16px',
                }}
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
                  fontSize: '18px'
                }}
                onMouseEnter={(e) => {
                  if (!(isLoading || !inputValue.trim())) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
                aria-label="Send message"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;