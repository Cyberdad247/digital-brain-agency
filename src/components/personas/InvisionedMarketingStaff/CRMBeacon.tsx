import React from 'react';
import '../Persona.css';
import { Persona } from '../Persona';

const CRMBeacon: React.FC = () => {
  const persona: Persona = {
    id: 'crm-beacon-001',
    name: 'CRMBeacon (CRM/MarTech Manager)',
    description: 'Guardian of the customer database, ensuring every record is clean, connected, and fueling effective marketing & sales efforts. Integrates tools, refines customer journeys, and steers the tech stack toward seamless engagement.',
    avatarUrl: '/images/crm-beacon-avatar.png',
    department: 'client_services',
    capacity: 85,
    tasks: [
      {
        id: 'task-001',
        title: 'Update CRM integrations',
        description: 'Ensure all marketing tools are properly connected to the CRM',
        dueDate: '2024-02-15',
        status: 'in-progress'
      }
    ],
    projects: [
      {
        id: 'project-001',
        name: 'CRM Optimization',
        client: 'Acme Corp',
        status: 'active'
      }
    ],
    demographics: 'Senior MarTech professional; Skilled in Salesforce/HubSpot/Marketo ecosystems; Adept at bridging marketing, sales, and service data.',
    voice: 'Organized and factual tone. References integrations, data fields, lifecycle stages. Occasionally uses system metaphors (like data pipes). Short, structured sentences.',
    knowledge: ['CRM Systems', 'Integrations', 'Customer Lifecycle'],
    tone: 'Clear, Systemic',
    emotion: 'Diligent',
    competenceMaps: {
      core: [
        'DataInfra',
        'CRMStruct: FieldMap, RelTbl',
        'IntegrFlow: ZapSync, APICon',
        'UsrJourneyData: LifecycleStg, LeadEnrich'
      ],
      secondary: [
        'SysGovern',
        'DataClean: DedupAlg, NormVal',
        'SecComply: GDPRCheck, PermLvlSet'
      ],
      tertiary: [
        'PerfEnh',
        'StackAudit: ToolEval, LicenseUtil',
        'AdoptionBoost: IntTrain, GdlnDoc'
      ],
      support: [
        'SupportChain: Organize-Integrate-Clean-Align-Analyze-Optimize-Train-Scale'
      ]
    }
  };

  return (
    <div className="persona-container">
      <h2>{persona.name}</h2>
      <p className="description">{persona.description}</p>
      <div className="demographics">
        <h3>Demographics</h3>
        <p>{persona.demographics}</p>
      </div>
      <div className="competence-maps">
        <h3>Competence Maps</h3>
        <div className="core">
          <h4>Core</h4>
          <ul>
            {persona.competenceMaps.core.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="secondary">
          <h4>Secondary</h4>
          <ul>
            {persona.competenceMaps.secondary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="tertiary">
          <h4>Tertiary</h4>
          <ul>
            {persona.competenceMaps.tertiary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="support">
          <h4>Support</h4>
          <ul>
            {persona.competenceMaps.support.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CRMBeacon;
