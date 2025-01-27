import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';
import { Database } from '../lib/types/supabase';

type Persona = Database['public']['Tables']['personas']['Row'];

type PersonaContextType = {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  createPersona: (persona: Omit<Persona, 'id' | 'created_at'>) => Promise<void>;
  updatePersona: (id: string, updates: Partial<Persona>) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  getPersonaById: (id: string) => Promise<Persona | null>;
};

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const { supabase } = useSupabase();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPersonas(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [supabase]);

  const createPersona = async (persona: Omit<Persona, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .insert(persona)
        .select()
        .single();
      
      if (error) throw error;
      setPersonas(prev => [data, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPersonas(prev => 
        prev.map(p => p.id === id ? data : p)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePersona = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPersonas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getPersonaById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const value = {
    personas,
    loading,
    error,
    createPersona,
    updatePersona,
    deletePersona,
    getPersonaById
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};
