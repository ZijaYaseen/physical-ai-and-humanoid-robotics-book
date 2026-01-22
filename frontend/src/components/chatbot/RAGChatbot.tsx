import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const RAGChatbot: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session when component mounts
  useEffect(() => {
    initializeSession();
  }, []);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const response = await fetch('/api/chatkit/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const sessionData = await response.json();
        setSessionId(sessionData.sessionId);
        setUserContext(sessionData.userContext);

        // Add welcome message based on user context
        if (sessionData.userContext) {
          const welcomeMessage = getWelcomeMessage(sessionData.userContext);
          setMessages([
            {
              id: 'welcome-' + Date.now(),
              content: welcomeMessage,
              role: 'assistant',
              timestamp: new Date(),
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const getWelcomeMessage = (context: any) => {
    if (!context) {
      return "Hello! I'm your AI assistant for Physical AI and Humanoid Robotics. How can I help you today?";
    }

    const { experienceLevel, familiarTools } = context;

    let welcome = "Hello ";
    if (user?.name) {
      welcome += `${user.name}! `;
    } else {
      welcome += "! ";
    }

    welcome += "I'm your AI assistant for Physical AI and Humanoid Robotics. ";

    if (experienceLevel) {
      switch (experienceLevel) {
        case 'beginner':
          welcome += "I see you're a beginner, so I'll provide detailed explanations. ";
          break;
        case 'intermediate':
          welcome += "I see you have some experience, so I'll give you balanced technical content. ";
          break;
        case 'advanced':
          welcome += "I see you're an advanced user, so I'll provide in-depth technical information. ";
          break;
      }
    }

    if (familiarTools && familiarTools.length > 0) {
      welcome += `I notice you're familiar with ${familiarTools.slice(0, 3).join(', ')}. `;
    }

    welcome += "How can I help you today?";

    return welcome;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: 'ai-' + Date.now(),
          content: formatResponseContent(data.results[0]?.content || "I'm not sure how to answer that."),
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorData = await response.json();
        const errorMessage: Message = {
          id: 'error-' + Date.now(),
          content: `Sorry, I encountered an error: ${errorData.error || 'Unable to process your request'}`,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: "Sorry, I'm having trouble connecting. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseContent = (content: string): string => {
    // Basic formatting for the response content
    // In a real implementation, this could parse markdown or other formatting
    return content;
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <div className="flex items-center space-x-2">
            {userContext && (
              <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full">
                {userContext.experienceLevel} • {userContext.osPreference}
              </span>
            )}
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-1 ${isAuthenticated ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-xs">{isAuthenticated ? 'Authenticated' : 'Guest'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-4">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p>Start a conversation with the AI assistant</p>
            {userContext && (
              <p className="text-sm mt-2">
                Personalized for {userContext.experienceLevel} level with familiarity in {userContext.familiarTools?.slice(0, 3).join(', ') || 'various tools'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          {userContext ? `Personalized for ${userContext.experienceLevel} level users` : 'General assistance mode'}
        </div>
      </div>
    </div>
  );
};

export default RAGChatbot;