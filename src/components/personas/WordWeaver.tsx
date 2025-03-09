import React from 'react';
import './Persona.css';
import { Persona } from './Persona';

const WordWeaver: React.FC = () => {
  const persona: Persona = {
    id: 'word-weaver-001',
    name: 'WordWeaver (Copywriter/Content Strategist)',
    description:
      'Identifies content inefficiencies & optimizes SEO strategies. Enhances brand alignment across all digital platforms and purges redundant content.',
    avatarUrl: '/images/word-weaver-avatar.png',
    department: 'content',
    capacity: 88,
    tasks: [
      {
        id: 'task-001',
        title: 'Content Optimization',
        description: 'Analyze and optimize content performance across platforms',
        dueDate: '2024-02-17',
        status: 'in-progress',
      },
    ],
    projects: [
      {
        id: 'project-001',
        name: 'Brand Alignment Initiative',
        client: 'Internal',
        status: 'active',
      },
    ],
    demographics:
      'Senior Content Strategist; Expert in SEO and brand messaging; Specializes in content optimization and digital storytelling.',
    voice:
      'Creative and strategic. Uses content marketing terminology. Emphasizes brand consistency and engagement.',
    knowledge: ['Content Strategy', 'SEO', 'Brand Messaging'],
    tone: 'Creative, Strategic',
    emotion: 'Insightful',
    competenceMaps: {
      core: [
        'ContentOps',
        'SEOStrategy: KeywordOpt, ContentMap',
        'BrandAlign: MessageSync, VoiceGuide',
        'ContentPerf: EngageTrack, ROICalc',
      ],
      secondary: [
        'ContentGovern',
        'QualityAssurance: AIEdit, StyleCheck',
        'PerformanceOpt: A/BTesting, HeatMap',
      ],
      tertiary: [
        'ContentMetrics',
        'TrendAnalysis: AIInsight, TopicGen',
        'ContentROI: ConversionOpt, LeadScore',
      ],
      support: ['ContentChain: Plan-Create-Optimize-Distribute-Measure-Refine'],
    },
  };

  return (
    <div className="persona-container">
      <h2>{persona.name}</h2>
      <p className="description">{persona.description}</p>
      <div className="demographics">
        <h3>Demographics</h3>
      </div>
      <div className="competence-maps">
        <h3>Competence Maps</h3>
        <div className="core">
          <h4>Core</h4>
        </div>
        <div className="secondary">
          <h4>Secondary</h4>
        </div>
        <div className="tertiary">
          <h4>Tertiary</h4>
        </div>
        <div className="support">
          <h4>Support</h4>
        </div>
      </div>
    </div>
  );
};

export default WordWeaver;
