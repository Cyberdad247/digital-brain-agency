import { FileValidationError } from '../types';

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

export function validateFileUpload(file: File, options: FileValidationOptions = {}): boolean {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/*', 'audio/*'] } = options;

  if (file.size > maxSize) {
    throw new FileValidationError('File size exceeds maximum allowed size');
  }

  if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.match(type))) {
    throw new FileValidationError('File type not allowed');
  }

  return true;
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}