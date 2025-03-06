import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

/**
 * General server routes
 * Handles various server-related endpoints
 */

/**
 * Health check endpoint
 * Used to verify the server is running properly
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: process.env.APP_VERSION || '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Server status endpoint
 * Provides more detailed information about the server status
 */
router.get('/status', (req: Request, res: Response) => {
  // This would typically include more detailed metrics about the server
  // Such as memory usage, uptime, active connections, etc.
  res.json({
    success: true,
    data: {
      status: 'operational',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Configuration endpoint
 * Returns public configuration settings
 */
router.get('/config', (req: Request, res: Response) => {
  // Only return non-sensitive configuration information
  res.json({
    success: true,
    data: {
      features: {
        voiceEnabled: true,
        chatEnabled: true,
        analyticsEnabled: true,
      },
      limits: {
        maxUploadSize: '10MB',
        maxRequestsPerMinute: 60,
      },
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;