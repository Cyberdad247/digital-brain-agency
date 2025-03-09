import { z } from 'zod';

// Environment variable schema validation
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_KEY: z.string().min(1, 'Supabase key is required'),

  // Stripe Configuration
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Invalid Stripe secret key format'),

  // Google Cloud Configuration
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1, 'Google credentials path is required'),
  GOOGLE_PROJECT_ID: z.string().optional(),

  // Redis Configuration
  REDIS_URL: z.string().url('Invalid Redis URL'),

  // Optional configurations with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url().optional(),
});

// Environment configuration type
export type EnvConfig = z.infer<typeof envSchema>;

// Validate and export environment configuration
export function validateEnvConfig(): EnvConfig {
  try {
    const config = envSchema.parse(process.env);
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
}

// Export validated configuration
export const env = validateEnvConfig();

// Export specific configurations for different services
export const supabaseConfig = {
  url: env.VITE_SUPABASE_URL,
  key: env.VITE_SUPABASE_KEY,
};

export const stripeConfig = {
  secretKey: env.STRIPE_SECRET_KEY,
};

export const googleConfig = {
  credentials: env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: env.GOOGLE_PROJECT_ID,
};

export const redisConfig = {
  url: env.REDIS_URL,
};
