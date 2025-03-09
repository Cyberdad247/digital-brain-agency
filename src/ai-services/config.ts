import { AIServiceConfig, AIServiceError } from './types';
import { serviceRegistry } from './registry';

// Module initialization status tracking
interface ModuleStatus {
  initialized: boolean;
  error?: string;
}

/**
 * Default configuration values for AI services
 */
export const defaultConfig: AIServiceConfig = {
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  rateLimits: {
    requests: 100, // requests per duration
    duration: 60   // duration in seconds
  },
  requiredModules: ['speech', 'llm', 'multimodal']
};

/**
 * Validates the configuration values
 * @throws {AIServiceError} if validation fails
 */
function validateConfig(config: Partial<AIServiceConfig>): void {
  // Validate module dependencies
  if (config.requiredModules) {
    for (const module of config.requiredModules) {
      if (!serviceRegistry.getService(module)) {
        throw new AIServiceError(`Required module '${module}' is not registered`);
      }
    }
  }
  if (config.timeout !== undefined && (typeof config.timeout !== 'number' || config.timeout < 1000)) {
    throw new AIServiceError('Timeout must be a number >= 1000ms');
  }

  if (config.maxRetries !== undefined && (typeof config.maxRetries !== 'number' || config.maxRetries < 0)) {
    throw new AIServiceError('MaxRetries must be a non-negative number');
  }

  if (config.rateLimits) {
    if (typeof config.rateLimits.requests !== 'number' || config.rateLimits.requests < 1) {
      throw new AIServiceError('RateLimit requests must be a positive number');
    }
    if (typeof config.rateLimits.duration !== 'number' || config.rateLimits.duration < 1) {
      throw new AIServiceError('RateLimit duration must be a positive number');
    }
  }
}

/**
 * Merges custom configuration with default configuration
 * @param config - Partial configuration to merge with defaults
 * @returns Complete AIServiceConfig
 * @throws {AIServiceError} if validation fails
 */
export function mergeConfig(config?: Partial<AIServiceConfig>): AIServiceConfig {
  if (!config) return { ...defaultConfig };

  try {
    validateConfig(config);

    return {
      ...defaultConfig,
      ...config,
      rateLimits: {
        ...defaultConfig.rateLimits,
        ...config.rateLimits
      }
    };
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }
    throw new AIServiceError('Invalid configuration: ' + (error as Error).message);
  }
}

export { AIServiceConfig };