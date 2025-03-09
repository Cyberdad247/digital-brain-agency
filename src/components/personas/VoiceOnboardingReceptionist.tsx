import React from 'react';
import { VoiceChatBot } from '../VoiceChatBot';

const VoiceOnboardingReceptionist: React.FC = () => {
  const persona = {
    id: 'voice-onboarding-001',
    name: 'VoiceOnboardingReceptionist',
    description: 'AI-powered voice receptionist for guiding new customers through the digital marketing agency onboarding process',
    avatarUrl: '/images/voice-receptionist-avatar.png',
    department: 'client_services',
    capacity: 95,
    skills: ['Natural Language Processing', 'Conversational AI', 'Customer Profiling'],
    knowledge: ['CRM Integration', 'Calendar Scheduling', 'Service Package Configuration'],
    tone: 'Friendly, Professional',
    emotion: 'Welcoming',
    scenarios: ['Customer Onboarding', 'Service Recommendation', 'Appointment Scheduling'],
    competenceMaps: {
      core: ['CustomerProfiling', 'ServiceRecommendation', 'ConversationalFlow'],
      secondary: ['DataCollection', 'CRMIntegration', 'CalendarSync'],
      support: ['OnboardingChain: Welcome-Profile-Recommend-Schedule-FollowUp']
    }
  };

  return (
    <>
      <div className="persona-container">
        <h2>{persona.name}</h2>
        <p className="description">{persona.description}</p>
      </div>
      <VoiceChatBot onboardingComplete={() => console.log('Onboarding complete')} />
    </>
  );
};

export default VoiceOnboardingReceptionist;