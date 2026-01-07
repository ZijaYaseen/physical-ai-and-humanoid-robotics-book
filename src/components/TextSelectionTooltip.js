import React, { useState, useEffect, useRef } from 'react';

const TextSelectionTooltip = ({ onAskAI }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position tooltip above the selected text
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });

        setSelectedText(text);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 0); // Delay to ensure selection is complete
    };

    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAskAI = () => {
    if (selectedText) {
      onAskAI(selectedText);
      setIsVisible(false);
    }
  };

  if (!isVisible || !selectedText) {
    return null;
  }

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: '#4169E1', // Royal blue to match theme
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
      onClick={handleAskAI}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#3658c0';
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#4169E1';
        e.currentTarget.style.transform = 'translateX(-50%)';
      }}
    >
      Ask AI
    </div>
  );
};

export default TextSelectionTooltip;