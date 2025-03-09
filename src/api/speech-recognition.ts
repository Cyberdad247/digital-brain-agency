import { NextApiRequest, NextApiResponse } from 'next';
import { SpeechClient } from '@google-cloud/speech';
import { supabase } from '../lib/supabase';
import { createClient, RedisClientType } from 'redis';
import crypto from 'crypto';
import { createRateLimiter } from '../lib/rate-limit';
import { Pool } from 'generic-pool';

// Initialize Redis connection pool
const redisPool = new Pool<RedisClientType>(
  {
    create: async () => {
      const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });
      await client.connect();
      return client;
    },
    destroy: async (client) => {
      await client.quit();
    },
  },
  {
    min: 2, // Minimum number of connections
    max: 10, // Maximum number of connections
    acquireTimeoutMillis: 5000,
  }
);

// Initialize Speech Client
const speechClient = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Create rate limiter using the speech configuration
const rateLimiter = createRateLimiter({
  points: 50, // 50 requests
  duration: 3600, // per hour
  blockDuration: 1800, // Block for 30 minutes if exceeded
});

// Create authenticated rate limiter with stricter limits
const authRateLimiter = createRateLimiter({
  points: 100, // 100 requests
  duration: 3600 * 24, // per day
  blockDuration: 3600, // Block for 1 hour if exceeded
});

// Types for better type safety
type TranscriptionResult = {
  alternatives?: Array<{
    transcript?: string;
    confidence?: number;
  }>;
};

type AudioConfig = {
  encoding: 'LINEAR16';
  sampleRateHertz: number;
  languageCode: string;
  enableAutomaticPunctuation: boolean;
  model?: string;
};

// Validate audio input efficiently
async function validateAudioInput(audio: unknown): Promise<string | null> {
  if (!audio || typeof audio !== 'string') {
    return 'Missing or invalid audio data';
  }

  if (!audio.startsWith('data:audio/')) {
    return 'Invalid audio format';
  }

  // Calculate base64 length without creating buffer
  const base64Data = audio.split('base64,')[1];
  if (!base64Data) {
    return 'Invalid base64 format';
  }

  // Check size based on base64 length (4 chars = 3 bytes)
  const approximateSize = (base64Data.length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (approximateSize > maxSize) {
    return 'Audio file too large (max 10MB)';
  }

  return null;
}

// Process transcription results
function processResults(results: TranscriptionResult[]): string {
  return results
    .flatMap((result) => result.alternatives?.[0]?.transcript || '')
    .filter(Boolean)
    .join('\n');
}

// Store transcription in Supabase with rate limiting
async function storeTranscription(token: string, content: string, language: string): Promise<void> {
  const userId = token.replace('Bearer ', '');

  try {
    // Apply rate limit for authenticated operations
    await authRateLimiter.consume(userId);

    const { data: { user }, error } = await supabase.auth.getUser(userId);

    if (!user || error) {
      throw new Error('Authentication failed');
    }

    const { error: dbError } = await supabase.from('transcriptions').insert({
      user_id: user.id,
      content,
      length: content.length,
      language,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      throw new Error('Failed to store transcription');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('Daily transcription limit exceeded');
    }
    throw error;
  }
}

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let redisClient = null;

  try {
    // Check rate limit
    try {
      await rateLimiter.consume(req.ip);
    } catch (error) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Please try again later',
      });
      return;
    }

    // Validate request method
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Validate input
    const { audio, language = 'en-US' } = req.body;
    const validationError = await validateAudioInput(audio);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    // Generate cache key
    const audioHash = crypto.createHash('sha256').update(audio).digest('hex');

    // Get Redis client from pool
    redisClient = await redisPool.acquire();

    // Check cache
    const cached = await redisClient.get(audioHash);
    if (cached) {
      await redisPool.release(redisClient);
      return res.json(JSON.parse(cached));
    }

    // Process audio
    const audioBuffer = Buffer.from(audio.split('base64,')[1], 'base64');
    const config: AudioConfig = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: language,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    };

    const [operation] = await speechClient.longRunningRecognize({
      audio: { content: audioBuffer },
      config,
    });

    const [response] = await operation.promise();

    if (!response.results?.length) {
      await redisPool.release(redisClient);
      res.status(422).json({ error: 'No speech recognized' });
      return;
    }

    const transcription = processResults(response.results);

    // Store transcription if authenticated
    if (req.headers.authorization) {
      try {
        await storeTranscription(req.headers.authorization, transcription, language);
      } catch (error) {
        if (error instanceof Error && error.message === 'Daily transcription limit exceeded') {
          res.status(429).json({ error: error.message });
          return;
        }
        throw error;
      }
    }

    const result = {
      success: true,
      data: {
        transcription,
        language,
        duration: audioBuffer.length / (16000 * 2), // Approximate duration in seconds
        confidence: response.results[0]?.alternatives?.[0]?.confidence || 0,
      },
    };

    // Cache result for 24 hours
    await redisClient.set(audioHash, JSON.stringify(result), {
      EX: 24 * 60 * 60, // 24 hours in seconds
    });

    await redisPool.release(redisClient);
    res.status(200).json(result);
  } catch (error) {
    // Release Redis client if it was acquired
    if (redisClient) {
      await redisPool.release(redisClient);
    }

    console.error('Speech processing error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        res.status(429).json({ error: 'API quota exceeded' });
        return;
      }
      if (error.message === 'Authentication failed') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
    }

    // Generic error response
    res.status(500).json({
      error: 'Processing failed',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    });
  }
}
