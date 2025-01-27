export interface Persona {
  id: string;
  name: string;
  description: string;
  instructions?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaContextType {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  addPersona: (persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePersona: (id: string, updates: Partial<Persona>) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  getPersona: (id: string) => Persona | undefined;
}
