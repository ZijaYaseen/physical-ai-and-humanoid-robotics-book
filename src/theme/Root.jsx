import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import BookRAGWidget from '../components/rag/BookRAGWidget';
import SelectionAskButton from '../components/SelectionAskButton';
import AuthWrapper from '../components/AuthWrapper';

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
    <AuthWrapper>
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
              width: 'min(480px, calc(100vw - 30px))', // Responsive width that scales down on small screens
              height: 'min(80vh, 600px)', // Responsive height based on viewport height
              maxHeight: 'calc(100vh - 100px)', // Maximum safe area to prevent header cut-off
              minHeight: '500px', // Minimum height for usability
              zIndex: 999,
              overflow: 'hidden',
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
                  color: '#333',
                  zIndex: 1001,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
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

      {/* Add global styles for enhanced UI */}
      <BrowserOnly fallback={<div />}>
        {() => (
          <style jsx>{`
            @keyframes float {
              0% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-6px);
              }
              100% {
                transform: translateY(0px);
              }
            }

            /* Advanced responsive design for all screen sizes */
            @media (max-width: 1024px) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                width: min(460px, calc(100vw - 25px)) !important;
                height: min(65vh, 580px) !important;
                bottom: 20px !important;
                right: 20px !important;
              }
            }

            @media (max-width: 768px) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                width: min(440px, calc(100vw - 20px)) !important;
                height: min(60vh, 520px) !important;
                maxHeight: calc(100vh - 110px) !important; /* Increased safe area for tablets */
                bottom: 18px !important;
                right: 18px !important;
              }

              button[style*="position: fixed"][style*="bottom: 24px"] {
                bottom: 18px !important;
                right: 18px !important;
              }
            }

            @media (max-width: 640px) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                width: calc(100vw - 16px) !important;
                height: min(55vh, 480px) !important;
                maxHeight: calc(100vh - 120px) !important; /* Increased safe area for small tablets */
                bottom: 16px !important;
                right: 16px !important;
              }
            }

            @media (max-width: 480px) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                width: calc(100vw - 14px) !important;
                height: min(50vh, 420px) !important;
                maxHeight: calc(100vh - 130px) !important; /* Increased safe area for phones */
                bottom: 12px !important;
                right: 12px !important;
              }

              button[style*="position: fixed"][style*="bottom: 24px"] {
                bottom: 12px !important;
                right: 12px !important;
              }
            }

            @media (max-width: 400px) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                width: calc(100vw - 12px) !important;
                height: min(48vh, 380px) !important;
                maxHeight: calc(100vh - 120px) !important; /* Optimized safe area for very small screens */
                bottom: 10px !important;
                right: 10px !important;
              }
            }

            /* Landscape orientation adjustments */
            @media (max-height: 600px) and (orientation: landscape) {
              div[style*="position: fixed"][style*="bottom: 24px"] {
                height: min(50vh, 400px) !important;
                maxHeight: calc(100vh - 90px) !important;
              }
            }
          `}</style>
        )}
      </BrowserOnly>
    </AuthWrapper>
  );
}