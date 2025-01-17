import { createContext, useContext, useState, useEffect } from 'react';

interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

interface PersonaContextType {
  personas: Persona[];
  activePersona: Persona | null;
  setActivePersona: (persona: Persona | null) => void;
}

const PersonaContext = createContext<PersonaContextType>({
  personas: [],
  activePersona: null,
  setActivePersona: () => {},
});

export const PersonaProvider = ({ children }: { children: React.ReactNode }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  useEffect(() => {
    // Load personas from the specified directory
    const loadPersonas = async () => {
      try {
        const response = await fetch('/api/personas');
        const data = await response.json();
        setPersonas(data);
      } catch (error) {
        console.error('Error loading personas:', error);
      }
    };

    loadPersonas();
  }, []);

  return (
    <PersonaContext.Provider value={{ personas, activePersona, setActivePersona }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => useContext(PersonaContext);
