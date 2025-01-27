import React from 'react';
import DashboardLayout from '../components/dashboards/DashboardLayout';
import PersonaManager from '../components/personas/PersonaManager';

const PersonaDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Persona Management" description="Manage and utilize agent personas">
      <PersonaManager />
    </DashboardLayout>
  );
};

export default PersonaDashboard;