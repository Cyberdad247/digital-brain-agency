import React, { useState } from 'react';
import PersonaList from './PersonaList';
import PersonaDetails from './PersonaDetails';

const placeholderPersonas = [
  {
    name: 'InsightOracle',
    description: 'Analytics Director/Manager',
    competenceMap: 'DataStrategy, InsightSynth, PredictiveEdge'
  },
  {
    name: 'CodeCrafter',
    description: 'Web Developer',
    competenceMap: 'DevExec, PerfEnh, CollabFlow'
  },
  {
    name: 'UXVisionary',
    description: 'UX/UI Designer',
    competenceMap: 'UserFocus, VisDesign, IterImprove'
  }
];

const PersonaManager: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handlePersonaSelect = (personaName: string) => {
    setSelectedPersona(personaName);
  };

  const personas = placeholderPersonas.map(p => p.name);
  const detailedPersona = placeholderPersonas.find(p => p.name === selectedPersona);

  return (
    <div>
      <h2>Persona Manager</h2>

      <PersonaList personas={placeholderPersonas} onSelect={handlePersonaSelect} />
      {selectedPersona && detailedPersona && (
        <PersonaDetails
          personaName={detailedPersona.name}
          personaDescription={detailedPersona.description}
          personaCompetenceMap={detailedPersona.competenceMap}
        />
      )}
    </div>
  );

};
export default PersonaManager;
