export interface Persona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  skills: string[];
  preferences: {
    communication: string;
    decisionMaking: string;
  };
}
