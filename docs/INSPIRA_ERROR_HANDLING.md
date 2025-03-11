# Inspira Staff Error Handling System

This document explains how to use the Inspira staff personas for enhanced error handling in your application.

## Overview

The Inspira staff error handling system leverages the unique skills of our AI personas to provide enhanced error detection, categorization, and resolution:

- **Zara "Muse" Kapoor** - Optimizes error messages for clarity and better user understanding
- **Darius "Code" Laurent** - Analyzes code patterns to identify potential error sources
- **Marta "Debug" Silva** - Categorizes errors and suggests optimization strategies
- **Ryota "Coda" Varella** - Creates compressed symbolic representations of errors for efficient logging

## Components

### 1. InspiraErrorHandler

The core class that integrates all Inspira staff capabilities for error handling.

```typescript
import { InspiraErrorHandler } from '@/lib/error/InspiraErrorHandler';

// Get the singleton instance
const inspiraHandler = InspiraErrorHandler.getInstance();

// Handle an error with Inspira staff capabilities
try {
  // Your code that might throw an error
} catch (error) {
  const enhancedError = await inspiraHandler.handleError(error, 'yourContext', {
    // Additional metadata
    userId: 'user123',
    action: 'createResource',
  });
  
  console.log(enhancedError.optimizedMessage); // Zara's enhanced message
  console.log(enhancedError.symbolicRepresentation); // Ryota's symbolic representation
  console.log(enhancedError.category); // Marta's error categorization
  console.log(enhancedError.suggestions); // Marta's optimization suggestions
}
```

### 2. InspiraErrorMiddleware

Middleware for handling API errors with Inspira staff capabilities.

```typescript
// In your API route
import { inspiraErrorMiddleware } from '@/middleware/inspira-error-middleware';

export async function GET(request: Request) {
  try {
    // Your API logic
  } catch (error) {
    // Let Inspira staff handle the error
    return inspiraErrorMiddleware(request, error);
  }
}
```

### 3. InspiraErrorBoundary

React error boundary component that uses Inspira staff capabilities.

```tsx
import { InspiraErrorBoundary } from '@/components/InspiraErrorBoundary';

function YourComponent() {
  return (
    <InspiraErrorBoundary context="userProfile">
      {/* Your component content */}
    </InspiraErrorBoundary>
  );
}
```

## Error Categories

The system categorizes errors into the following types:

- `validation` - Input validation errors
- `authentication` - Authentication failures
- `authorization` - Permission issues
- `network` - Network-related errors
- `database` - Database errors
- `external_service` - Errors from external services
- `rate_limit` - Rate limiting errors
- `business_logic` - Application logic errors
- `system` - System-level errors

## Symbolic Representation

The system uses symbolic representations for efficient error logging and visualization:

- `☲⟨validation⟩` - Validation errors
- `🔒⟨auth⟩` - Authentication errors
- `🛡️⟨access⟩` - Authorization errors
- `🌐⟨network⟩` - Network errors
- `💾⟨data⟩` - Database errors
- `🔌⟨service⟩` - External service errors
- `⏱️⟨rate⟩` - Rate limit errors
- `🧩⟨logic⟩` - Business logic errors
- `⚙️⟨system⟩` - System errors

Severity indicators:
- `💀` - Critical
- `🔥` - High
- `⚠️` - Medium
- `📝` - Low

## Best Practices

1. **Provide Context**: Always provide a context string when calling `handleError()` to help Zara optimize the error message.

2. **Include Metadata**: Add relevant metadata to help with error analysis and debugging.

3. **Use Appropriate Components**: Use `InspiraErrorBoundary` for React components and `inspiraErrorMiddleware` for API routes.

4. **Check Suggestions**: Review the optimization suggestions provided by Marta to improve your code.

5. **Monitor Symbolic Patterns**: Watch for recurring symbolic patterns in your logs to identify systemic issues.

## Example: Full API Route with Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { inspiraErrorMiddleware } from '@/middleware/inspira-error-middleware';
import { AppError } from '@/lib/error/AppError';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw AppError.validation('User ID is required');
    }
    
    // Fetch user data (example)
    const userData = await fetchUserData(userId);
    
    if (!userData) {
      throw AppError.notFound(`User with ID ${userId} not found`);
    }
    
    // Return successful response
    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    // Let Inspira staff handle the error
    return inspiraErrorMiddleware(request, error);
  }
}
```

## Example: React Component with Error Boundary

```tsx
import { InspiraErrorBoundary } from '@/components/InspiraErrorBoundary';
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to load user: ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        // The error will be caught by InspiraErrorBoundary
        throw error;
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Other user details */}
    </div>
  );
}

// Wrap the component with InspiraErrorBoundary
export default function UserProfileWithErrorHandling({ userId }: { userId: string }) {
  return (
    <InspiraErrorBoundary context="userProfile">
      <UserProfile userId={userId} />
    </InspiraErrorBoundary>
  );
}
```

## Conclusion

By integrating the Inspira staff personas into your error handling workflow, you can provide better error messages to users, gain deeper insights into error patterns, and improve the overall reliability of your application.