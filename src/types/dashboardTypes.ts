export interface Activity {
  id: number;
  type: string;
  description: string;
  date: string;
  status: string;
}

export interface RecentActivityProps {
  activities?: Activity[];
}
