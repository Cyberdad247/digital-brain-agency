// Global type declarations for the Digital Brain Agency

// Extend Window interface for custom properties
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

// Utility types for API responses
type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: string;
};

// Common type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Utility types for partial updates
type PartialUpdate<T> = Partial<T> & { id: string };

// Type definitions for external modules without types
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

// Extend existing modules if needed
declare module '@/ai-services' {
  export interface AIServiceOptions {
    timeout?: number;
    retries?: number;
    apiKey?: string;
  }
}