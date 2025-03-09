import { createContext, useContext, useReducer, ReactNode } from 'react';

type Agent = {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
};

type AgentState = {
  agents: Agent[];
  selectedAgent: Agent | null;
};

type AgentAction =
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'REMOVE_AGENT'; payload: string }
  | { type: 'SELECT_AGENT'; payload: Agent };

const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
};

function agentReducer(state: AgentState, action: AgentAction): AgentState {
  switch (action.type) {
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
    case 'SELECT_AGENT':
      return {
        ...state,
        selectedAgent: action.payload,
      };
    default:
      return state;
  }
}

const AgentContext = createContext<
  | {
      state: AgentState;
      dispatch: React.Dispatch<AgentAction>;
    }
  | undefined
>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  return <AgentContext.Provider value={{ state, dispatch }}>{children}</AgentContext.Provider>;
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
