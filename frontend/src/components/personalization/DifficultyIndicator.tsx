import React from 'react';

interface DifficultyIndicatorProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  showLabel?: boolean;
  className?: string;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  level,
  showLabel = true,
  className = ''
}) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'beginner':
        return {
          label: 'Beginner',
          color: 'bg-green-100 text-green-800',
          bgColor: 'bg-green-500',
          icon: '🌱'
        };
      case 'intermediate':
        return {
          label: 'Intermediate',
          color: 'bg-yellow-100 text-yellow-800',
          bgColor: 'bg-yellow-500',
          icon: '🌿'
        };
      case 'advanced':
        return {
          label: 'Advanced',
          color: 'bg-red-100 text-red-800',
          bgColor: 'bg-red-500',
          icon: '🔥'
        };
      default:
        return {
          label: 'Mixed',
          color: 'bg-gray-100 text-gray-800',
          bgColor: 'bg-gray-500',
          icon: '❓'
        };
    }
  };

  const config = getLevelConfig();

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {showLabel && <span className="ml-1">{config.label}</span>}
      </span>
    </div>
  );
};

export default DifficultyIndicator;