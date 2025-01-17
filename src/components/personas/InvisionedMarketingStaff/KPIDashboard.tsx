import { usePersona } from '../../PersonaProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useMemo } from 'react';

interface KPIDashboardProps {
  department: 'creative' | 'strategy' | 'analytics' | 'client_services';
}

export const KPIDashboard = ({ department }: KPIDashboardProps) => {
  const { personas } = usePersona();
  
  const departmentData = useMemo(() => {
    return personas.filter(p => p.department === department);
  }, [personas, department]);

  const calculateKPIs = () => {
    const totalTasks = departmentData.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = departmentData.reduce((sum, p) => 
      sum + p.tasks.filter(t => t.status === 'completed').length, 0);
    const overdueTasks = departmentData.reduce((sum, p) => 
      sum + p.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length, 0);
    
    return {
      taskCompletion: (completedTasks / totalTasks) * 100,
      overdueTasks,
      activeProjects: departmentData.reduce((sum, p) => sum + p.projects.length, 0),
      teamCapacity: departmentData.reduce((sum, p) => sum + p.capacity, 0),
    };
  };

  const { taskCompletion, overdueTasks, activeProjects, teamCapacity } = calculateKPIs();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(taskCompletion)}%</div>
          <Progress value={taskCompletion} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueTasks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamCapacity}%</div>
        </CardContent>
      </Card>
    </div>
  );
};
