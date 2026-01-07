import React, { useState, useEffect, useRef } from 'react';

const SelectionAskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleSelection = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use a small debounce to avoid jitter
      timeoutRef.current = setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        // Check if selection is substantial (more than 2 characters and not just whitespace)
        if (text.length > 2 && /\S/.test(text)) {
          // Don't show on code blocks or contenteditable elements
          const anchorNode = selection.anchorNode;
          const parentNode = anchorNode?.parentNode;

          const isInCodeBlock = parentNode?.closest('code, pre, .codeBlockContainer, .codeBlockContent, .docusaurus-highlight-code-line');
          const isInEditable = parentNode?.closest('[contenteditable="true"], textarea, input');

          if (!isInCodeBlock && !isInEditable) {
            // Limit selection length
            const limitedText = text.length > 2000 ? text.substring(0, 2000) : text;

            if (limitedText.length > 2) {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();

              // Position tooltip above the selected text with some offset
              // Check if there's enough space above, otherwise put it below
              const tooltipHeight = 40;
              const yPos = rect.top > tooltipHeight ? rect.top - 40 : rect.bottom + 10;

              setPosition({
                x: rect.left + rect.width / 2,
                y: yPos
              });

              setSelectedText(limitedText);
              setIsVisible(true);
            }
          }
        } else {
          setIsVisible(false);
        }
      }, 50); // Debounce by 50ms
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 10); // Small delay to ensure selection is complete
    };

    const handleKeyUp = () => {
      setTimeout(handleSelection, 10); // Small delay to ensure selection is complete
    };

    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    // Add event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClickOutside);

    // Also listen for selectionchange for better coverage
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  const handleAskAI = () => {
    if (selectedText) {
      // Try to call the global function to open chat with the selected text
      if (window.openChatWithText && typeof window.openChatWithText === 'function') {
        window.openChatWithText(selectedText);
      } else {
        // Dispatch a custom event that the Root component can listen to
        window.dispatchEvent(new CustomEvent('openChatWithSelectedText', { detail: { text: selectedText } }));
      }
      setIsVisible(false);
    }
  };

  // Don't render anything if not visible
  if (!isVisible || !selectedText) {
    return null;
  }

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: 'linear-gradient(135deg, #4169E1, #6495ED)', // Professional gradient
        color: 'white',
        padding: '10px 16px',
        borderRadius: '24px', // Pill shape for modern look
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 6px 20px rgba(65, 105, 225, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)', // Enhanced shadow
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        backdropFilter: 'blur(10px)', // Modern glass effect
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onClick={handleAskAI}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(65, 105, 225, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(65, 105, 225, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)';
      }}
    >
      <span style={{ fontSize: '16px' }}>🤖</span>
      <span>Ask AI</span>
    </div>
  );
};

export default SelectionAskButton;