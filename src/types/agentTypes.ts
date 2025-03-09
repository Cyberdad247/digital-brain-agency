export interface Department {
  id: string;
  name: string;
}

export interface ValidationErrors {
  name?: string;
  specialization?: string;
  department?: string;
}

export interface AgentData {
  name: string;
  specialization: string;
  department: string;
}

export interface CreateAgentResponse {
  success: boolean;
  message?: string;
  agentId?: string;
}
