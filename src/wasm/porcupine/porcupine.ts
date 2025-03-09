import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import { PorcupineWorker } from '@picovoice/porcupine-web';

export class WakeWordDetector {
  private porcupine: PorcupineWorker | null = null;
  private isListening = false;
  private onWakeWord: (() => void) | null = null;

  async initialize(accessKey: string, keywords: string[] = ['hey computer']) {
    if (!accessKey) {
      throw new Error('Porcupine access key is required');
    }

    try {
      this.porcupine = await PorcupineWorker.create(accessKey, keywords, {
        processErrorCallback: (error: Error) => {
          console.error('Porcupine processing error:', error);
        },
      });

      await WebVoiceProcessor.init();
    } catch (error) {
      console.error('Error initializing Porcupine:', error);
      throw error;
    }
  }

  setWakeWordCallback(callback: () => void) {
    this.onWakeWord = callback;
  }

  async start() {
    if (!this.porcupine || this.isListening) return;

    try {
      await WebVoiceProcessor.subscribe(this.porcupine);
      this.isListening = true;

      this.porcupine.onKeyword = (keywordIndex: number) => {
        if (this.onWakeWord) {
          this.onWakeWord();
        }
      };
    } catch (error) {
      console.error('Error starting wake word detection:', error);
      throw error;
    }
  }

  async stop() {
    if (!this.porcupine || !this.isListening) return;

    try {
      await WebVoiceProcessor.unsubscribe(this.porcupine);
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping wake word detection:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.porcupine !== null;
  }

  dispose() {
    if (this.porcupine) {
      this.stop();
      this.porcupine.release();
      this.porcupine = null;
    }
  }
}

export const wakeWordDetector = new WakeWordDetector();
