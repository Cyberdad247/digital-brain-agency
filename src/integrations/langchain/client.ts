import { LangChainConfig, LangChainMessage, LangChainResponse } from './types';

/**
 * Client for interacting with the LangChain API
 * 
 * @example
 * const client = new LangChainClient({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-4',
 *   temperature: 0.5
 * });
 * 
 * const response = await client.complete('Hello world');
 */
export class LangChainClient {
  private config: LangChainConfig;

  /**
   * Creates a new LangChainClient instance
   * @param config - Configuration for the LangChain API
   * @param config.apiKey - API key for authentication
   * @param config.model - Model to use (default: 'gpt-3.5-turbo')
   * @param config.temperature - Sampling temperature (default: 0.7)
   * @param config.maxTokens - Maximum number of tokens to generate (default: 1000)
   */
  constructor(config: LangChainConfig) {
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    };
  }

  /**
   * Sends a chat message to the LangChain API
   * @param messages - Array of message objects containing role and content
   * @returns Promise resolving to the API response
   * @throws {Error} If the API request fails
   * 
   * @example
   * const messages = [
   *   { role: 'user', content: 'Hello' },
   *   { role: 'assistant', content: 'Hi there!' }
   * ];
   * const response = await client.chat(messages);
   */
  async chat(messages: LangChainMessage[]): Promise<LangChainResponse> {
    const response = await fetch('https://api.langchain.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`LangChain API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Completes a text prompt using the LangChain API
   * @param prompt - The text prompt to complete
   * @returns Promise resolving to the generated text
   * @throws {Error} If the API request fails
   * 
   * @example
   * const text = await client.complete('Once upon a time');
   */
  async complete(prompt: string): Promise<string> {
    const response = await this.chat([{
      role: 'user',
      content: prompt
    }]);

    return response.choices[0].message.content;
  }
}
