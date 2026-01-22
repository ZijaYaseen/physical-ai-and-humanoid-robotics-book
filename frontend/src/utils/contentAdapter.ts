// Content adaptation utilities based on user profile

interface UserProfile {
  programming_experience?: 'beginner' | 'intermediate' | 'advanced';
  os_preference?: 'windows' | 'macos' | 'linux' | 'other';
  development_tools?: string[];
  device_type?: 'desktop' | 'laptop' | 'tablet' | 'other';
}

interface ContentAdaptationOptions {
  adaptComplexity?: boolean;
  adaptExamples?: boolean;
  adaptTools?: boolean;
  adaptFormat?: boolean;
}

/**
 * Adapt content based on user profile
 */
export const adaptContent = (
  content: any,
  userProfile: UserProfile,
  options: ContentAdaptationOptions = {}
): any => {
  const {
    adaptComplexity = true,
    adaptExamples = true,
    adaptTools = true,
    adaptFormat = true
  } = options;

  let adaptedContent = { ...content };

  // Adapt content complexity based on programming experience
  if (adaptComplexity && userProfile.programming_experience) {
    adaptedContent = adaptContentComplexity(adaptedContent, userProfile.programming_experience);
  }

  // Adapt examples based on OS preference
  if (adaptExamples && userProfile.os_preference) {
    adaptedContent = adaptExamplesByOS(adaptedContent, userProfile.os_preference);
  }

  // Adapt tool recommendations based on user's familiar tools
  if (adaptTools && userProfile.development_tools) {
    adaptedContent = adaptToolRecommendations(adaptedContent, userProfile.development_tools);
  }

  // Adapt format based on device type
  if (adaptFormat && userProfile.device_type) {
    adaptedContent = adaptContentFormat(adaptedContent, userProfile.device_type);
  }

  return adaptedContent;
};

/**
 * Adapt content complexity based on user experience level
 */
const adaptContentComplexity = (content: any, experienceLevel: string): any => {
  if (!content.complexity) return content;

  const adapted = { ...content };

  switch (experienceLevel) {
    case 'beginner':
      // Simplify complex content for beginners
      if (adapted.complexity === 'advanced') {
        adapted.complexity = 'intermediate';
        adapted.explanation = addBeginnerExplanation(adapted.explanation);
        adapted.examples = addBeginnerExamples(adapted.examples);
      }
      break;
    case 'advanced':
      // Add depth for advanced users
      if (adapted.complexity === 'beginner') {
        adapted.complexity = 'intermediate';
        adapted.explanation = addAdvancedExplanation(adapted.explanation);
      }
      break;
    default:
      // Intermediate remains as is
      break;
  }

  return adapted;
};

/**
 * Adapt examples based on user's OS preference
 */
const adaptExamplesByOS = (content: any, osPreference: string): any => {
  if (!content.examples) return content;

  const adapted = { ...content };
  adapted.examples = content.examples.map((example: any) => {
    if (example.osSpecific && example.commands) {
      // Return commands specific to user's OS
      return {
        ...example,
        commands: example.commands.filter((cmd: any) => cmd.os === osPreference || cmd.os === 'all')
      };
    }
    return example;
  });

  return adapted;
};

/**
 * Adapt tool recommendations based on user's familiar tools
 */
const adaptToolRecommendations = (content: any, familiarTools: string[]): any => {
  if (!content.tools) return content;

  const adapted = { ...content };
  const familiarToolSet = new Set(familiarTools);

  adapted.tools = {
    ...content.tools,
    recommended: content.tools.all.filter((tool: string) => familiarToolSet.has(tool)),
    newOptions: content.tools.all.filter((tool: string) => !familiarToolSet.has(tool))
  };

  return adapted;
};

/**
 * Adapt content format based on device type
 */
const adaptContentFormat = (content: any, deviceType: string): any => {
  if (!content.format) return content;

  const adapted = { ...content };

  switch (deviceType) {
    case 'tablet':
      // Optimize for touch interaction
      adapted.format = {
        ...content.format,
        layout: 'touch-optimized',
        navigation: 'thumb-friendly'
      };
      break;
    case 'mobile':
      // Optimize for small screen
      adapted.format = {
        ...content.format,
        layout: 'mobile-optimized',
        textSize: 'larger'
      };
      break;
    default:
      // Desktop/laptop remains as is
      break;
  }

  return adapted;
};

/**
 * Add beginner-friendly explanation
 */
const addBeginnerExplanation = (explanation: string): string => {
  return explanation ?
    explanation + "\n\nFor beginners: This concept might seem complex at first. Take your time to understand the basics before moving forward." :
    "This section is designed for beginners. We'll explain concepts step by step.";
};

/**
 * Add advanced explanation
 */
const addAdvancedExplanation = (explanation: string): string => {
  return explanation ?
    explanation + "\n\nAdvanced note: Consider the performance implications and edge cases when implementing this in production." :
    "Advanced implementation details and optimizations.";
};

/**
 * Add beginner examples
 */
const addBeginnerExamples = (examples: any[]): any[] => {
  if (!examples) return [{
    title: "Basic Example",
    code: "// Simple example for beginners",
    explanation: "This is a basic example to help you understand the concept"
  }];

  return [
    ...examples,
    {
      title: "Beginner Tip",
      code: "// Remember to handle errors appropriately",
      explanation: "Always consider error handling in your code"
    }
  ];
};