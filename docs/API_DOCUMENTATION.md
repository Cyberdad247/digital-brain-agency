# Tasha Voice Chatbot API Documentation

## Overview

This document provides comprehensive documentation for the Tasha Voice Chatbot API. The API enables developers to integrate Tasha's voice capabilities into their applications, providing functionalities such as greeting generation, pain point identification, solution proposals, and follow-up scheduling.

## Base URL

```
https://api.digital-brain-agency.com/v1
```

## Authentication

All API requests require an API key to be included in the header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### 1. Generate Greeting

Generates an optimized greeting using Tasha's persona.

- **URL**: `/greeting`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "user_id": "string",
    "language": "string",  // Optional, defaults to "English"
    "context": "string"   // Optional, defaults to "customer_service"
  }
  ```
- **Response**:
  ```json
  {
    "greeting": "string",
    "voice_url": "string",  // URL to the voice file
    "session_id": "string"
  }
  ```
- **Status Codes**:
  - `200 OK`: Successful operation
  - `400 Bad Request`: Invalid parameters
  - `401 Unauthorized`: Invalid API key
  - `500 Internal Server Error`: Server error

### 2. Identify Pain Points

Generates an optimized prompt for identifying pain points.

- **URL**: `/identify-pain-points`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "user_input": "string",
    "context": "string"  // Optional, defaults to "problem_solving"
  }
  ```
- **Response**:
  ```json
  {
    "prompt": "string",
    "voice_url": "string",
    "identified_pain_points": ["string"],
    "confidence_score": "number"
  }
  ```
- **Status Codes**:
  - `200 OK`: Successful operation
  - `400 Bad Request`: Invalid parameters
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Session not found
  - `500 Internal Server Error`: Server error

### 3. Propose Solutions

Generates an optimized prompt for proposing solutions based on identified pain points.

- **URL**: `/propose-solutions`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "pain_points": ["string"],
    "context": "string"  // Optional, defaults to "sales"
  }
  ```
- **Response**:
  ```json
  {
    "prompt": "string",
    "voice_url": "string",
    "solutions": [
      {
        "title": "string",
        "description": "string",
        "product": "string",
        "roi_estimate": "string"
      }
    ]
  }
  ```
- **Status Codes**:
  - `200 OK`: Successful operation
  - `400 Bad Request`: Invalid parameters
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Session not found
  - `500 Internal Server Error`: Server error

### 4. Schedule Follow-up

Generates an optimized prompt for scheduling follow-ups and creates a follow-up appointment.

- **URL**: `/schedule-followup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "user_id": "string",
    "preferred_date": "string",  // ISO 8601 format
    "preferred_time": "string",  // HH:MM format
    "timezone": "string",       // e.g., "America/New_York"
    "context": "string"        // Optional, defaults to "automation"
  }
  ```
- **Response**:
  ```json
  {
    "prompt": "string",
    "voice_url": "string",
    "appointment": {
      "id": "string",
      "date": "string",
      "time": "string",
      "timezone": "string",
      "calendar_link": "string"
    }
  }
  ```
- **Status Codes**:
  - `200 OK`: Successful operation
  - `400 Bad Request`: Invalid parameters
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Session not found
  - `409 Conflict`: Time slot not available
  - `500 Internal Server Error`: Server error

### 5. Process User Input

Processes user input and generates an appropriate response based on the conversation context.

- **URL**: `/process-input`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "session_id": "string",
    "user_input": "string",
    "context": "string"  // Optional
  }
  ```
- **Response**:
  ```json
  {
    "response": "string",
    "voice_url": "string",
    "intent": "string",
    "next_action": "string"
  }
  ```
- **Status Codes**:
  - `200 OK`: Successful operation
  - `400 Bad Request`: Invalid parameters
  - `401 Unauthorized`: Invalid API key
  - `404 Not Found`: Session not found
  - `500 Internal Server Error`: Server error

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string"  // Optional
  }
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per API key. If you exceed this limit, you will receive a `429 Too Many Requests` response.

## Webhooks

You can configure webhooks to receive notifications for various events:

- **URL**: `/webhooks`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "url": "string",
    "events": ["string"],  // e.g., ["greeting.created", "followup.scheduled"]
    "secret": "string"    // Optional, for webhook signature verification
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "url": "string",
    "events": ["string"]
  }
  ```

## SDK Examples

### Python

```python
from tasha_client import TashaClient

# Initialize client
client = TashaClient(api_key="YOUR_API_KEY")

# Generate greeting
greeting = client.generate_greeting(user_id="user123")
print(greeting["greeting"])

# Identify pain points
pain_points = client.identify_pain_points(
    session_id=greeting["session_id"],
    user_input="I'm struggling with digital marketing for my small business"
)
print(pain_points["identified_pain_points"])

# Propose solutions
solutions = client.propose_solutions(
    session_id=greeting["session_id"],
    pain_points=pain_points["identified_pain_points"]
)
print(solutions["solutions"])

# Schedule follow-up
appointment = client.schedule_followup(
    session_id=greeting["session_id"],
    user_id="user123",
    preferred_date="2023-10-01",
    preferred_time="14:00",
    timezone="America/New_York"
)
print(appointment["appointment"])
```

## Changelog

### v1.0.0 (2023-09-01)
- Initial release of the Tasha Voice Chatbot API

### v1.1.0 (2023-10-15)
- Added support for multiple languages
- Improved pain point identification accuracy
- Added ROI estimates to solution proposals

## Support

For API support, please contact api-support@digital-brain-agency.com or visit our [Developer Portal](https://developers.digital-brain-agency.com).