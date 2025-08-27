/**
 * Utility functions for handling profile-related errors
 */

export type ProfileErrorType = 'network' | 'authentication' | 'server' | 'validation' | 'unknown';

export interface ProfileError {
  type: ProfileErrorType;
  message: string;
  retryable: boolean;
  userFriendlyMessage: string;
  suggestedAction?: string;
}

/**
 * Determines the error type based on the error message or error object
 */
export function determineProfileErrorType(error: unknown): ProfileErrorType {
  if (typeof error === 'string') {
    const lowerMessage = error.toLowerCase();

    if (lowerMessage.includes('not authenticated') || lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
      return 'authentication';
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection') || lowerMessage.includes('timeout')) {
      return 'network';
    }
    if (lowerMessage.includes('server') || lowerMessage.includes('internal') || lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503')) {
      return 'server';
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('400')) {
      return 'validation';
    }
  }

  if (error instanceof Error) {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();

    if (errorName.includes('network') || errorMessage.includes('fetch')) {
      return 'network';
    }
    if (errorName.includes('auth') || errorMessage.includes('unauthorized')) {
      return 'authentication';
    }
  }

  return 'unknown';
}

/**
 * Creates a structured error object for profile operations
 */
export function createProfileError(error: unknown): ProfileError {
  const type = determineProfileErrorType(error);
  const originalMessage = error instanceof Error ? error.message : String(error);

  const errorConfig: Record<ProfileErrorType, Omit<ProfileError, 'message'>> = {
    network: {
      type: 'network',
      retryable: true,
      userFriendlyMessage: 'Unable to connect to the server. Please check your internet connection.',
      suggestedAction: 'Check your internet connection and try again.'
    },
    authentication: {
      type: 'authentication',
      retryable: false,
      userFriendlyMessage: 'You need to be logged in to view your profile.',
      suggestedAction: 'Please sign in to continue.'
    },
    server: {
      type: 'server',
      retryable: true,
      userFriendlyMessage: 'Our servers are experiencing issues. Please try again in a few moments.',
      suggestedAction: 'Wait a moment and try again.'
    },
    validation: {
      type: 'validation',
      retryable: false,
      userFriendlyMessage: 'There was an issue with your profile data.',
      suggestedAction: 'Please check your information and try again.'
    },
    unknown: {
      type: 'unknown',
      retryable: true,
      userFriendlyMessage: 'An unexpected error occurred while loading your profile.',
      suggestedAction: 'Please try again or contact support if the problem persists.'
    }
  };

  return {
    ...errorConfig[type],
    message: originalMessage
  };
}

/**
 * Determines if an error should trigger an automatic retry
 */
export function shouldAutoRetry(error: ProfileError, retryCount: number): boolean {
  const maxRetries = 2;

  if (retryCount >= maxRetries) {
    return false;
  }

  // Only auto-retry network and server errors
  return error.retryable && (error.type === 'network' || error.type === 'server');
}

/**
 * Calculates the delay before retrying (exponential backoff)
 */
export function getRetryDelay(retryCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds

  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

  // Add some jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;

  return delay + jitter;
}

/**
 * Logs profile errors for debugging and monitoring
 */
export function logProfileError(error: ProfileError, context?: Record<string, unknown>): void {
  const logData = {
    timestamp: new Date().toISOString(),
    errorType: error.type,
    message: error.message,
    retryable: error.retryable,
    context
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Profile Error:', logData);
  }

  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(logData);
}