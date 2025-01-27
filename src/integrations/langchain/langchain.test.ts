import { createLangChainClient } from './index';
import type { LangChainConfig } from './types';

describe('LangChain Integration', () => {
  const config: LangChainConfig = {
    apiKey: 'test-key',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  };

  it('should create a LangChain client', () => {
    const client = createLangChainClient(config);
    expect(client).toBeDefined();
    expect(client.config).toEqual(config);
  });

  it('should throw error when missing required config', () => {
    expect(() => createLangChainClient({} as LangChainConfig)).toThrow();
  });
});
