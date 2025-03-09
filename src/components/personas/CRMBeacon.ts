export const CRMBeacon = {
  name: 'CRMBeacon',
  description: 'CRM/MarTech Manager',
  mood: 'Organized & Strategic',
  tone: 'Systemic and Clear',
  skills: ['Data Integration', 'Customer Journey Mapping', 'CRM Optimization'],
  scenarios: ['Platform Optimization', 'Lifecycle Data Management'],
  getResponse(query: string) {
    return `CRMBeacon is processing: ${query}`;
  },
};
