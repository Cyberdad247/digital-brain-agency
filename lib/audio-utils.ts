export interface AudioValidationConfig {
  maxSizeInBytes: number;
  allowedFormats: string[];
  maxDurationInSeconds: number;
}

export const defaultAudioConfig: AudioValidationConfig = {
  maxSizeInBytes: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm'],
  maxDurationInSeconds: 60, // 1 minute
};

export class AudioValidator {
  private config: AudioValidationConfig;

  constructor(config: AudioValidationConfig = defaultAudioConfig) {
    this.config = config;
  }

  validateFormat(mimeType: string): boolean {
    return this.config.allowedFormats.includes(mimeType);
  }

  validateSize(sizeInBytes: number): boolean {
    return sizeInBytes <= this.config.maxSizeInBytes;
  }

  validateDuration(durationInSeconds: number): boolean {
    return durationInSeconds <= this.config.maxDurationInSeconds;
  }

  getValidationErrors(file: { size: number; type: string; duration?: number }): string[] {
    const errors: string[] = [];

    if (!this.validateFormat(file.type)) {
      errors.push(
        `Invalid audio format. Allowed formats: ${this.config.allowedFormats.join(', ')}`
      );
    }

    if (!this.validateSize(file.size)) {
      errors.push(
        `File size exceeds maximum limit of ${this.config.maxSizeInBytes / (1024 * 1024)}MB`
      );
    }

    if (file.duration && !this.validateDuration(file.duration)) {
      errors.push(
        `Audio duration exceeds maximum limit of ${this.config.maxDurationInSeconds} seconds`
      );
    }

    return errors;
  }
}
