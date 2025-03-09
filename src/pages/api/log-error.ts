import { NextApiRequest, NextApiResponse } from 'next';
import { LoggingService } from '../../lib/error/LoggingService';

interface ErrorLogData {
  error: string;
  componentStack?: string;
  timestamp: string;
  location: string;
  userAgent: string;
  environment: string;
  version: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const errorData: ErrorLogData = req.body;
    const loggingService = LoggingService.getInstance();

    await loggingService.logError(new Error(errorData.error), {
      context: 'client',
      metadata: {
        componentStack: errorData.componentStack,
        location: errorData.location,
        userAgent: errorData.userAgent,
        environment: errorData.environment,
        version: errorData.version,
      },
    });

    res.status(200).json({ message: 'Error logged successfully' });
  } catch (error) {
    console.error('Error logging failed:', error);
    res.status(500).json({ message: 'Error logging failed' });
  }
}
