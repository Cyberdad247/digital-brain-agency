import { AgentData, CreateAgentResponse } from '../types/agentTypes';

interface UseAgentReturn {
  createAgent: (agentData: AgentData) => Promise<CreateAgentResponse>;
  loading: boolean;
  error: string | null;
}

declare const useAgent: () => UseAgentReturn;

export default useAgent;
