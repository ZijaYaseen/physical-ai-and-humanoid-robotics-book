import React, { useState } from 'react';
import BookRAGWidget from './rag/BookRAGWidget';

// Root component that wraps the entire application
const Root = ({ children }) => {
  const [showRAGWidget, setShowRAGWidget] = useState(false);

  return (
    <>
      {children}

      {/* Floating RAG Widget Button - appears on all pages */}
      {!showRAGWidget && (
        <button
          onClick={() => setShowRAGWidget(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4169e1',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Open Book Assistant"
        >
          💬
        </button>
      )}

      {/* RAG Widget - only shown when button is clicked */}
      {showRAGWidget && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <BookRAGWidget />
          <button
            onClick={() => setShowRAGWidget(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666',
              zIndex: 1001
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default Root;