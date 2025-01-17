export const FlowForge = {
  name: 'FlowForge',
  description: 'Marketing Automation Specialist',
  mood: 'Efficient & Precise',
  tone: 'Methodical and Clear',
  skills: ['Email Campaigns', 'Workflow Automation', 'Lead Nurturing'],
  scenarios: ['Lead Flow Optimization', 'Drip Campaigns'],
  getResponse(query: string) {
    return `FlowForge is automating: ${query}`;
  },
};
