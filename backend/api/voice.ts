import { SpeechClient } from '@google-cloud/speech';
import axios from 'axios';
import express, { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../utils/errorHandler';
import { securityConfig } from '../../config/security.config';
import crypto from 'crypto';
import { createClient } from 'redis';

const router: Router = express.Router();
const client = new SpeechClient();

// Initialize Redis client for caching
let redisClient: any = null;
const initRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    redisClient.on('error', (err: Error) => console.error('Redis Client Error:', err));
    await redisClient.connect();
  }
  return redisClient;
};

// Validation schemas
const recognizeSchema = z.object({
  audio: z.string().min(1).startsWith('data:audio'),
  cacheResults: z.boolean().optional().default(true),
});

const voiceSchema = z.object({
  text: z.string().min(1).max(1000),
});

// Load and validate environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const VERTEX_AI_ENDPOINT = process.env.VERTEX_AI_ENDPOINT;

if (!GOOGLE_API_KEY) {
  throw new AppError(500, 'Google API key is not set in the environment variables');
}

if (!VERTEX_AI_ENDPOINT) {
  throw new AppError(500, 'Vertex AI endpoint is not set in the environment variables');
}

// Apply rate limiting specifically for voice API
const voiceRateLimit = securityConfig.rateLimit;

// Efficient audio validation without creating unnecessary buffers
function validateAudio(audioBase64: string): void {
  if (!audioBase64) {
    throw new AppError(400, 'Invalid audio format. Base64 encoded audio is required');
  }
  
  // Calculate approximate size based on base64 length (4 chars = 3 bytes)
  const approximateSize = (audioBase64.length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (approximateSize > maxSize) {
    throw new AppError(400, 'Audio file too large (max 10MB)');
  }
}

/**
 * @route POST /api/voice/recognize
 * @description Convert audio to text using Google Speech-to-Text
 * @access Private
 */
router.post(
  '/recognize',
  voiceRateLimit,
  asyncHandler(async (req, res) => {
    const validatedData = recognizeSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(400, 'Invalid input data', validatedData.error.issues);
    }

    const audioData = validatedData.data.audio;
    const cacheResults = validatedData.data.cacheResults;
    const audioBytes = audioData.split('base64,')[1];
    
    // Validate audio efficiently
    validateAudio(audioBytes);
    
    // Check cache if enabled
    if (cacheResults) {
      try {
        const redis = await initRedis();
        const audioHash = crypto.createHash('sha256').update(audioData).digest('hex');
        const cached = await redis.get(`transcription:${audioHash}`);
        
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (redisError) {
        // Log but continue if Redis fails
        console.error('Redis cache error:', redisError);
      }
    }

    const audioRequest = { content: audioBytes };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    };

    try {
      const [response] = await client.recognize({ audio: audioRequest, config });

      if (!response.results || response.results.length === 0) {
        throw new AppError(422, 'Could not transcribe the audio');
      }

      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');

      const result = {
        success: true,
        data: { 
          transcription,
          confidence: response.results[0]?.alternatives[0]?.confidence || 0,
          language: config.languageCode
        },
      };
      
      // Cache result if enabled
      if (cacheResults) {
        try {
          const redis = await initRedis();
          const audioHash = crypto.createHash('sha256').update(audioData).digest('hex');
          await redis.set(`transcription:${audioHash}`, JSON.stringify(result), {
            EX: 24 * 60 * 60, // 24 hours in seconds
          });
        } catch (redisError) {
          // Log but continue if Redis fails
          console.error('Redis cache error:', redisError);
        }
      }

      res.json(result);
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      // Handle Google API specific errors
      if (error.message?.includes('quota')) {
        throw new AppError(429, 'Speech API quota exceeded');
      }
      
      throw new AppError(500, 'Speech recognition service error', error.message);
    }
  })
);

/**
 * @route POST /api/voice/voice
 * @description Convert text to speech using Vertex AI
 * @access Private
 */
router.post(
  '/voice',
  voiceRateLimit,
  asyncHandler(async (req, res) => {
    const validatedData = voiceSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(400, 'Invalid input data', validatedData.error.issues);
    }
    
    const text = validatedData.data.text;
    
    // Check cache for text-to-speech
    try {
      const redis = await initRedis();
      const textHash = crypto.createHash('sha256').update(text).digest('hex');
      const cached = await redis.get(`tts:${textHash}`);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (redisError) {
      // Log but continue if Redis fails
      console.error('Redis cache error:', redisError);
    }

    try {
      const response = await axios.post(
        VERTEX_AI_ENDPOINT,
        { input: { text } },
        {
          headers: {
            Authorization: `Bearer ${GOOGLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      
      const result = {
        success: true,
        data: response.data,
      };
      
      // Cache text-to-speech result
      try {
        const redis = await initRedis();
        const textHash = crypto.createHash('sha256').update(text).digest('hex');
        await redis.set(`tts:${textHash}`, JSON.stringify(result), {
          EX: 24 * 60 * 60, // 24 hours in seconds
        });
      } catch (redisError) {
        // Log but continue if Redis fails
        console.error('Redis cache error:', redisError);
      }

      res.status(200).json(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.status || 500,
          'Text-to-speech service error',
          error.response?.data || error.message
        );
      }
      throw new AppError(500, 'Internal server error', error.message);
    }
  })
);

export default router;
