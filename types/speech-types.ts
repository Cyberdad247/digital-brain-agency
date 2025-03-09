export interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
  resultIndex: number;
  timestamp: number;
}

export interface AudioRecordingOptions {
  sampleRate: number;
  channels: number;
  mimeType: string;
}

export interface TranscriptionRequest {
  audio: Blob;
  config: SpeechRecognitionConfig;
}

export interface TranscriptionResponse {
  results: SpeechRecognitionResult[];
  error?: SpeechRecognitionError;
}
