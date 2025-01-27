import { createClient } from '@supabase/supabase-js';

export interface Task {
  id: string;
  name: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
}

export interface Personality {
  traits: string[];
  communicationStyle: string;
  decisionMaking: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Project {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'completed' | 'archived';
}

export interface Database {
  public: {
    Tables: {
      personas: {
        Row: {
          id: string;
          name: string;
          description: string;
          department: string;
          avatar: string | null;
          personality: Personality;
          skills: Skill[];
          availability: 'available' | 'busy' | 'unavailable';
          projects: Project[] | null;
          tasks: Task[];
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          department: string;
          avatar?: string | null;
          personality: Personality;
          skills: Skill[];
          availability: 'available' | 'busy' | 'unavailable';
          projects?: Project[] | null;
          tasks?: Task[];
          capacity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          department?: string;
          avatar?: string | null;
          personality?: Personality;
          skills?: Skill[];
          availability?: 'available' | 'busy' | 'unavailable';
          projects?: Project[] | null;
          tasks?: Task[];
          capacity?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      // Add view types if needed
    };
    Functions: {
      // Add function types if needed
    };
    Enums: {
      // Add enum types if needed
    };
  };
}
