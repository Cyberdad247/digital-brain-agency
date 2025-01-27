import { LangChainClient } from './client';
import type { LangChainConfig } from './types';

export { LangChainClient };
export type { LangChainConfig };

export function createLangChainClient(config: LangChainConfig): LangChainClient {
  return new LangChainClient(config);
}

export type { LangChainMessage, LangChainResponse } from './types';
