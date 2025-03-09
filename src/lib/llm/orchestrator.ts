import { HfInference } from '@huggingface/inference';
import { DEFAULT_MODEL_CONFIG, TASK_MODELS } from '../../config/huggingface.config';

export class LLMOrchestrator {
  private hf: HfInference;
  private ollamaEndpoint: string;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
    this.ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
  }

  async generateCode(prompt: string) {
    if (process.env.USE_CLOUD_LLM === 'true') {
      return this.generateWithHuggingFace(prompt);
    } else {
      return this.generateWithOllama(prompt);
    }
  }

  private async generateWithHuggingFace(prompt: string) {
    try {
      const response = await this.hf.textGeneration({
        model: TASK_MODELS.codeGeneration,
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
        },
      });
      return response.generated_text;
    } catch (error) {
      console.error('HuggingFace generation error:', error);
      throw error;
    }
  }

  private async generateWithOllama(prompt: string) {
    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'codellama:13b',
          prompt,
          temperature: 0.7,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama generation error:', error);
      throw error;
    }
  }

  async debugError(error: Error) {
    const context = `Error: ${error.stack}\nCode Context: ${this.getCodeSnippet()}`;
    return this.generateCode(`Fix this error:\n${context}`);
  }

  private getCodeSnippet() {
    const stack = new Error().stack;
    if (!stack) return '';

    const lines = stack.split('\n');
    // Get the calling file and line number
    const callerLine = lines[3]; // Skip Error, getCodeSnippet, and debugError frames
    const match = callerLine.match(/\((.*?):(\d+):(\d+)\)/);

    if (!match) return '';

    const [, filePath, lineNum] = match;
    try {
      const fs = require('fs');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      const lineNumber = parseInt(lineNum);

      // Get 5 lines before and after the error
      const start = Math.max(0, lineNumber - 5);
      const end = Math.min(lines.length, lineNumber + 5);

      return lines.slice(start, end).join('\n');
    } catch (error) {
      console.error('Error getting code snippet:', error);
      return '';
    }
  }
}
