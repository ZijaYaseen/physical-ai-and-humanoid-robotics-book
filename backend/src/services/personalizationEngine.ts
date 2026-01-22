import { UserProfile } from '../models/userProfile';
import userProfileService from './userProfileService';

class PersonalizationEngine {
  /**
   * Get personalized content based on user profile
   */
  async getPersonalizedContent(userId: string, contentId: string, contentType: string): Promise<any> {
    try {
      // Get user profile
      const profile = await userProfileService.getUserProfile(userId);

      if (!profile) {
        // If no profile exists, return generic content
        return this.getGenericContent(contentId, contentType);
      }

      // Apply personalization logic based on user profile
      const personalizedContent = await this.applyPersonalization(
        contentId,
        contentType,
        profile
      );

      return personalizedContent;
    } catch (error) {
      console.error('Error in personalization engine:', error);
      // Return generic content if personalization fails
      return this.getGenericContent(contentId, contentType);
    }
  }

  /**
   * Apply personalization based on user profile
   */
  private async applyPersonalization(
    contentId: string,
    contentType: string,
    profile: UserProfile
  ): Promise<any> {
    // Get the original content
    const originalContent = await this.getContent(contentId, contentType);

    // Apply personalization based on user profile
    const personalizedContent = { ...originalContent };

    // Adjust content complexity based on programming experience
    if (profile.programming_experience) {
      personalizedContent.level = this.adjustContentLevel(
        originalContent.level,
        profile.programming_experience
      );

      // Adjust explanations based on experience level
      if (originalContent.explanations) {
        personalizedContent.explanations = this.adaptExplanations(
          originalContent.explanations,
          profile.programming_experience
        );
      }
    }

    // Suggest tools based on user's familiarity
    if (profile.development_tools && originalContent.tools) {
      personalizedContent.tools = this.adaptTools(
        originalContent.tools,
        profile.development_tools
      );
    }

    // Adjust examples based on OS preference
    if (profile.os_preference && originalContent.examples) {
      personalizedContent.examples = this.adaptExamples(
        originalContent.examples,
        profile.os_preference
      );
    }

    // Adjust content format preference
    if (profile.device_type) {
      personalizedContent.format = this.adaptFormat(
        originalContent.format,
        profile.device_type
      );
    }

    return personalizedContent;
  }

  /**
   * Adjust content level based on user experience
   */
  private adjustContentLevel(
    originalLevel: string,
    userExperience: 'beginner' | 'intermediate' | 'advanced'
  ): string {
    // For beginners, simplify complex content
    if (userExperience === 'beginner' && originalLevel === 'advanced') {
      return 'intermediate';
    }

    // For advanced users, provide more depth
    if (userExperience === 'advanced' && originalLevel === 'beginner') {
      return 'intermediate';
    }

    return originalLevel;
  }

  /**
   * Adapt explanations based on user experience level
   */
  private adaptExplanations(
    explanations: any[],
    userExperience: 'beginner' | 'intermediate' | 'advanced'
  ): any[] {
    return explanations.map(explanation => {
      switch (userExperience) {
        case 'beginner':
          // Add more detailed explanations and examples
          return {
            ...explanation,
            detailLevel: 'detailed',
            additionalExamples: this.getAdditionalExamples(explanation.type)
          };
        case 'intermediate':
          // Provide balanced explanations
          return {
            ...explanation,
            detailLevel: 'balanced'
          };
        case 'advanced':
          // Provide concise, technical explanations
          return {
            ...explanation,
            detailLevel: 'concise',
            advancedDetails: this.getAdvancedDetails(explanation.type)
          };
      }
    });
  }

  /**
   * Adapt tools recommendations based on user familiarity
   */
  private adaptTools(
    availableTools: string[],
    userFamiliarTools: string[]
  ): { recommended: string[], familiar: string[], newToTry: string[] } {
    const familiar = availableTools.filter(tool => userFamiliarTools.includes(tool));
    const newToTry = availableTools.filter(tool => !userFamiliarTools.includes(tool));

    // Prioritize familiar tools but suggest new ones
    return {
      recommended: [...familiar.slice(0, 3), ...newToTry.slice(0, 2)],
      familiar,
      newToTry
    };
  }

