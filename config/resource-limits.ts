import { z } from 'zod';

export const ResourceLimits = {
  vercel: {
    bandwidth: {
      limit: 100, // GB per month
      warning: 80, // Trigger warning at 80%
    },
    serverlessFunctions: {
      executionTime: 10, // seconds
      memory: 1024, // MB
      timeout: 10000, // ms
    },
    builds: {
      minutesPerMonth: 400,
      warning: 320,
    }
  },
  supabase: {
    database: {
      size: 500, // MB
      warning: 400,
    },
    storage: {
      size: 1024, // MB
      warning: 820,
    },
    bandwidth: {
      limit: 5, // GB
      warning: 4,
    },
    users: {
      monthly: 50000,
      warning: 40000,
    }
  },
  huggingface: {
    inference: {
      requestTimeout: 30, // seconds
      maxRetries: 3,
      rateLimit: {
        requests: 10,
        per: 60, // seconds
      }
    },
    imageGeneration: {
      maxResolution: {
        width: 512,
        height: 512,
      },
      cacheEnabled: true,
      cacheDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    }
  },
  github: {
    actions: {
      minutesPerMonth: 2000,
      warning: 1600,
    }
  },
  sentry: {
    eventsPerMonth: 5000,
    warning: 4000,
  }
};

// Zod schema for runtime validation
export const ResourceLimitsSchema = z.object({
  vercel: z.object({
    bandwidth: z.object({
      limit: z.number(),
      warning: z.number(),
    }),
    serverlessFunctions: z.object({
      executionTime: z.number(),
      memory: z.number(),
      timeout: z.number(),
    }),
    builds: z.object({
      minutesPerMonth: z.number(),
      warning: z.number(),
    })
  }),
  supabase: z.object({
    database: z.object({
      size: z.number(),
      warning: z.number(),
    }),
    storage: z.object({
      size: z.number(),
      warning: z.number(),
    }),
    bandwidth: z.object({
      limit: z.number(),
      warning: z.number(),
    }),
    users: z.object({
      monthly: z.number(),
      warning: z.number(),
    })
  }),
  huggingface: z.object({
    inference: z.object({
      requestTimeout: z.number(),
      maxRetries: z.number(),
      rateLimit: z.object({
        requests: z.number(),
        per: z.number(),
      })
    }),
    imageGeneration: z.object({
      maxResolution: z.object({
        width: z.number(),
        height: z.number(),
      }),
      cacheEnabled: z.boolean(),
      cacheDuration: z.number(),
    })
  }),
  github: z.object({
    actions: z.object({
      minutesPerMonth: z.number(),
      warning: z.number(),
    })
  }),
  sentry: z.object({
    eventsPerMonth: z.number(),
    warning: z.number(),
  })
});

// Validate the resource limits at runtime
ResourceLimitsSchema.parse(ResourceLimits);

export type ResourceLimitsType = z.infer<typeof ResourceLimitsSchema>;