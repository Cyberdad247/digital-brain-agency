import { Pipeline } from '@xenova/transformers';

export class WhisperTranscriber {
  private pipeline: Pipeline | null = null;
  private isLoading = false;

  private async loadModel() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      this.pipeline = await Pipeline.fromPretrained(
        'Xenova/whisper-small',
        'automatic-speech-recognition',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
          },
        }
      );
    } catch (error) {
      console.error('Error loading Whisper model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async transcribe(audioData: ArrayBuffer): Promise<string> {
    if (!this.pipeline) {
      await this.loadModel();
    }

    try {
      const result = await this.pipeline!.transcribe(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
      });
      return result.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  isModelLoaded(): boolean {
    return this.pipeline !== null;
  }
}

export const whisperTranscriber = new WhisperTranscriber();
