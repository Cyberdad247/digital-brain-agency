import { SpeechClient } from '@google-cloud/speech';
import axios from 'axios';
import express from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../utils/errorHandler';

const router = express.Router();
const client = new SpeechClient();

// Validation schemas
const recognizeSchema = z.object({
  audio: z.string().min(1).startsWith('data:audio'),
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

/**
 * @route POST /api/voice/recognize
 * @description Convert audio to text using Google Speech-to-Text
 * @access Private
 */
router.post(
  '/recognize',
  asyncHandler(async (req, res) => {
    const validatedData = recognizeSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(400, 'Invalid input data', validatedData.error.issues);
    }

    const audioBytes = validatedData.data.audio.split('base64,')[1];
    if (!audioBytes) {
      throw new AppError(400, 'Invalid audio format. Base64 encoded audio is required');
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

      res.json({
        success: true,
        data: { transcription },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
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
  asyncHandler(async (req, res) => {
    const validatedData = voiceSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(400, 'Invalid input data', validatedData.error.issues);
    }

    try {
      const response = await axios.post(
        VERTEX_AI_ENDPOINT,
        { input: { text: validatedData.data.text } },
        {
          headers: {
            Authorization: `Bearer ${GOOGLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      res.status(200).json({
        success: true,
        data: response.data,
      });
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
