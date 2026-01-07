import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import BookRAGWidget from '../components/rag/BookRAGWidget';
import SelectionAskButton from '../components/SelectionAskButton';

export default function Root({children}) {
  const [showRAGWidget, setShowRAGWidget] = useState(false);
  const [selectedTextForQuery, setSelectedTextForQuery] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Listen for the custom event from SelectionAskButton
  useEffect(() => {
    const handleOpenChatWithSelectedText = (event) => {
      const selectedText = event.detail.text;
      if (selectedText) {
        // Open the chat widget if it's not already open
        setShowRAGWidget(true);
        // Set the selected text to be used by the BookRAGWidget
        setSelectedTextForQuery(selectedText);
      }
    };

    window.addEventListener('openChatWithSelectedText', handleOpenChatWithSelectedText);

    return () => {
      window.removeEventListener('openChatWithSelectedText', handleOpenChatWithSelectedText);
    };
  }, []);

  return (
    <>
      {children}

      {/* Floating RAG Widget Button - appears on all pages */}
      {!showRAGWidget && (
        <BrowserOnly fallback={<div />}>
          {() => (
            <button
              onClick={() => setShowRAGWidget(true)}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '64px',
                height: '64px',
                backgroundColor: '#4169E1', // Royal blue to match theme
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
              }}
              title="Open Book Assistant"
            >
              <span style={{ fontSize: '24px' }}>🤖</span>
            </button>
          )}
        </BrowserOnly>
      )}

      {/* RAG Widget - only shown when button is clicked */}
      {showRAGWidget && (
        <BrowserOnly fallback={<div />}>
          {() => (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '480px',
              zIndex: 999,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
            }}>
              <BookRAGWidget
                selectedText={selectedTextForQuery}
                onQuerySent={() => setSelectedTextForQuery('')}
                sessionId={currentSessionId}
                onSessionIdChange={(id) => setCurrentSessionId(id)}
              />
              <button
                onClick={() => setShowRAGWidget(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#666',
                  zIndex: 1001,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                title="Close"
              >
                ×
              </button>
            </div>
          )}
        </BrowserOnly>
      )}

      {/* Text Selection Tooltip - appears when text is selected */}
      <BrowserOnly fallback={<div />}>
        {() => (
          <SelectionAskButton />
        )}
      </BrowserOnly>
    </>
  );
}