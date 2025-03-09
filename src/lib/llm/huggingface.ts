import { HUGGINGFACE_CONFIG, HF_API_KEY_ENV, ERROR_MESSAGES } from '../../config/huggingface.config';

class HuggingFaceService {
  private apiKey: string;
  private requestCount: number;
  private lastRequestTime: number;

  constructor() {
    this.apiKey = process.env[HF_API_KEY_ENV] || '';
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
  }

  private async handleRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < 60000) { // 1 minute window
      if (this.requestCount >= HUGGINGFACE_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
        const waitTime = 60000 - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
      }
    } else {
      this.requestCount = 0;
    }

    this.requestCount++;
    this.lastRequestTime = now;
  }

  private async makeRequest(endpoint: string, payload: any, retryCount = 0): Promise<Response> {
    await this.handleRateLimit();

    const response = await fetch(`${HUGGINGFACE_CONFIG.API_BASE_URL}/models/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 503 && retryCount < HUGGINGFACE_CONFIG.REQUEST_CONFIG.MAX_RETRIES) {
      await new Promise(resolve => 
        setTimeout(resolve, HUGGINGFACE_CONFIG.REQUEST_CONFIG.RETRY_DELAY)
      );
      return this.makeRequest(endpoint, payload, retryCount + 1);
    }

    return response;
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.makeRequest(
        HUGGINGFACE_CONFIG.MODELS.TEXT_GENERATION,
        {
          inputs: prompt,
          parameters: { max_new_tokens: HUGGINGFACE_CONFIG.REQUEST_CONFIG.MAX_NEW_TOKENS }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || ERROR_MESSAGES.GENERATION_FAILED);
      }

      const data = await response.json();
      return data[0]?.generated_text || '';
    } catch (error) {
      console.error('Text generation error:', error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<ArrayBuffer> {
    try {
      const response = await this.makeRequest(
        HUGGINGFACE_CONFIG.MODELS.IMAGE_GENERATION,
        { inputs: prompt }
      );

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.GENERATION_FAILED);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const huggingFaceService = new HuggingFaceService();