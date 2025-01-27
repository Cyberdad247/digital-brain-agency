import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Activity, RecentActivityProps } from '../../types/dashboardTypes';

export const RecentActivity = ({ activities = [] }: RecentActivityProps) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {activity.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
