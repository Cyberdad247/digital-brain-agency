'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useError } from '../../components/ErrorProvider';

type Agent = {
  id: string;
  name: string;
  llmConfig: LLMConfig;
  status: 'active' | 'inactive' | 'busy';
  department: string;
};

type LLMConfig = {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
};

type AgentState = {
  agents: Agent[];
  activeAgentId: string | null;
  isLoading: boolean;
};

type AgentAction =
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'REMOVE_AGENT'; payload: string }
  | { type: 'SET_ACTIVE_AGENT'; payload: string }
  | { type: 'UPDATE_AGENT'; payload: Agent }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AgentState = {
  agents: [],
  activeAgentId: null,
  isLoading: false,
};

const AgentContext = createContext<{
  state: AgentState;
  dispatch: React.Dispatch<AgentAction>;
}>({ state: initialState, dispatch: () => null });

const agentReducer = (state: AgentState, action: AgentAction): AgentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ADD_AGENT':
      return {
        ...state,
        agents: [...state.agents, action.payload],
      };
    case 'REMOVE_AGENT':
      return {
        ...state,
        agents: state.agents.filter((agent) => agent.id !== action.payload),
      };
    case 'SET_ACTIVE_AGENT':
      return {
        ...state,
        activeAgentId: action.payload,
      };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === action.payload.id ? action.payload : agent
        ),
      };
    default:
      return state;
  }
};

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, initialState);
  const { setError } = useError();

  return (
    <ErrorBoundary onError={(error, errorInfo) => setError(error, errorInfo)}>
      <AgentContext.Provider value={{ state, dispatch }}>{children}</AgentContext.Provider>
    </ErrorBoundary>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};
