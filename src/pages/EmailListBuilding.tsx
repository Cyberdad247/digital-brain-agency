import React from 'react';
import DashboardLayout from '../components/dashboards/DashboardLayout';
import EmailListBuildingDashboard from '../components/dashboards/EmailListBuildingDashboard';

const EmailListBuildingPage = () => {
  return (
    <DashboardLayout title="Email List Building">
      <EmailListBuildingDashboard />
    </DashboardLayout>
  );
};

export default EmailListBuildingPage;
