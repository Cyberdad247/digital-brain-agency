import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string; // Add support for image URLs in conversation history
}

export interface PainPoint {
  id: string;
  description: string;
  context: string;
  timestamp: Date;
}

export interface Solution {
  painPointId: string;
  description: string;
  timestamp: Date;
}

export interface GeminiState {
  currentPersona: string;
  conversationHistory: ConversationMessage[];
  identifiedPainPoints: PainPoint[];
  proposedSolutions: Solution[];
}

export interface GeminiResponse {
  text: string;
  state: GeminiState;
}

class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private visionModel: GenerativeModel;
  private state: GeminiState = {
    currentPersona: 'default',
    conversationHistory: [],
    identifiedPainPoints: [],
    proposedSolutions: []
  };

  private constructor() {
    // Initialize with API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_KEY || '';
    if (!apiKey) {
      console.warn('VITE_GEMINI_KEY environment variable not set. Gemini API will not function properly.');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public getState(): GeminiState {
    return { ...this.state };
  }

  private buildPrompt(message: string): string {
    // Get recent conversation history for context
    const maxHistoryItems = 5; // Increased from 3 to provide more context
    const recentHistory = this.state.conversationHistory
      .slice(-maxHistoryItems)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Include pain points and solutions in the prompt for better context
    const painPoints = this.state.identifiedPainPoints
      .map(pp => pp.description)
      .join(', ');

    const solutions = this.state.proposedSolutions
      .map(sol => {
        const painPoint = this.state.identifiedPainPoints.find(pp => pp.id === sol.painPointId);
        return `${painPoint?.description || 'Issue'}: ${sol.description}`;
      })
      .join('\n');

    return `
      You are a helpful AI assistant named Tasha. Your goal is to understand the user's needs and provide helpful responses.
      
      Conversation history:
      ${recentHistory}
      
      Identified pain points: ${painPoints || 'None yet'}
      
      Proposed solutions:
      ${solutions || 'None yet'}
      
      Current message: ${message}
      
      Respond in a helpful, concise, and friendly manner. If you identify any new pain points or can suggest solutions, include them in your response.
    `;
  }

  private analyzePainPoints(message: string, response: string): void {
    // More sophisticated pain point detection
    const painPointKeywords = [
      'problem', 'issue', 'challenge', 'difficult', 'trouble', 'help',
      'stuck', 'confused', 'error', 'bug', 'not working', 'failed'
    ];
    
    const words = message.toLowerCase().split(' ');
    
    const newPainPoints = painPointKeywords
      .filter(keyword => message.toLowerCase().includes(keyword))
      .map(keyword => {
        const index = words.indexOf(keyword);
        const context = words
          .slice(Math.max(0, index - 5), Math.min(words.length, index + 6))
          .join(' ');
        
        return {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          description: `Issue related to ${keyword}`,
          context,
          timestamp: new Date()
        };
      });

    if (newPainPoints.length > 0) {
      // Filter out duplicates based on context similarity
      const uniquePainPoints = newPainPoints.filter(newPP => {
        return !this.state.identifiedPainPoints.some(existingPP => 
          this.calculateSimilarity(newPP.context, existingPP.context) > 0.7
        );
      });
      
      this.state.identifiedPainPoints = [
        ...this.state.identifiedPainPoints,
        ...uniquePainPoints
      ];
    }
  }

  // Simple text similarity function
  private calculateSimilarity(text1: string, text2: string): number {
    const set1 = new Set(text1.toLowerCase().split(' '));
    const set2 = new Set(text2.toLowerCase().split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  public async handleMessage(message: string, imageBase64?: string | null): Promise<GeminiResponse> {
    // Add user message to conversation history
    this.state.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
      imageUrl: imageBase64 || undefined
    });

    try {
      let responseText: string;
      
      if (imageBase64) {
        // Handle multimodal input (text + image)
        const imageParts = [
          {
            inlineData: {
              data: imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
              mimeType: imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
            }
          },
          { text: message }
        ];
        
        const result = await this.visionModel.generateContent(imageParts);
        responseText = result.response.text();
      } else {
        // Text-only input
        const prompt = this.buildPrompt(message);
        const result = await this.model.generateContent(prompt);
        responseText = result.response.text();
      }
      
      // Analyze for pain points
      this.analyzePainPoints(message, responseText);
      
      // Add assistant response to conversation history
      this.state.conversationHistory.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      });
      
      return {
        text: responseText,
        state: { ...this.state }
      };
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      
      // Fallback response in case of API failure
      const fallbackResponse = "I'm sorry, I'm having trouble processing your request right now. Could you try again in a moment?";
      
      this.state.conversationHistory.push({
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      });
      
      return {
        text: fallbackResponse,
        state: { ...this.state }
      };
    }
  }
}

export const geminiService = GeminiService.getInstance();
