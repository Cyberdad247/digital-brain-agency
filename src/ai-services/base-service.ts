import { AIServiceConfig, AIServiceError } from './types';

export interface BaseAIService {
  initialize(config: AIServiceConfig): Promise<void>;
  isInitialized(): boolean;
  validateConfig(config: Partial<AIServiceConfig>): void;
  getConfig(): AIServiceConfig;
}

export abstract class AbstractAIService implements BaseAIService {
  protected config: AIServiceConfig;
  protected initialized: boolean = false;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async initialize(config: AIServiceConfig): Promise<void> {
    try {
      this.validateConfig(config);
      this.config = { ...this.config, ...config };
      this.initialized = true;
    } catch (error) {
      throw new AIServiceError(`Initialization failed: ${(error as Error).message}`);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  validateConfig(config: Partial<AIServiceConfig>): void {
    if (!config) {
      throw new AIServiceError('Configuration is required');
    }
  }

  getConfig(): AIServiceConfig {
    return this.config;
  }

  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new AIServiceError('Service is not initialized');
    }
  }
}