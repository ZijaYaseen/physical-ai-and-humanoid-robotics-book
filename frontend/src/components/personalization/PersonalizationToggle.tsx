import React, { useState, useEffect } from 'react';

interface PersonalizationToggleProps {
  initialValue?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
}

const PersonalizationToggle: React.FC<PersonalizationToggleProps> = ({
  initialValue = true,
  onChange,
  className = ''
}) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  useEffect(() => {
    setIsEnabled(initialValue);
  }, [initialValue]);

  const toggle = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    // Call the API to update the user's preference
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalization_enabled: newValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update personalization preferences');
      }

      // Notify parent component
      if (onChange) {
        onChange(newValue);
      }
    } catch (error) {
      console.error('Error updating personalization preferences:', error);
      // Revert the toggle if the API call failed
      setIsEnabled(!newValue);
      alert('Failed to update personalization preferences. Please try again.');
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`mr-3 text-sm font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
        {isEnabled ? 'Personalization On' : 'Personalization Off'}
      </span>
      <button
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isEnabled}
        aria-label={isEnabled ? 'Personalization enabled' : 'Personalization disabled'}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default PersonalizationToggle;