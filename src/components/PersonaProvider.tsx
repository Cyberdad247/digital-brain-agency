'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { toast } from '../hooks/use-toast';

type SocialMedia = {
  platform: string;
  handle: string;
  followers: number;
  engagementRate: number;
};

type AgencyData = {
  socialMedia: SocialMedia[];
  isLoading: boolean;
  error: Error | null;
};

type PersonaAction =
  | { type: 'SET_SOCIAL_MEDIA'; payload: SocialMedia[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const initialState: AgencyData = {
  socialMedia: [],
  isLoading: false,
  error: null,
};

const PersonaContext = createContext<{
  state: AgencyData;
  dispatch: React.Dispatch<PersonaAction>;
}>({ state: initialState, dispatch: () => null });

const personaReducer = (state: AgencyData, action: PersonaAction): AgencyData => {
  switch (action.type) {
    case 'SET_SOCIAL_MEDIA':
      return {
        ...state,
        socialMedia: action.payload,
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

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(personaReducer, initialState);

  const handleError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast({
      title: 'Persona Error',
      description: error.message,
      variant: 'destructive',
    });
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 rounded-md bg-destructive/15 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Persona Error</h2>
          <p className="text-sm mb-4">{state.error?.message}</p>
        </div>
      }
      onError={handleError}
    >
      <PersonaContext.Provider value={{ state, dispatch }}>{children}</PersonaContext.Provider>
    </ErrorBoundary>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return {
    socialMedia: context.state.socialMedia,
    isLoading: context.state.isLoading,
    error: context.state.error,
    setSocialMedia: (socialMedia: SocialMedia[]) => {
      context.dispatch({ type: 'SET_LOADING', payload: true });
      try {
        context.dispatch({ type: 'SET_SOCIAL_MEDIA', payload: socialMedia });
      } catch (error) {
        context.dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to update social media'),
        });
      } finally {
        context.dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
  };
};
