import { AIServiceConfig, AIServiceError } from './types';
import { mergeConfig } from './config';

interface ServiceInitStatus {
  speech: boolean;
  text: boolean;
  multimodal: boolean;
}

class AIServiceInitializer {
  private static instance: AIServiceInitializer;
  private status: ServiceInitStatus = {
    speech: false,
    text: false,
    multimodal: false
  };

  private constructor() {}

  static getInstance(): AIServiceInitializer {
    if (!AIServiceInitializer.instance) {
      AIServiceInitializer.instance = new AIServiceInitializer();
    }
    return AIServiceInitializer.instance;
  }

  async initializeSpeechService(config?: Partial<AIServiceConfig>) {
    try {
      const finalConfig = mergeConfig(config);
      if (!finalConfig.moduleConfig?.speech) {
        throw new AIServiceError('Speech module configuration is required', 'CONFIG_ERROR');
      }
      // Initialize speech service with configuration
      await this.validateModuleDependencies(['speech']);
      this.status.speech = true;
    } catch (error) {
      this.status.speech = false;
      throw new AIServiceError(
        `Failed to initialize speech service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SPEECH_INIT_ERROR'
      );
    }
  }

  async initializeTextService(config?: Partial<AIServiceConfig>) {
    try {
      const finalConfig = mergeConfig(config);
      if (!finalConfig.moduleConfig?.llm) {
        throw new AIServiceError('LLM module configuration is required', 'CONFIG_ERROR');
      }
      // Initialize text service with configuration
      await this.validateModuleDependencies(['llm']);
      this.status.text = true;
    } catch (error) {
      this.status.text = false;
      throw new AIServiceError(
        `Failed to initialize text service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'TEXT_INIT_ERROR'
      );
    }
  }

  async initializeMultimodalService(config?: Partial<AIServiceConfig>) {
    try {
      const finalConfig = mergeConfig(config);
      if (!finalConfig.moduleConfig?.multimodal) {
        throw new AIServiceError('Multimodal module configuration is required', 'CONFIG_ERROR');
      }
      // Initialize multimodal service with configuration
      await this.validateModuleDependencies(['multimodal']);
      this.status.multimodal = true;
    } catch (error) {
      this.status.multimodal = false;
      throw new AIServiceError(
        `Failed to initialize multimodal service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'MULTIMODAL_INIT_ERROR'
      );
    }
  }

  getStatus(): ServiceInitStatus {
    return { ...this.status };
  }

  private async validateModuleDependencies(modules: string[]): Promise<void> {
    for (const module of modules) {
      if (!serviceRegistry.getService(module)) {
        throw new AIServiceError(`Required module '${module}' is not registered`, 'MODULE_DEPENDENCY_ERROR');
      }
    }
  }

  async initializeAll(config?: Partial<AIServiceConfig>) {
    try {
      await Promise.all([
        this.initializeSpeechService(config),
        this.initializeTextService(config),
        this.initializeMultimodalService(config)
      ]);
    } catch (error) {
      throw new AIServiceError(
        `Failed to initialize all services: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INIT_ERROR'
      );
    }
  }
}

export const aiServiceInitializer = AIServiceInitializer.getInstance();