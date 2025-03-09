import { AIServiceConfig, AIServiceError } from './types';

interface ServiceMetadata {
  name: string;
  version: string;
  dependencies: string[];
  config: Partial<AIServiceConfig>;
}

class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceMetadata> = new Map();

  private constructor() {}

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  registerService(id: string, metadata: ServiceMetadata): void {
    if (this.services.has(id)) {
      throw new AIServiceError(`Service ${id} is already registered`, 'SERVICE_EXISTS');
    }
    this.services.set(id, metadata);
  }

  getService(id: string): ServiceMetadata | undefined {
    return this.services.get(id);
  }

  listServices(): Array<[string, ServiceMetadata]> {
    return Array.from(this.services.entries());
  }

  getDependencies(id: string): string[] {
    const service = this.getService(id);
    if (!service) {
      throw new AIServiceError(`Service ${id} not found`, 'SERVICE_NOT_FOUND');
    }
    return service.dependencies;
  }

  validateDependencies(id: string): boolean {
    const dependencies = this.getDependencies(id);
    return dependencies.every(depId => this.services.has(depId));
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();