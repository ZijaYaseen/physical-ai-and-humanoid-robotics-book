import { UserProfile } from '../models/userProfile';

class RAGResponseFormatter {
  /**
   * Format RAG response based on user profile for personalized experience
   */
  async formatResponse(
    response: any,
    userId: string,
    userContext: any
  ): Promise<any> {
    try {
      // If no user context or personalization disabled, return response as is
      if (!userContext || !userContext.personalization_enabled) {
        return response;
      }

      // Apply personalization to the response
      const personalizedResponse = await this.personalizeResponse(
        response,
        userContext.user_profile
      );

      return personalizedResponse;
    } catch (error) {
      console.error('Error formatting response:', error);
      // Return original response if formatting fails
      return response;
    }
  }

  /**
   * Personalize the response based on user profile
   */
  private async personalizeResponse(
    response: any,
    userProfile: UserProfile
  ): Promise<any> {
    const personalizedResponse = { ...response };

    if (!userProfile) {
      return personalizedResponse;
    }

    // Personalize response based on experience level
    if (userProfile.programming_experience) {
      personalizedResponse.choices = this.adaptResponsesByExperience(
        response.choices,
        userProfile.programming_experience
      );
    }

    // Personalize based on OS preference
    if (userProfile.os_preference) {
      personalizedResponse.choices = this.adaptResponsesByOS(
        response.choices,
        userProfile.os_preference
      );
    }

    // Personalize based on familiar tools
    if (userProfile.development_tools && userProfile.development_tools.length > 0) {
      personalizedResponse.choices = this.adaptResponsesByTools(
        response.choices,
        userProfile.development_tools
      );
    }

    // Add relevant examples or context based on user profile
    personalizedResponse.choices = this.addRelevantExamples(
      response.choices,
      userProfile
    );

    return personalizedResponse;
  }

  /**
   * Adapt responses based on user's experience level
   */
  private adaptResponsesByExperience(
    choices: any[],
    experienceLevel: string
  ): any[] {
    return choices.map(choice => {
      let content = choice.message?.content || '';

      switch (experienceLevel) {
        case 'beginner':
          // Add more explanations and simpler language for beginners
          content = this.simplifyContent(content);
          content = this.addBeginnerExplanations(content);
          break;
        case 'advanced':
          // Add more technical depth for advanced users
          content = this.addAdvancedDetails(content);
          break;
        case 'intermediate':
          // Keep content as is or slightly adjust
          content = this.balanceContent(content);
          break;
      }

      return {
        ...choice,
        message: {
          ...choice.message,
          content
        }
      };
    });
  }

  /**
   * Adapt responses based on user's OS preference
   */
  private adaptResponsesByOS(choices: any[], osPreference: string): any[] {
    return choices.map(choice => {
      let content = choice.message?.content || '';

      // Replace OS-specific commands/examples based on user's preference
      content = this.replaceOSCommands(content, osPreference);

      return {
        ...choice,
        message: {
          ...choice.message,
          content
        }
      };
    });
  }

  /**
   * Adapt responses based on user's familiar tools
   */
  private adaptResponsesByTools(choices: any[], familiarTools: string[]): any[] {
    return choices.map(choice => {
      let content = choice.message?.content || '';

      // Mention or reference tools the user is familiar with
      content = this.referenceFamiliarTools(content, familiarTools);

      return {
        ...choice,
        message: {
          ...choice.message,
          content
        }
      };
    });
  }

  /**
   * Add relevant examples based on user profile
   */
  private addRelevantExamples(choices: any[], userProfile: UserProfile): any[] {
    return choices.map(choice => {
      let content = choice.message?.content || '';

      // Add examples that match the user's context
      if (userProfile.os_preference) {
        content = this.addOSExamples(content, userProfile.os_preference);
      }

      if (userProfile.development_tools && userProfile.development_tools.length > 0) {
        content = this.addToolExamples(content, userProfile.development_tools);
      }

      return {
        ...choice,
        message: {
          ...choice.message,
          content
        }
      };
    });
  }

