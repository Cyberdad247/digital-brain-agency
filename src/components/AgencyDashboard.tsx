import { useAgencyData } from '../hooks/useAgencyData';
import { theme } from '../styles/theme';
import EmployeePerformance from './EmployeePerformance';
import AgencyMetrics from './AgencyMetrics';
import ProjectStatus from './ProjectStatus';
import { Metrics, Project, EmployeePerformance as EmployeePerformanceType } from '../hooks/useAgencyData';
import styles from './AgencyDashboard.module.css';

type AgencyDashboardProps = {
  className?: string;
};

export const AgencyDashboard = ({ className }: AgencyDashboardProps) => {
  const { data, loading, error } = useAgencyData();

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h1 className={styles.title}>Agency Dashboard</h1>

      <div className={styles.grid}>
        <AgencyMetrics metrics={data?.metrics} />
        <ProjectStatus projects={data?.projects} />
        <EmployeePerformance employees={data?.employees} />
      </div>
    </div>
  );
};
