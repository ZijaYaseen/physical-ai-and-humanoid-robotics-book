import React from 'react';

interface ExperienceLevelSelectorProps {
  value: 'beginner' | 'intermediate' | 'advanced';
  onChange: (value: 'beginner' | 'intermediate' | 'advanced') => void;
  onNext: () => void;
}

const ExperienceLevelSelector: React.FC<ExperienceLevelSelectorProps> = ({
  value,
  onChange,
  onNext
}) => {
  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'Just starting out with programming or robotics'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Have some experience with programming'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Experienced developer with robotics concepts'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">What's your programming experience?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              value === level.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => onChange(level.id as 'beginner' | 'intermediate' | 'advanced')}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                  value === level.id ? 'border-indigo-500' : 'border-gray-300'
                }`}
              >
                {value === level.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                )}
              </div>
              <h3 className="font-semibold">{level.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">{level.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
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

export default ExperienceLevelSelector;