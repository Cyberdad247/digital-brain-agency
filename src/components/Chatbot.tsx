import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LLMProviderSelector } from './LLMProviderSelector';

/**
 * Chatbot component that provides an interactive chat interface with various LLM providers
 * 
 * @remarks
 * This component provides:
 * - Toggleable chat window
 * - Message history management
 * - Support for multiple LLM providers (Ollama, LM Studio, GPT4All)
 * - Real-time message streaming
 * - Error handling
 * - Auto-scrolling behavior
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Chatbot />
 * 
 * // With custom position
 * <div className="fixed bottom-4 right-4">
 *   <Chatbot />
 * </div>
 * ```
 */
export const Chatbot = () => {
  /** Controls whether the chat window is open or closed */
  const [isOpen, setIsOpen] = useState(false);
  
  /** Controls the current theme (light/dark) */
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('chatbot-theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });
  
  /** Reference to the message container for auto-scrolling */
  const containerRef = useRef<HTMLDivElement>(null);
  
  /** 
   * Array of chat messages with their metadata
   * @type {Array<{id: string, type: 'user' | 'bot' | 'error', message: string}>}
   */
  const [messages, setMessages] = useState<{ 
    id: string; 
    type: string; 
    message: string;
    retry?: () => void;
  }[]>([]);
  
  /** Current input value in the chat input field */
  const [inputValue, setInputValue] = useState('');
  
  /** 
   * Configuration for the selected LLM provider and model
   * @type {{provider: 'ollama' | 'lmstudio' | 'gpt4all', model: string}}
   */
  const [llmConfig, setLlmConfig] = useState<{
    provider: 'ollama' | 'lmstudio' | 'gpt4all';
    model: string;
  }>({
    provider: 'ollama',
    model: 'default',
  });
  
  /** Client instance for interacting with the selected LLM provider */
    const [llmClient, setLlmClient] = useState({
      sendMessage: async (message: string) => {
        try {
          const response = await fetch('/api/llm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              message,
              provider: llmConfig.provider,
              model: llmConfig.model
            }),
          });
          if (!response.ok) throw new Error('API request failed');
          const data = await response.json();
          return data.response;
        } catch (error) {
          console.error('LLM API error:', error);
          throw error;
        }
      }
    });

  /**
   * Effect hook that updates the LLM client when the provider changes
   * 
   * @remarks
   * This effect:
   * - Creates a new client instance when the provider changes
   * - Creates appropriate client instances for each provider
   * - Maintains consistent client interface across different providers
   */
  useEffect(() => {
    setLlmClient({
      sendMessage: async (message: string) => {
        try {
          const response = await fetch('/api/llm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              message,
              provider: llmConfig.provider,
              model: llmConfig.model
            }),
          });
          if (!response.ok) throw new Error('API request failed');
          const data = await response.json();
          return data.response;
        } catch (error) {
          console.error('LLM API error:', error);
          throw error;
        }
      }
    });
  }, [llmConfig.provider]);

  /**
   * Handles sending a message to the LLM and updating the chat state
   * 
   * @remarks
   * This function:
   * - Validates the input message
   * - Adds the user message to the chat history
   * - Sends the message to the selected LLM provider
   * - Handles the response or error
   * - Updates the chat history with the bot's response
   * 
   * @example
   * ```ts
   * // Triggered when send button is clicked or enter is pressed
   * handleSendMessage();
   * ```
   */
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: Math.random().toString(),
        type: 'user',
        message: inputValue
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');

      try {
        const response = await llmClient.sendMessage(inputValue);
        const botMessage = {
          id: Math.random().toString(),
          type: 'bot',
          message: response
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        let errorMessage = 'Failed to get response from LLM';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        const errorEntry = {
          id: Math.random().toString(),
          type: 'error',
          message: errorMessage,
          retry: () => {
            setMessages(prev => prev.filter(m => m.id !== errorEntry.id));
            handleSendMessage();
          }
        };
        
        setMessages(prev => [...prev, errorEntry]);
      }
    }
  };

  /**
   * Effect hook that handles auto-scrolling when new messages are added
   * 
   * @remarks
   * This effect:
   * - Scrolls the message container to the bottom when messages change
   * - Ensures new messages are always visible
   * - Uses a ref to access the message container DOM element
   */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Persist theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-theme', theme);
  }, [theme]);

  /**
   * Effect hook that updates the model configuration when the provider changes
   * 
   * @remarks
   * This effect:
   * - Ensures the model is reset to the first available model when provider changes
   * - Maintains consistency between provider and model selection
   * - Prevents invalid model configurations
   */
  useEffect(() => {
    setLlmConfig(prev => ({
      provider: prev.provider,
      model: 'default'
    }));
  }, [llmConfig.provider]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {isOpen ? (
          <div className={`w-96 h-[600px] rounded-lg shadow-lg flex flex-col ${
            theme === 'dark' 
              ? 'bg-black border-pink-500' 
              : 'bg-white border-gray-200'
          }`}>
          <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-pink-500' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-pink-500' : 'text-gray-900'}`}>Customer Support</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                  </svg>
                )}
              </Button>
              <LLMProviderSelector onChange={setLlmConfig} />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto" ref={containerRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.type === 'bot' 
                      ? `${theme === 'dark' ? 'bg-black text-pink-500 border-pink-500' : 'bg-gray-100 text-gray-900 border-gray-200'} border mr-auto` 
                      : msg.type === 'error'
                      ? `${theme === 'dark' ? 'bg-black text-red-500 border-red-500' : 'bg-red-50 text-red-700 border-red-200'} border mr-auto flex flex-col gap-2`
                      : `${theme === 'dark' ? 'bg-pink-500 text-black' : 'bg-pink-600 text-white'} ml-auto`
                  }`}
                >
                  <div>{msg.message}</div>
                  {msg.type === 'error' && msg.retry && (
                    <button
                      onClick={msg.retry}
                      className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-black text-pink-500 border-pink-500 focus:ring-pink-500'
                    : 'bg-white text-gray-900 border-gray-200 focus:ring-pink-500'
                }`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                type="button"
                className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  theme === 'dark'
                    ? 'bg-pink-500 text-black hover:bg-pink-600'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
                onClick={handleSendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                  <path d="m3 3 3 9-3 9 19-9Z"/>
                  <path d="M6 12h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
        </Button>
      )}
    </div>
  );
};
