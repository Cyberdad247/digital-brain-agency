import { ErrorMonitoringService } from './ErrorMonitoringService';

describe('ErrorMonitoringService', () => {
  let service: ErrorMonitoringService;

  beforeEach(() => {
    service = ErrorMonitoringService.getInstance();
  });

  it('should create a singleton instance', () => {
    const anotherInstance = ErrorMonitoringService.getInstance();
    expect(service).toBe(anotherInstance);
  });

  it('should create valid error metadata', () => {
    const metadata = service.createErrorMetadata();
    expect(metadata).toHaveProperty('timestamp');
    expect(metadata).toHaveProperty('environment');
  });

  it('should throw error for invalid environment', () => {
    expect(() => {
      service.createErrorMetadata({ environment: 'invalid' });
    }).toThrow('Invalid environment value');
  });
});