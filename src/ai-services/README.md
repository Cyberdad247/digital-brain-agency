# AI Services Documentation

## Overview

This directory contains all AI-related services and configurations for the Digital Brain Agency platform.

## Services

### Speech Recognition

- Uses Google Cloud Speech-to-Text API
- Supports multiple languages
- Handles real-time transcription

### Text Generation

- Integrates with multiple LLM providers
- Supports context-aware responses
- Handles conversation history

### Multimodal AI

- Processes text and images
- Supports visual content analysis
- Generates image descriptions

## Setup Instructions

1. Configure Environment Variables:

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
HUGGINGFACE_API_KEY=your_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

1. Install Dependencies:

```bash
npm install @google-cloud/speech @huggingface/inference @google/generative-ai
```

1. Initialize Services:

```typescript
import { initializeAIServices } from './ai-services/init';

await initializeAIServices();
```

## API Documentation

### Speech Recognition

```typescript
import { transcribeAudio } from './speech/transcription';
```