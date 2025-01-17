import { useState } from 'react';
import SocialMediaDashboard from '../components/dashboards/SocialMediaDashboard';
import { useAgencyData } from '../hooks/useAgencyData';

const SocialMediaManagement = () => {
  const { data, loading } = useAgencyData();

  return (
    <div className="social-media-management">
      <h1 className="text-2xl font-bold mb-4">Social Media Management</h1>
      <SocialMediaDashboard 
        loading={loading}
        socialMediaData={data?.socialMedia || {}}
      />
    </div>
  );
};

export default SocialMediaManagement;
