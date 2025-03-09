import React from 'react';
import BarChart from './charts/BarChart';

interface ProjectStatusProps {
  projectData?: {
    labels: string[];
    data: number[];
  };
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ projectData }) => {
  const defaultData = {
    labels: ['Project A', 'Project B', 'Project C', 'Project D'],
    data: [80, 45, 60, 95],
  };

  const data = projectData || defaultData;

  return (
    <div className="project-status">
      <h2>Project Completion Status</h2>
      <BarChart data={data.data} labels={data.labels} title="Project Completion %" />
    </div>
  );
};

export default ProjectStatus;
