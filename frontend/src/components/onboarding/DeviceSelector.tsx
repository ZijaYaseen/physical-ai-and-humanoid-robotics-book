import React from 'react';

interface DeviceSelectorProps {
  value: 'desktop' | 'laptop' | 'tablet' | 'other';
  onChange: (value: 'desktop' | 'laptop' | 'tablet' | 'other') => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  value,
  onChange,
  onNext,
  onPrev
}) => {
  const devices = [
    {
      id: 'desktop',
      title: 'Desktop',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      description: 'Stationary computer'
    },
    {
      id: 'laptop',
      title: 'Laptop',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
          <line x1="2" y1="20" x2="22" y2="20"></line>
        </svg>
      ),
      description: 'Portable computer'
    },
    {
      id: 'tablet',
      title: 'Tablet',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="2" width="12" height="20" rx="2" ry="2"></rect>
          <circle cx="12" cy="18" r="1"></circle>
        </svg>
      ),
      description: 'Touchscreen device'
    },
    {
      id: 'other',
      title: 'Other',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      description: 'Something else'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">What type of device will you use?</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${
              value === device.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => onChange(device.id as 'desktop' | 'laptop' | 'tablet' | 'other')}
          >
            <div className="flex justify-center mb-2">
              {device.icon}
            </div>
            <h3 className="font-semibold">{device.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{device.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className={`py-2 px-4 rounded-md text-white ${
            value ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeviceSelector;