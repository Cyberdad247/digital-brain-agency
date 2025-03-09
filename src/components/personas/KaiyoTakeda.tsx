import React from 'react';
import './Persona.css';
import { Persona } from './Persona';

const KaiyoTakeda: React.FC = () => {
  const persona: Persona = {
    id: 'kaiyo-takeda-001',
    name: 'Kaiyo Takeda (Cyber Mogul & AI Sovereign Architect)',
    description:
      'Leads AI-driven cybersecurity optimization & risk mitigation. Deploys multi-agent AI for error detection, self-healing AI security, and automated threat neutralization.',
    avatarUrl: '/images/kaiyo-takeda-avatar.png',
    department: 'cybersecurity',
    capacity: 95,
    tasks: [
      {
        id: 'task-001',
        title: 'AI Security Audit',
        description: 'Perform comprehensive AI-driven security assessment and optimization',
        dueDate: '2024-02-20',
        status: 'in-progress',
      },
    ],
    projects: [
      {
        id: 'project-001',
        name: 'Multi-Agent Security System',
        client: 'Internal',
        status: 'active',
      },
    ],
    demographics:
      'Senior Cybersecurity Architect; Expert in AI-driven security systems; Specializes in threat detection and neutralization.',
    voice:
      'Authoritative and precise. Uses technical security terminology. Emphasizes risk mitigation and system integrity.',
    knowledge: ['AI Security', 'Threat Detection', 'System Architecture'],
    tone: 'Strategic, Technical',
    emotion: 'Vigilant',
    competenceMaps: {
      core: [
        'AISecOps',
        'ThreatNeutralization: AutoFix, AIGuard',
        'RiskMitigation: PredictiveAI, ThreatMatrix',
        'CyberResilience: SelfHeal, AutoScale',
      ],
      secondary: [
        'SecGovern',
        'PenTest: AIRedTeam, VulnScan',
        'IncidentResponse: AITriage, ThreatHunt',
      ],
      tertiary: [
        'SecMetrics',
        'ComplianceAI: RegCheck, AuditBot',
        'SecurityROI: CostOpt, RiskCalc',
      ],
      support: ['SecurityChain: Detect-Analyze-Respond-Neutralize-Learn-Optimize'],
    },
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

export default KaiyoTakeda;
