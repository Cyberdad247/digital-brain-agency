'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { toast } from '../hooks/use-toast';

type Message = {
  id: string;
  content: string;
  timestamp: Date;
};

type ChatState = {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
};

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({ state: initialState, dispatch: () => null });

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const handleError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast({
      title: 'Chat Error',
      description: error.message,
      variant: 'destructive',
    });
  }, []);

  const addMessage = useCallback((content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 rounded-md bg-destructive/15 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Chat Error</h2>
          <p className="text-sm mb-4">{state.error?.message}</p>
        </div>
      }
      onError={handleError}
    >
      <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>
    </ErrorBoundary>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return {
    messages: context.state.messages,
    isLoading: context.state.isLoading,
    error: context.state.error,
    addMessage: (content: string) => {
      context.dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const message: Message = {
          id: crypto.randomUUID(),
          content,
          timestamp: new Date(),
        };
        context.dispatch({ type: 'ADD_MESSAGE', payload: message });
      } catch (error) {
        context.dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to add message'),
        });
      } finally {
        context.dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
  };
};
