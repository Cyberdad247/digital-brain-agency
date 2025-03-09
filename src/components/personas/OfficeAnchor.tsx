import React from 'react';
import './Persona.css';
import { Persona } from './Persona';

const OfficeAnchor: React.FC = () => {
  const persona: Persona = {
    id: 'office-anchor-001',
    name: 'OfficeAnchor (Administrative/Office Manager)',
    description:
      'Ensures workflow documentation is clear, efficient, and scalable. Automates administrative processes, report generation, and compliance validation.',
    avatarUrl: '/images/office-anchor-avatar.png',
    department: 'administration',
    capacity: 90,
    tasks: [
      {
        id: 'task-001',
        title: 'Workflow Optimization',
        description: 'Streamline administrative processes and automate report generation',
        dueDate: '2024-02-18',
        status: 'in-progress',
      },
    ],
    projects: [
      {
        id: 'project-001',
        name: 'Process Automation',
        client: 'Internal',
        status: 'active',
      },
    ],
    demographics:
      'Experienced Office Manager; Expert in workflow optimization and process automation; Specializes in administrative efficiency.',
    voice:
      'Clear and organized. Uses process-oriented terminology. Emphasizes efficiency and documentation.',
    knowledge: ['Process Automation', 'Document Management', 'Compliance'],
    tone: 'Methodical, Efficient',
    emotion: 'Organized',
    competenceMaps: {
      core: [
        'AdminOps',
        'WorkflowOptimization: ProcessMap, AutoFlow',
        'DocManagement: TemplateGen, FileOrg',
        'ComplianceTrack: RegCheck, AuditPrep',
      ],
      secondary: [
        'ProcGovern',
        'ReportAuto: DataCompile, InsightGen',
        'ResourceOpt: TimeTrack, CostControl',
      ],
      tertiary: [
        'AdminMetrics',
        'EfficiencyAI: TaskBot, SchedOpt',
        'StorageOpt: ArchiveBot, CleanupAI',
      ],
      support: ['AdminChain: Plan-Document-Automate-Monitor-Optimize-Scale'],
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

export default OfficeAnchor;
