import userProfileService from './userProfileService';
import { UserProfile } from '../models/userProfile';

class RAGContextInjector {
  /**
   * Inject user profile context into RAG query
   */
  async injectContext(userId: string, query: string): Promise<{ enhancedQuery: string; context: any }> {
    try {
      // Get user profile
      const profile = await userProfileService.getUserProfile(userId);

      if (!profile || !profile.personalization_enabled) {
        // If no profile or personalization disabled, return original query
        return {
          enhancedQuery: query,
          context: {
            personalizationEnabled: false,
            userContext: null
          }
        };
      }

      // Enhance the query based on user profile
      const enhancedQuery = this.enhanceQueryWithProfile(query, profile);

      // Create context object for RAG system
      const context = {
        personalizationEnabled: true,
        userContext: {
          experienceLevel: profile.programming_experience,
          osPreference: profile.os_preference,
          familiarTools: profile.development_tools,
          deviceType: profile.device_type,
          consentGiven: profile.consent_given
        },
        queryComplexity: this.determineQueryComplexity(query, profile.programming_experience)
      };

      return {
        enhancedQuery,
        context
      };
    } catch (error) {
      console.error('Error injecting context:', error);
      // Return original query if context injection fails
      return {
        enhancedQuery: query,
        context: {
          personalizationEnabled: false,
          userContext: null,
          error: 'Failed to inject user context'
        }
      };
    }
  }

  /**
   * Enhance query with user profile information
   */
  private enhanceQueryWithProfile(query: string, profile: UserProfile): string {
    let enhancedQuery = query;

    // Adjust query based on user's experience level
    if (profile.programming_experience) {
      enhancedQuery = this.adaptQueryForExperience(enhancedQuery, profile.programming_experience);
    }

    // Include user's familiar tools in the query if relevant
    if (profile.development_tools && profile.development_tools.length > 0) {
      enhancedQuery = this.includeToolContext(enhancedQuery, profile.development_tools);
    }

    // Consider user's OS preference for technical queries
    if (profile.os_preference) {
      enhancedQuery = this.includeOSContext(enhancedQuery, profile.os_preference);
    }

    return enhancedQuery;
  }

  /**
   * Adapt query based on user's experience level
   */
  private adaptQueryForExperience(query: string, experience: string): string {
    // For beginners, add context to make queries more specific
    if (experience === 'beginner') {
      // Add beginner-friendly context to technical queries
      if (this.isTechnicalQuery(query)) {
        return `${query} (explain in simple terms, with examples, for a beginner)`;
      }
    }
    // For advanced users, allow more complex queries
    else if (experience === 'advanced') {
      // Add advanced context to relevant queries
      if (this.isTechnicalQuery(query)) {
        return `${query} (include advanced concepts, best practices, and optimization)`;
      }
    }

    return query;
  }

  /**
   * Include tool context in query
   */
  private includeToolContext(query: string, familiarTools: string[]): string {
    // Check if the query is about tools and include user's familiar tools
    const toolRelatedKeywords = ['tool', 'software', 'library', 'framework', 'language'];

    if (toolRelatedKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      const userTools = familiarTools.join(', ');
      return `${query} (considering familiarity with: ${userTools})`;
    }

    return query;
  }

  /**
   * Include OS context in query
   */
  private includeOSContext(query: string, osPreference: string): string {
    // Check if the query involves system commands or installation
    const systemRelatedKeywords = ['install', 'command', 'terminal', 'bash', 'shell', 'setup', 'configuration'];

    if (systemRelatedKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return `${query} (for ${osPreference} operating system)`;
    }

    return query;
  }

  /**
   * Determine if query is technical
   */
  private isTechnicalQuery(query: string): boolean {
    const technicalKeywords = [
      'code', 'programming', 'algorithm', 'function', 'variable', 'class', 'method',
      'debug', 'error', 'bug', 'test', 'framework', 'library', 'api', 'database',
      'server', 'client', 'network', 'security', 'architecture'
    ];

    return technicalKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  /**
   * Determine query complexity based on user experience
   */
  private determineQueryComplexity(query: string, experience: string): string {
    if (experience === 'beginner') {
      return 'simple';
    } else if (experience === 'advanced') {
      return 'complex';
    }
    return 'moderate';
  }

  /**
   * Format context for RAG system
   */
  async formatRAGContext(userId: string, query: string): Promise<any> {
    const { context } = await this.injectContext(userId, query);

    // Format context specifically for RAG system
    return {
      user_id: userId,
      personalization_enabled: context.personalizationEnabled,
      user_profile: context.userContext,
      query_complexity: context.queryComplexity,
      response_instructions: this.getResponseInstructions(context.userContext)
    };
  }

  /**
   * Get response instructions based on user profile
   */
  private getResponseInstructions(userContext: any): string {
    if (!userContext) {
      return 'Provide a balanced, general response.';
    }

    const { experienceLevel, familiarTools, osPreference } = userContext;

    let instructions = 'Provide a response that is appropriate for ';

    switch (experienceLevel) {
      case 'beginner':
        instructions += 'a beginner, with detailed explanations, step-by-step instructions, and simple examples.';
        break;
      case 'intermediate':
        instructions += 'an intermediate user, with balanced technical depth and practical examples.';
        break;
      case 'advanced':
        instructions += 'an advanced user, with technical depth, best practices, and optimization details.';
        break;
      default:
        instructions += 'a general audience, with balanced technical content.';
    }

    if (familiarTools && familiarTools.length > 0) {
      instructions += ` The user is familiar with: ${familiarTools.join(', ')}.`;
    }

    if (osPreference) {
      instructions += ` The user is using ${osPreference} operating system.`;
    }

    return instructions;
  }
}

export default new RAGContextInjector();