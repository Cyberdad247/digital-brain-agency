import { WebSocket } from 'ws';

interface TashaState {
  currentPersona: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  identifiedPainPoints: string[];
  proposedSolutions: Array<{
    painPoint: string;
    solution: string;
  }>;
}

interface TashaResponse {
  text: string;
  state: TashaState;
}

class TashaWebSocketService {
  private static instance: TashaWebSocketService;
  private state: TashaState = {
    currentPersona: 'default',
    conversationHistory: [],
    identifiedPainPoints: [],
    proposedSolutions: []
  };

  private constructor() {}

  public static getInstance(): TashaWebSocketService {
    if (!TashaWebSocketService.instance) {
      TashaWebSocketService.instance = new TashaWebSocketService();
    }
    return TashaWebSocketService.instance;
  }

  public getState(): TashaState {
    return { ...this.state };
  }

  private optimizePrompt(message: string): string {
    const maxHistoryItems = 3;
    const recentHistory = this.state.conversationHistory
      .slice(-maxHistoryItems)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `Context:\n${recentHistory}\n\nCurrent message: ${message}\n\nConsider identified pain points: ${this.state.identifiedPainPoints.join(', ')}`;
  }

  private analyzePainPoints(message: string): void {
    // Simple pain point detection logic
    const painPointKeywords = ['problem', 'issue', 'challenge', 'difficult', 'trouble', 'help'];
    const words = message.toLowerCase().split(' ');
    
    const newPainPoints = painPointKeywords
      .filter(keyword => words.includes(keyword))
      .map(keyword => {
        const index = words.indexOf(keyword);
        const context = words.slice(Math.max(0, index - 3), index + 4).join(' ');
        return context;
      });

    this.state.identifiedPainPoints = [...new Set([...this.state.identifiedPainPoints, ...newPainPoints])];
  }

  private generateResponse(message: string): TashaResponse {
    // Add message to conversation history
    this.state.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Analyze for pain points
    this.analyzePainPoints(message);

    // Generate response based on current state
    const response = {
      text: `I understand your message. Based on our conversation, I've identified these key points: ${this.state.identifiedPainPoints.join(', ')}. How can I help you further?`,
      state: { ...this.state }
    };

    // Add response to conversation history
    this.state.conversationHistory.push({
      role: 'assistant',
      content: response.text,
      timestamp: new Date()
    });

    return response;
  }

  public handleMessage(message: string): TashaResponse {
    const optimizedPrompt = this.optimizePrompt(message);
    return this.generateResponse(optimizedPrompt);
  }
}

export const tashaService = TashaWebSocketService.getInstance();