import { createContext, useContext, useState, useCallback } from 'react';
import { Persona, PersonaContextType } from './Persona';
import { createBrowserClient } from '@supabase/ssr';

const PersonaContext = createContext<PersonaContextType>({
  personas: [],
  loading: false,
  error: null,
  addPersona: async () => {},
  updatePersona: async () => {},
  deletePersona: async () => {},
  getPersona: () => undefined,
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPersonas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personas');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const addPersona = useCallback(async (persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .insert([persona])
        .select()
        .single();
      
      if (error) throw error;
      setPersonas(prev => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add persona');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updatePersona = useCallback(async (id: string, updates: Partial<Persona>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPersonas(prev => 
        prev.map(p => p.id === id ? { ...p, ...data } : p)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update persona');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deletePersona = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPersonas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete persona');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const getPersona = useCallback((id: string) => {
    return personas.find(p => p.id === id);
  }, [personas]);

  return (
    <PersonaContext.Provider
      value={{
        personas,
        loading,
        error,
        addPersona,
        updatePersona,
        deletePersona,
        getPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export const usePersona = () => useContext(PersonaContext);
