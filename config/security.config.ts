import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Express } from 'express';

interface SecurityConfig {
  rateLimit: ReturnType<typeof rateLimit>;
  auth: {
    jwtSecret: string;
    tokenExpiration: string;
    refreshTokenExpiration: string;
    passwordMinLength: number;
    passwordRequirements: {
      uppercase: boolean;
      lowercase: boolean;
      numbers: boolean;
      symbols: boolean;
      minSpecialChars: number;
    };
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
  helmet: ReturnType<typeof helmet>;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const securityConfig: SecurityConfig = {
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip,
  }),

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiration: '1h',
    refreshTokenExpiration: '7d',
    passwordMinLength: 12,
    passwordRequirements: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      minSpecialChars: 2,
    },
    maxLoginAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
  },

  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    optionsSuccessStatus: 204,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    credentials: true,
  },

  helmet: helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.API_URL || 'http://localhost:8000'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: true,
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    expectCt: { enforce: true, maxAge: 30 },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }),
};

export const applySecurityMiddleware = (app: Express) => {
  app.use(securityConfig.helmet);
  app.use(securityConfig.rateLimit);
};
