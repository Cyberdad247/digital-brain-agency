import React from 'react';

interface PersonaDetailsProps {
  personaName: string;
  personaDescription: string;
  personaCompetenceMap: string; // You might want to define a more specific type for competence map
}

const PersonaDetails: React.FC<PersonaDetailsProps> = ({ personaName, personaDescription, personaCompetenceMap }) => {
  return (
    <div>
      <h3>Persona Details</h3>
      <h4>{personaName}</h4>
      <p>{personaDescription}</p>
      <h5>Competence Map</h5>
      <pre>{personaCompetenceMap}</pre>
    </div>
  );
};

export default PersonaDetails;