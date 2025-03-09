import { HfInference } from '@huggingface/inference';
import {
  hf,
  DEFAULT_MODEL_CONFIG,
  TASK_MODELS,
  ERROR_HANDLING,
} from '../config/huggingface.config';

export class LLMService {
  private static instance: LLMService;
  private retryCount: number = 0;

  private constructor() {}

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async generateText(prompt: string, options = DEFAULT_MODEL_CONFIG) {
    try {
      const response = await hf.textGeneration({
        model: options.model,
        inputs: prompt,
        parameters: {
          temperature: options.temperature,
          max_length: options.max_length,
          top_p: options.top_p,
          repetition_penalty: options.repetition_penalty,
        },
      });
      return response;
    } catch (error) {
      if (this.retryCount < ERROR_HANDLING.maxRetries) {
        this.retryCount++;
        await new Promise((resolve) => setTimeout(resolve, ERROR_HANDLING.retryDelay));
        return this.generateText(prompt, options);
      }
      throw error;
    }
  }

  async summarize(text: string) {
    try {
      const response = await hf.summarization({
        model: TASK_MODELS.summarization,
        inputs: text,
      });
      return response;
    } catch (error) {
      console.error('Summarization error:', error);
      throw error;
    }
  }

  async answerQuestion(context: string, question: string) {
    try {
      const response = await hf.questionAnswering({
        model: TASK_MODELS.questionAnswering,
        inputs: {
          context,
          question,
        },
      });
      return response;
    } catch (error) {
      console.error('Question answering error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string) {
    try {
      const response = await hf.textGeneration({
        model: TASK_MODELS.codeGeneration,
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.5,
          top_p: 0.95,
        },
      });
      return response;
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  resetRetryCount() {
    this.retryCount = 0;
  }
}

export const llmService = LLMService.getInstance();
