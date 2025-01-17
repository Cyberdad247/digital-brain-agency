import React, { createContext, useContext, ReactNode } from 'react';

type SocialMedia = {
  platform: string;
  handle: string;
  followers: number;
  engagementRate: number;
};

type AgencyData = {
  socialMedia: SocialMedia[];
  // Add other agency data properties as needed
};

type PersonaContextType = {
  data: AgencyData;
  setData: (data: AgencyData) => void;
};

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = React.useState<AgencyData>({
    socialMedia: [],
    // Initialize other agency data properties
  });

  return (
    <PersonaContext.Provider value={{ data, setData }}>
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
