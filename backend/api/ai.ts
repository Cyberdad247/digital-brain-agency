import { Request, Response } from 'express';
import { AIRequest, AIResponse, AIError } from '../types/ai.js';
import { Persona } from '../types/persona.js';

export default async function handler(req: Request, res: Response<AIResponse | AIError>) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const inputData = req.body as AIRequest;

      if (!inputData.persona) {
        return res.status(400).json({
          error: 'Persona is required',
          statusCode: 400,
        });
      }

      const persona: Persona = await import(`../personas/${inputData.persona}.json`);

      const aiEndpoint = process.env.AI_ENDPOINT;
      if (!aiEndpoint) {
        throw new Error('AI_ENDPOINT environment variable is required');
      }

      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inputData,
          persona,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
      }

      const result: AIResponse = await response.json();
      return res.status(200).json(result);
    } catch (error: unknown) {
      console.error('AI processing error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        error: `Failed to process AI request: ${message}`,
        statusCode: 500,
      });
    }
  }

  return res.status(405).json({
    error: 'Method not allowed',
    statusCode: 405,
  });
}