  /**
   * Simplify content for beginners
   */
  private simplifyContent(content: string): string {
    // Replace complex terms with simpler explanations
    let simplified = content.replace(/algorithm/gi, 'step-by-step procedure');
    simplified = simplified.replace(/implementation/gi, 'way to do');
    simplified = simplified.replace(/optimization/gi, 'improvement');

    // Add beginner-friendly disclaimers
    simplified += '\n\nNote: This concept might take some time to fully understand. Practice with simple examples first.';

    return simplified;
  }

  /**
   * Add beginner explanations to content
   */
  private addBeginnerExplanations(content: string): string {
    return content + '\n\n**Beginner Tip:** Take your time to understand each part before moving to the next. Feel free to ask for more examples if needed.';
  }

  /**
   * Add advanced details to content
   */
  private addAdvancedDetails(content: string): string {
    return content + '\n\n**Advanced Note:** Consider the performance implications, memory usage, and scalability of this approach in production environments.';
  }

  /**
   * Balance content for intermediate users
   */
  private balanceContent(content: string): string {
    return content + '\n\nThis approach balances simplicity and effectiveness for most use cases.';
  }

  /**
   * Replace OS-specific commands
   */
  private replaceOSCommands(content: string, osPreference: string): string {
    switch (osPreference) {
      case 'windows':
        content = content.replace(/sudo /g, ''); // Remove sudo for Windows
        content = content.replace(/apt-get/g, 'choco'); // Suggest Chocolatey instead of apt
        content = content.replace(/brew/g, 'choco'); // Suggest Chocolatey instead of brew
        break;
      case 'macos':
        content = content.replace(/apt-get/g, 'brew'); // Suggest Homebrew instead of apt
        content = content.replace(/yum/g, 'brew'); // Suggest Homebrew instead of yum
        break;
      case 'linux':
        // Keep Linux commands as is, but maybe suggest common distro specifics
        content = content.replace(/brew/g, 'apt-get'); // Suggest apt for Ubuntu/Debian
        break;
    }

    return content;
  }

  /**
   * Reference tools the user is familiar with
   */
  private referenceFamiliarTools(content: string, familiarTools: string[]): string {
    const toolString = familiarTools.join(', ');

    // Add mention of familiar tools where relevant
    if (content.toLowerCase().includes('editor') || content.toLowerCase().includes('ide')) {
      content += `\n\nSince you're familiar with ${toolString}, you might want to use its specific features for this task.`;
    }

    return content;
  }

  /**
   * Add OS-specific examples
   */
  private addOSExamples(content: string, osPreference: string): string {
    if (content.toLowerCase().includes('install') || content.toLowerCase().includes('setup')) {
      content += `\n\n**${osPreference.charAt(0).toUpperCase() + osPreference.slice(1)} Example:** `;

      switch (osPreference) {
        case 'windows':
          content += 'Use Windows Subsystem for Linux (WSL) for a Unix-like environment, or install tools via Chocolatey package manager.';
          break;
        case 'macos':
          content += 'Use Homebrew package manager (brew install [package]) or install via official installers.';
          break;
        case 'linux':
          content += 'Use your distribution\'s package manager (apt for Ubuntu/Debian, yum/dnf for RedHat/Fedora, pacman for Arch).';
          break;
        default:
          content += 'Use appropriate package managers or installation methods for your system.';
      }
    }

    return content;
  }

  /**
   * Add tool-specific examples
   */
  private addToolExamples(content: string, familiarTools: string[]): string {
    if (familiarTools.length > 0) {
      const relevantTools = familiarTools.filter(tool =>
        content.toLowerCase().includes(tool.toLowerCase())
      );

      if (relevantTools.length > 0) {
        content += `\n\n**Using ${relevantTools[0]}:** You can accomplish this with ${relevantTools[0]}'s built-in functionality.`;
      }
    }

    return content;
  }
}

export default new RAGResponseFormatter();