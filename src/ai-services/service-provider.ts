import { AIServiceConfig, AIServiceError } from './types';
import { BaseAIService } from './base-service';
import { serviceRegistry } from './registry';

export interface ServiceProvider {
  createService<T extends BaseAIService>(serviceId: string, config: AIServiceConfig): Promise<T>;
  configureService(serviceId: string, config: Partial<AIServiceConfig>): Promise<void>;
  getService<T extends BaseAIService>(serviceId: string): T | undefined;
}

export class AIServiceProvider implements ServiceProvider {
  private services: Map<string, BaseAIService> = new Map();

  async createService<T extends BaseAIService>(serviceId: string, config: AIServiceConfig): Promise<T> {
    if (this.services.has(serviceId)) {
      return this.services.get(serviceId) as T;
    }

    const metadata = serviceRegistry.getService(serviceId);
    if (!metadata) {
      throw new AIServiceError(`Service ${serviceId} is not registered`);
    }

    const ServiceClass = await this.loadServiceClass(serviceId);
    const service = new ServiceClass(config);
    await service.initialize(config);

    this.services.set(serviceId, service);
    return service as T;
  }

  async configureService(serviceId: string, config: Partial<AIServiceConfig>): Promise<void> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new AIServiceError(`Service ${serviceId} not found`);
    }

    await service.initialize({ ...service.getConfig(), ...config });
  }

  getService<T extends BaseAIService>(serviceId: string): T | undefined {
    return this.services.get(serviceId) as T | undefined;
  }

  private async loadServiceClass(serviceId: string): Promise<new (config: AIServiceConfig) => BaseAIService> {
    // This would be implemented to dynamically load service classes
    throw new AIServiceError('Service class loading not implemented');
  }
}

export const serviceProvider = new AIServiceProvider();