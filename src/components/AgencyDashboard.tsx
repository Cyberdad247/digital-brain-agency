import { useState } from 'react';

import { useAgencyData } from '../hooks/useAgencyData';
import {
  EmployeePerformance as EmployeePerformanceType,
  Metrics,
  Project,
} from '../hooks/useAgencyData';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth hook exists
import styles from './AgencyDashboard.module.css';
import AgencyMetrics from './AgencyMetrics';
import EmployeePerformance from './EmployeePerformance';
import ProjectStatus from './ProjectStatus';

type Package = {
  name: string;
  status: string;
  renewalDate: string;
};

type AgencyDashboardProps = {
  className?: string;
};

const PackageList = ({ packages }: { packages: Package[] }) => (
  <div className="card mb-4">
    <h2 className="card-title">Your Packages</h2>
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Status</th>
            <th>Renewal Date</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={index}>
              <td>{pkg.name}</td>
              <td>{pkg.status}</td>
              <td>{pkg.renewalDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProfileUpdate = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const handleUpdateProfile = async () => {
    try {
      setUpdateSuccess('Profile updated successfully!');
      setUpdateError('');
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'An error occurred');
      setUpdateSuccess('');
    }
  };

  return (
    <div className="card mb-4">
      <h2 className="card-title">Update Profile</h2>
      {updateSuccess && <div className="alert alert-success">{updateSuccess}</div>}
      {updateError && <div className="alert alert-error">{updateError}</div>}
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="form-label" htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleUpdateProfile}
          className="button button-primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export const AgencyDashboard = ({ className }: AgencyDashboardProps) => {
  const { data, loading, error } = useAgencyData();
  const { user, signOut, isLoading: authLoading, error: authError } = useAuth(); // Use useAuth hook

  const packages: Package[] = [
    {
      name: 'Basic Marketing Package',
      status: 'Active',
      renewalDate: '2025-03-15',
    },
    {
      name: 'Advanced SEO Package',
      status: 'Pending',
      renewalDate: '2025-02-28',
    },
    {
      name: 'Premium Content Creation',
      status: 'Expired',
      renewalDate: '2025-01-31',
    },
  ];

  if (loading || authLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4">Loading Dashboard...</p>
      </div>
    );

  if (error || authError)
    return (
      <div className="text-red-500">
        Error: {error ? error : authError}
        <a
          href="mailto:support@example.com?subject=Dashboard%20Support&amp;body=Describe%20your%20issue%20here"
          className="ml-2 text-blue-500"
        >
          Contact Support
        </a>
      </div>
    );

  return (
    <div className={`container mx-auto p-4 ${className || ''}`}>
      <h1 className="text-2xl font-bold mb-4">Agency Dashboard</h1>

      <PackageList packages={packages} />

      <ProfileUpdate />

      <div className="mb-4">
        <a
          href="mailto:support@example.com?subject=Dashboard%20Support&amp;body=Describe%20your%20issue%20here"
          className="text-blue-500"
        >
          Contact Support
        </a>
      </div>

      <div className={styles.grid}>
        <AgencyMetrics metrics={data?.metrics} />
        <ProjectStatus projects={data?.projects || []} />
        <EmployeePerformance employees={data?.employees || []} />
      </div>
    </div>
  );
};