  /**
   * Adapt examples based on user's OS preference
   */
  private adaptExamples(
    examples: any[],
    osPreference: 'windows' | 'macos' | 'linux' | 'other'
  ): any[] {
    return examples.map(example => {
      if (example.osSpecific) {
        // Filter examples to prefer those matching user's OS
        return {
          ...example,
          content: example.content.map((item: any) => {
            if (item.os && item.os !== osPreference && item.os !== 'all') {
              // Provide alternative for different OS
              return this.getOsSpecificAlternative(item, osPreference);
            }
            return item;
          })
        };
      }
      return example;
    });
  }

  /**
   * Adapt content format based on device type
   */
  private adaptFormat(
    originalFormat: string,
    deviceType: 'desktop' | 'laptop' | 'tablet' | 'other'
  ): string {
    // Adjust format based on device capabilities
    if (deviceType === 'tablet') {
      // Prefer more visual, interactive content for tablets
      if (originalFormat === 'text-heavy') {
        return 'visual';
      }
    }

    return originalFormat;
  }

  /**
   * Get OS-specific alternative for an example
   */
  private getOsSpecificAlternative(item: any, targetOs: string): any {
    if (item.alternatives && item.alternatives[targetOs]) {
      return {
        ...item,
        command: item.alternatives[targetOs],
        os: targetOs
      };
    }
    return item;
  }

  /**
   * Get additional examples for beginners
   */
  private getAdditionalExamples(contentType: string): any[] {
    // Return additional examples based on content type
    return [
      {
        type: 'step-by-step',
        title: `Beginner's Guide to ${contentType}`,
        content: 'Detailed, step-by-step instructions with visual aids'
      }
    ];
  }

  /**
   * Get advanced details for advanced users
   */
  private getAdvancedDetails(contentType: string): any[] {
    // Return advanced details based on content type
    return [
      {
        type: 'deep-dive',
        title: `Advanced ${contentType} Concepts`,
        content: 'Technical details, edge cases, and optimization strategies'
      }
    ];
  }

  /**
   * Get original content (placeholder - would connect to content management system)
   */
  private async getContent(contentId: string, contentType: string): Promise<any> {
    // This is a placeholder - in a real implementation, this would fetch from a CMS or content database
    return {
      id: contentId,
      type: contentType,
      title: `Sample ${contentType} Content`,
      level: 'intermediate',
      explanations: [
        {
          type: 'concept',
          content: 'Core concept explanation',
          examples: ['example1', 'example2']
        }
      ],
      tools: ['Python', 'TypeScript', 'Docker'],
      examples: [
        {
          osSpecific: true,
          content: [
            { os: 'windows', command: 'windows command', description: 'Windows-specific command' },
            { os: 'macos', command: 'macos command', description: 'macOS-specific command' },
            { os: 'linux', command: 'linux command', description: 'Linux-specific command' }
          ]
        }
      ],
      format: 'mixed'
    };
  }

  /**
   * Get generic content when personalization isn't possible
   */
  private async getGenericContent(contentId: string, contentType: string): Promise<any> {
    return {
      id: contentId,
      type: contentType,
      title: `Generic ${contentType} Content`,
      level: 'intermediate',
      content: 'Standard content without personalization',
      explanations: [],
      tools: [],
      examples: [],
      format: 'standard'
    };
  }

  /**
   * Create or update personalization context for a user
   */
  async updatePersonalizationContext(userId: string, context: any): Promise<void> {
    // In a real implementation, this would update the user's personalization context in the database
    // For now, we'll just log it
    console.log(`Updating personalization context for user ${userId}:`, context);
  }
}

export default new PersonalizationEngine();