import React, { useState } from 'react';

interface OSToolSelectorProps {
  osValue: 'windows' | 'macos' | 'linux' | 'other';
  toolsValue: string[];
  onOsChange: (value: 'windows' | 'macos' | 'linux' | 'other') => void;
  onToolsChange: (value: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const OSToolSelector: React.FC<OSToolSelectorProps> = ({
  osValue,
  toolsValue,
  onOsChange,
  onToolsChange,
  onNext,
  onPrev
}) => {
  const operatingSystems = [
    { id: 'windows', name: 'Windows' },
    { id: 'macos', name: 'macOS' },
    { id: 'linux', name: 'Linux' },
    { id: 'other', name: 'Other' }
  ];

  const developmentTools = [
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Docker',
    'Git',
    'VS Code',
    'PyCharm',
    'TensorFlow',
    'PyTorch',
    'ROS',
    'Arduino',
    'C/C++',
    'Raspberry Pi',
    'MicroPython'
  ];

  const toggleTool = (tool: string) => {
    if (toolsValue.includes(tool)) {
      onToolsChange(toolsValue.filter(t => t !== tool));
    } else {
      onToolsChange([...toolsValue, tool]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">What's your operating system and development tools?</h2>

      <div>
        <h3 className="font-medium mb-3">Operating System</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {operatingSystems.map((os) => (
            <div
              key={os.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                osValue === os.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => onOsChange(os.id as 'windows' | 'macos' | 'linux' | 'other')}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    osValue === os.id ? 'border-indigo-500' : 'border-gray-300'
                  }`}
                >
                  {osValue === os.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  )}
                </div>
                <span>{os.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Development Tools (Select all that apply)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {developmentTools.map((tool) => (
            <div
              key={tool}
              className={`border rounded-lg p-2 cursor-pointer transition-all ${
                toolsValue.includes(tool)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => toggleTool(tool)}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                    toolsValue.includes(tool) ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}
                >
                  {toolsValue.includes(tool) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-sm">{tool}</span>
              </div>
            </div>
          ))}
        </div>
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
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OSToolSelector;