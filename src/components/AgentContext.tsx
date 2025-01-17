import React, { createContext, useContext, ReactNode } from 'react';

type Agent = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
};

type AgentContextType = {
  agents: Agent[];
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  removeAgent: (id: string) => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = React.useState<Agent[]>([]);

  const addAgent = (agent: Omit<Agent, 'id'>) => {
    setAgents(prev => [
      ...prev,
      {
        ...agent,
        id: Math.random().toString(36).substring(2, 9),
      },
    ]);
  };

  const removeAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AgentContext.Provider value={{ agents, addAgent, removeAgent }}>
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
