export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  department: 'creative' | 'strategy' | 'analytics' | 'client_services';
  capacity: number;
  tasks: Task[];
  projects: Project[];
  demographics: string;
  voice: string;
  knowledge: string[];
  tone: string;
  emotion: string;
  competenceMaps: {
    core: string[];
    secondary: string[];
    tertiary: string[];
    support: string[];
  };
}
