import { SupabaseClient } from '@supabase/supabase-client';
import * as Sentry from '@sentry/nextjs';

interface ErrorLogEntry {
  timestamp: string;
  component: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  details?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private supabase: SupabaseClient | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public setSupabaseClient(client: SupabaseClient) {
    this.supabase = client;
  }

  private async logToSupabase(entry: ErrorLogEntry): Promise<void> {
    if (!this.supabase) {
      console.warn('Supabase client not initialized for logging');
      return;
    }

    try {
      const { error } = await this.supabase
        .from('logs')
        .insert([entry]);

      if (error) {
        console.error('Failed to log to Supabase:', error);
        Sentry.captureException(error);
      }
    } catch (err) {
      console.error('Error logging to Supabase:', err);
      Sentry.captureException(err);
    }
  }

  public async logError(component: string, message: string, details?: Record<string, any>): Promise<void> {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      component,
      level: 'error',
      message,
      details
    };

    await this.logToSupabase(entry);
    Sentry.captureMessage(message, { level: 'error', extra: details });
    console.error(`[${component}] ${message}`, details);
  }

  public async logWarning(component: string, message: string, details?: Record<string, any>): Promise<void> {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      component,
      level: 'warn',
      message,
      details
    };

    await this.logToSupabase(entry);
    Sentry.captureMessage(message, { level: 'warning', extra: details });
    console.warn(`[${component}] ${message}`, details);
  }

  public async logInfo(component: string, message: string, details?: Record<string, any>): Promise<void> {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      component,
      level: 'info',
      message,
      details
    };

    await this.logToSupabase(entry);
    console.info(`[${component}] ${message}`, details);
  }

  public async withRetry<T>(
    operation: () => Promise<T>,
    component: string,
    errorMessage: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        await this.logWarning(
          component,
          `${errorMessage} (Attempt ${attempt}/${this.MAX_RETRIES})`,
          { error: error instanceof Error ? error.message : String(error) }
        );

        if (attempt < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    }

    await this.logError(component, `${errorMessage} (All retries failed)`, {
      error: lastError?.message
    });
    throw lastError;
  }

  public validateAIOutput(output: string, requirements: {
    minLength?: number;
    maxLength?: number;
    requiredKeywords?: string[];
  }): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (requirements.minLength && output.length < requirements.minLength) {
      issues.push(`Output length ${output.length} is less than minimum ${requirements.minLength}`);
    }

    if (requirements.maxLength && output.length > requirements.maxLength) {
      issues.push(`Output length ${output.length} exceeds maximum ${requirements.maxLength}`);
    }

    if (requirements.requiredKeywords) {
      const missingKeywords = requirements.requiredKeywords.filter(
        keyword => !output.toLowerCase().includes(keyword.toLowerCase())
      );
      if (missingKeywords.length > 0) {
        issues.push(`Missing required keywords: ${missingKeywords.join(', ')}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const errorHandler = ErrorHandler.getInstance();