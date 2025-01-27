import StatsCard from "./StatsCard"

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

interface UserStatsProps {
  statistics: StatsCardProps[]
}

export function UserStats({ statistics }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statistics.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          description={stat.description}
        />
      ))}
    </div>
  )
}
