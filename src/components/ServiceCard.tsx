import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const ServiceCard = ({ title, description, Icon }: ServiceCardProps) => {
  return (
    <Card className="bg-background/50 border-secondary/20 hover:border-secondary/50 transition-all duration-300 group">
      <CardHeader>
        <Icon className="w-12 h-12 text-secondary mb-4 group-hover:text-accent transition-colors" />
        <CardTitle className="text-xl text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};