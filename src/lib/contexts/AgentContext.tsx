import React, { createContext, useContext, useReducer } from 'react';

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
};

type AgentAction =
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'REMOVE_AGENT'; payload: string }
  | { type: 'SET_ACTIVE_AGENT'; payload: string }
  | { type: 'UPDATE_AGENT'; payload: Agent };

const initialState: AgentState = {
  agents: [],
  activeAgentId: null,
};

const AgentContext = createContext<{
  state: AgentState;
  dispatch: React.Dispatch<AgentAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const agentReducer = (state: AgentState, action: AgentAction): AgentState => {
  switch (action.type) {
    case 'ADD_AGENT':
      return {
        ...state,
        agents: [...state.agents, action.payload],
      };
    case 'REMOVE_AGENT':
      return {
        ...state,
        agents: state.agents.filter(agent => agent.id !== action.payload),
      };
    case 'SET_ACTIVE_AGENT':
      return {
        ...state,
        activeAgentId: action.payload,
      };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? action.payload : agent
        ),
      };
    default:
      return state;
  }
};

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  return (
    <AgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};
