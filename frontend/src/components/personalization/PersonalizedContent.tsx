import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PersonalizedContentProps {
  children: ReactNode;
  contentType?: string;
  fallbackContent?: ReactNode;
  className?: string;
}

interface UserProfileContext {
  programming_experience?: 'beginner' | 'intermediate' | 'advanced';
  os_preference?: 'windows' | 'macos' | 'linux' | 'other';
  development_tools?: string[];
  device_type?: 'desktop' | 'laptop' | 'tablet' | 'other';
  personalization_enabled?: boolean;
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({
  children,
  contentType = 'generic',
  fallbackContent,
  className = ''
}) => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
      setUserProfile(null);
    }
  }, [isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If user is not authenticated or has disabled personalization, show generic content
  if (!isAuthenticated || !userProfile || !userProfile.personalization_enabled) {
    return <div className={className}>{fallbackContent || children}</div>;
  }

  // Apply personalization based on user profile
  const personalizedContent = personalizeContent(children, userProfile, contentType);

  return <div className={className}>{personalizedContent}</div>;
};

/**
 * Apply personalization to content based on user profile
 */
const personalizeContent = (
  content: ReactNode,
  profile: UserProfileContext,
  contentType: string
): ReactNode => {
  // This is a simplified personalization logic
  // In a real implementation, this would be more sophisticated

  // Create a wrapper that can modify the content based on profile
  return React.cloneElement(<div>{content}</div> as any, {
    'data-personalized': true,
    'data-user-experience': profile.programming_experience,
    'data-user-os': profile.os_preference,
    'data-content-type': contentType
  });
};

// Additional helper components for specific personalization needs

interface DifficultyIndicatorProps {
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({ experienceLevel }) => {
  if (!experienceLevel) return null;

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner Friendly';
      case 'intermediate': return 'Intermediate Level';
      case 'advanced': return 'Advanced Content';
      default: return 'Mixed Level';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(experienceLevel)}`}>
      {getDifficultyLabel(experienceLevel)}
    </span>
  );
};

interface ToolRecommendationProps {
  availableTools: string[];
  userFamiliarTools?: string[];
}

export const ToolRecommendation: React.FC<ToolRecommendationProps> = ({
  availableTools,
  userFamiliarTools = []
}) => {
  const familiarTools = availableTools.filter(tool => userFamiliarTools.includes(tool));
  const newTools = availableTools.filter(tool => !userFamiliarTools.includes(tool));

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-md">
      <h4 className="font-medium text-blue-800 mb-2">Recommended Tools</h4>
      <div className="flex flex-wrap gap-2">
        {familiarTools.map(tool => (
          <span
            key={tool}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
          >
            {tool} (Familiar)
          </span>
        ))}
        {newTools.map(tool => (
          <span
            key={tool}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tool} (New)
          </span>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedContent;