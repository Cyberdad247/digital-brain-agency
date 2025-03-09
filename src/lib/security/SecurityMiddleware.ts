import { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../config/security.config';
import { errors } from '../error/ApiErrorHandler';

interface SecurityMiddlewareOptions {
  skipRateLimit?: boolean;
  requireAuth?: boolean;
  roles?: string[];
}

export const securityMiddleware = (options: SecurityMiddlewareOptions = {}) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Rate limiting
      if (!options.skipRateLimit) {
        const rateLimitResult = await rateLimit.consume(req.ip);
        if (!rateLimitResult.success) {
          throw errors.tooManyRequests();
        }
      }

      // Authentication check
      if (options.requireAuth) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          throw errors.unauthorized('Authentication token is required');
        }

        try {
          const decoded = await verifyToken(token);
          req.user = decoded;

          // Role-based access control
          if (options.roles?.length && !options.roles.includes(decoded.role)) {
            throw errors.forbidden('Insufficient permissions');
          }
        } catch (error) {
          throw errors.unauthorized('Invalid or expired token');
        }
      }

      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Content Security Policy
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      );

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Helper function to verify JWT tokens
const verifyToken = async (token: string) => {
  // Implement JWT verification logic here
  // This is a placeholder for the actual implementation
  return Promise.resolve({
    userId: '1',
    role: 'user',
    // Add other user properties as needed
  });
};
