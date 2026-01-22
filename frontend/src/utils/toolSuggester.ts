// Tool suggestion utilities based on user profile

interface UserProfile {
  programming_experience?: 'beginner' | 'intermediate' | 'advanced';
  os_preference?: 'windows' | 'macos' | 'linux' | 'other';
  development_tools?: string[];
  device_type?: 'desktop' | 'laptop' | 'tablet' | 'other';
}

interface ToolSuggestion {
  name: string;
  category: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  osCompatibility: ('windows' | 'macos' | 'linux' | 'all')[];
  description: string;
  difficulty?: number; // 1-5 scale
  recommendationReason?: string;
}

/**
 * Get tool suggestions based on user profile
 */
export const getSuggestedTools = (userProfile: UserProfile): ToolSuggestion[] => {
  const suggestions: ToolSuggestion[] = [];

  // Base tool recommendations
  const baseTools: ToolSuggestion[] = [
    {
      name: 'Visual Studio Code',
      category: 'IDE',
      experienceLevel: 'all',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Popular code editor with extensive extensions',
      difficulty: 2
    },
    {
      name: 'Git',
      category: 'Version Control',
      experienceLevel: 'all',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Essential for version control and collaboration',
      difficulty: 3
    },
    {
      name: 'Docker',
      category: 'Containerization',
      experienceLevel: 'intermediate',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Container platform for consistent development environments',
      difficulty: 4
    },
    {
      name: 'PyCharm',
      category: 'IDE',
      experienceLevel: 'intermediate',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Powerful Python IDE with debugging and testing tools',
      difficulty: 3
    },
    {
      name: 'Node.js',
      category: 'Runtime',
      experienceLevel: 'intermediate',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'JavaScript runtime for building server-side applications',
      difficulty: 3
    },
    {
      name: 'TensorFlow',
      category: 'ML Framework',
      experienceLevel: 'advanced',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Machine learning framework for building AI models',
      difficulty: 5
    },
    {
      name: 'ROS',
      category: 'Robotics',
      experienceLevel: 'advanced',
      osCompatibility: ['linux'],
      description: 'Robot Operating System for robotics development',
      difficulty: 5
    },
    {
      name: 'Arduino IDE',
      category: 'Hardware',
      experienceLevel: 'beginner',
      osCompatibility: ['windows', 'macos', 'linux'],
      description: 'Integrated development environment for Arduino microcontrollers',
      difficulty: 2
    }
  ];

  // Filter and prioritize tools based on user profile
  baseTools.forEach(tool => {
    // Check experience level compatibility
    if (userProfile.programming_experience) {
      if (tool.experienceLevel !== 'all' && tool.experienceLevel !== userProfile.programming_experience) {
        // Adjust recommendation based on experience mismatch
        if (isExperienceCompatible(tool.experienceLevel, userProfile.programming_experience)) {
          suggestions.push({
            ...tool,
            recommendationReason: getExperienceReason(tool.experienceLevel, userProfile.programming_experience)
          });
        }
      } else {
        suggestions.push(tool);
      }
    } else {
      suggestions.push(tool);
    }
  });

  // Filter by OS compatibility
  if (userProfile.os_preference) {
    return suggestions.filter(tool =>
      tool.osCompatibility.includes(userProfile.os_preference as any) ||
      tool.osCompatibility.includes('all')
    );
  }

  // Prioritize tools the user already knows
  if (userProfile.development_tools) {
    return suggestions.sort((a, b) => {
      const aKnown = userProfile.development_tools!.includes(a.name) ? 1 : 0;
      const bKnown = userProfile.development_tools!.includes(b.name) ? 1 : 0;
      // Prioritize known tools, then by difficulty matching experience
      return bKnown - aKnown;
    });
  }

  return suggestions;
};

/**
 * Get tools specifically for a content type
 */
export const getContentTypeTools = (contentType: string, userProfile: UserProfile): ToolSuggestion[] => {
  // Define tools by content type
  const toolsByContentType: Record<string, ToolSuggestion[]> = {
    'python': [
      {
        name: 'Python',
        category: 'Language',
        experienceLevel: 'all',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'High-level programming language for general purpose programming',
        difficulty: 2
      },
      {
        name: 'Jupyter Notebook',
        category: 'Environment',
        experienceLevel: 'beginner',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'Interactive computing environment for Python',
        difficulty: 2
      }
    ],
    'javascript': [
      {
        name: 'Node.js',
        category: 'Runtime',
        experienceLevel: 'intermediate',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'JavaScript runtime for server-side development',
        difficulty: 3
      },
      {
        name: 'npm',
        category: 'Package Manager',
        experienceLevel: 'beginner',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'Package manager for JavaScript',
        difficulty: 2
      }
    ],
    'robotics': [
      {
        name: 'ROS',
        category: 'Framework',
        experienceLevel: 'advanced',
        osCompatibility: ['linux'],
        description: 'Robot Operating System for robotics applications',
        difficulty: 5
      },
      {
        name: 'Gazebo',
        category: 'Simulation',
        experienceLevel: 'intermediate',
        osCompatibility: ['linux'],
        description: 'Robot simulation environment',
        difficulty: 4
      }
    ],
    'ai': [
      {
        name: 'TensorFlow',
        category: 'ML Framework',
        experienceLevel: 'advanced',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'Machine learning framework for AI development',
        difficulty: 5
      },
      {
        name: 'PyTorch',
        category: 'ML Framework',
        experienceLevel: 'advanced',
        osCompatibility: ['windows', 'macos', 'linux'],
        description: 'Deep learning framework for AI research',
        difficulty: 5
      }
    ]
  };

  const contentTypeTools = toolsByContentType[contentType.toLowerCase()] || [];
  return getSuggestedTools(userProfile).filter(tool =>
    contentTypeTools.some(ctTool => ctTool.name === tool.name)
  );
};

/**
 * Check if tool experience level is compatible with user experience
 */
const isExperienceCompatible = (toolLevel: string, userLevel: string): boolean => {
  if (toolLevel === 'all') return true;

  // Beginners can start with beginner or intermediate tools
  if (userLevel === 'beginner') return toolLevel === 'beginner' || toolLevel === 'intermediate';

  // Intermediate users can handle intermediate or advanced tools
  if (userLevel === 'intermediate') return toolLevel === 'intermediate' || toolLevel === 'advanced';

  // Advanced users can handle any level
  return true;
};

/**
 * Get reason for recommendation based on experience levels
 */
const getExperienceReason = (toolLevel: string, userLevel: string): string => {
  if (toolLevel === 'beginner' && userLevel !== 'beginner') {
    return "Good foundation tool to strengthen your basics";
  }
  if (toolLevel === 'advanced' && userLevel === 'beginner') {
    return "Challenging tool that will accelerate your learning";
  }
  if (toolLevel === 'intermediate' && userLevel === 'beginner') {
    return "Appropriate next step as you advance";
  }
  if (toolLevel === 'intermediate' && userLevel === 'advanced') {
    return "Solidifies intermediate concepts before advanced work";
  }

  return "Recommended for your experience level";
};