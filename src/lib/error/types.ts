export interface ErrorEvent {
  id: string;
  error: Error;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
}

export interface ErrorSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ErrorTrend {
  timestamp: Date;
  count: number;
  severity: ErrorEvent['severity'];
}