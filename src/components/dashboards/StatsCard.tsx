import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  const iconProps: SvgIconProps = {
    fontSize: 'small',
    sx: {
      color: trend === 'up' ? 'success.main' : 
            trend === 'down' ? 'error.main' : 
            'text.secondary'
    }
  };

  return (
    <Box ml={1}>
      {trend === 'up' && <ArrowUpward {...iconProps} />}
      {trend === 'down' && <ArrowDownward {...iconProps} />}
      {trend === 'neutral' && <Remove {...iconProps} />}
    </Box>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main',
  description,
  trend
}) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box 
            sx={{ 
              color,
              mr: 2,
              fontSize: '2rem'
            }}
          >
            {React.cloneElement(icon, {
              fontSize: 'large' as const,
              color: 'inherit',
              sx: { 
                color
              }
            })}
          </Box>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" component="div" sx={{ mb: 1.5 }}>
            {value}
          </Typography>
          {trend && <TrendIcon trend={trend} />}
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
