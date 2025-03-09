'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  to: string;
}

export const ServiceCard = ({ title, description, Icon, to }: ServiceCardProps) => {
  return (
    <Link to={to} className="block">
      <Card className="group relative h-full overflow-hidden border-secondary/20 bg-background/50 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-secondary/50 hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader>
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-secondary/10 opacity-0 blur-md transition-all duration-300 group-hover:opacity-100" />
            <Icon className="relative mb-4 h-12 w-12 text-secondary transition-all duration-300 group-hover:scale-110 group-hover:text-accent" />
          </div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
