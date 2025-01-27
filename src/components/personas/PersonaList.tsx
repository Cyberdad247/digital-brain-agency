import React from 'react';

interface PersonaListProps {
  personas: { name: string; description: string }[];
  onSelect: (personaName: string) => void;
}

const PersonaList: React.FC<PersonaListProps> = ({ personas, onSelect }) => {
  return (
    <div>
      <h3>Available Personas</h3>
      <ul>
        {personas.map((persona, index) => (
          <li key={index} onClick={() => onSelect(persona.name)} style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}>
            <strong>{persona.name}</strong>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>{persona.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonaList;