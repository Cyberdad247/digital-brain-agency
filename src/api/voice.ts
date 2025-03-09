import { NextApiRequest, NextApiResponse } from 'next';
import { SpeechClient } from '@google-cloud/speech';
import { supabase } from '../lib/supabase';
import rateLimit from '../../lib/rate-limit';
import { createClient } from 'redis';
import crypto from 'crypto';

// Define types for better type safety
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
  model: string;
  alternativeLanguageCodes?: string[];
};

// Initialize Redis client
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error:', err));

// Initialize rate limiter (15 requests per minute)
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Initialize streaming recognition
async function handleStreamingRecognition(
  audioStream: Buffer,
  config: AudioConfig
): Promise<string> {
  return new Promise((resolve, reject) => {
    let transcription = '';

    const recognizeStream = speechClient.streamingRecognize({
      config,
      interimResults: true,
    });

    // Handle streaming recognition results
    recognizeStream.on('data', (data) => {
      const result = data.results[0];
      if (result && result.alternatives[0]) {
        const transcript = result.alternatives[0].transcript;
        if (result.isFinal) {
          transcription = transcript;
        }
      }
    });

    recognizeStream.on('error', (error) => {
      console.error('Streaming recognition error:', error);
      reject(error);
    });

    recognizeStream.on('end', () => {
      resolve(transcription);
    });

    // Write audio data to stream
    recognizeStream.write(audioStream);
    recognizeStream.end();
  });
}

// Reusable configuration
const recognitionConfig: AudioConfig = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
  enableAutomaticPunctuation: true,
  model: 'latest_long',
  alternativeLanguageCodes: ['en-US', 'en-GB', 'en-AU'],
};

// Helper functions
async function storeTranscription(token: string, content: string): Promise<void> {
  const { data: user, error } = await supabase.auth.getUser(token.replace('Bearer ', ''));

  if (!user?.user || error) {
    throw new Error('Invalid authentication');
  }

  // Send processing notification email if user has email
  if (user.user.email) {
    try {
      await sendProcessingEmail(user.user.email);
    } catch (emailError) {
      console.error('Failed to send processing email:', emailError);
      // Continue with transcription even if email fails
    }
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    throw new Error('Empty transcription content');
  }

  const { error: dbError } = await supabase.from('transcriptions').insert({
    user_id: user.user.id,
    content,
    length: content.trim().length,
    language: config.languageCode,
    confidence: calculateAverageConfidence(response.results),
    processed_at: new Date().toISOString(),
    metadata: {
      model: config.model,
      sampleRateHertz: config.sampleRateHertz,
      alternativeLanguageCodes: config.alternativeLanguageCodes,
    },
  });

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to store transcription');
  }
}

function calculateAverageConfidence(results: TranscriptionResult[]): number {
  const confidences = results
    .flatMap((r) => r.alternatives?.map((a) => a.confidence || 0) || [])
    .filter((c) => c > 0);

  return confidences.length ? confidences.reduce((a, b) => a + b) / confidences.length : 0;
}

async function validateAudioInput(audio: unknown): Promise<string | null> {
  if (!audio || typeof audio !== 'string') return 'Missing or invalid audio data';
  if (!audio.startsWith('data:audio/')) return 'Invalid audio format';
  if (audio.length > 10 * 1024 * 1024) return 'Audio too large (max 10MB)';

  try {
    const audioData = Buffer.from(audio.split('base64,')[1], 'base64');
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
    const maxDuration = 300; // 5 minutes

    if (audioBuffer.duration > maxDuration) {
      return `Audio too long (max ${maxDuration} seconds)`;
    }

    return null;
  } catch (error) {
    console.error('Error validating audio duration:', error);
    return 'Invalid audio format or corrupted audio data';
  }
}

function handleError(error: unknown, res: NextApiResponse): void {
  console.error(`API Error: ${error instanceof Error ? error.message : error}`);

  if (error instanceof Error) {
    if (error.message.includes('quota')) {
      res.status(429).json({ error: 'Speech API quota exceeded' });
      return;
    }
    if (error.message === 'Invalid authentication') {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      details: error instanceof Error ? error.message : 'Unknown error',
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    // Apply rate limiting
    await limiter.check(res, 15, 'CACHE_TOKEN');

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Validate input structure
    const { audio, language } = req.body;
    const validationError = await validateAudioInput(audio);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    // Generate hash for caching
    const audioHash = crypto.createHash('sha256').update(audio).digest('hex');

    // Check cache first
    const cached = await redis.get(audioHash);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Process audio
    const audioBuffer = Buffer.from(audio.split('base64,')[1], 'base64');

    // Update config with optional language parameter
    const config: AudioConfig = language
      ? { ...recognitionConfig, languageCode: language }
      : recognitionConfig;

    const [operation] = await speechClient.longRunningRecognize({
      audio: { content: audioBuffer },
      config,
    });

    const [response] = await operation.promise();

    if (!response.results?.length) {
      res.status(422).json({ error: 'No speech recognized' });
      return;
    }

    // Process results
    const transcription = response.results
      .map((result) => result.alternatives?.[0]?.transcript || '')
      .filter(Boolean)
      .join('\n');

    // Store transcription if authenticated
    if (req.headers.authorization) {
      await storeTranscription(req.headers.authorization, transcription);
    }

    const result = {
      success: true,
      data: {
        transcription,
        confidence: calculateAverageConfidence(response.results),
        language: config.languageCode,
      },
    };

    // Cache the result for 24 hours
    await redis.set(audioHash, JSON.stringify(result), {
      EX: 24 * 60 * 60, // 24 hours in seconds
    });

    res.status(200).json({
      success: true,
      data: {
        transcription,
        confidence: calculateAverageConfidence(response.results),
        language: config.languageCode,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
}
