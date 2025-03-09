'use client';

interface ErrorAnalytics {
  errorType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  frequency: number;
  firstOccurrence: string;
  lastOccurrence: string;
  affectedComponents: Set<string>;
  userImpact: number;
}

export class ErrorAnalyticsService {
  private static instance: ErrorAnalyticsService;
  private errorStats: Map<string, ErrorAnalytics>;

  private constructor() {
    this.errorStats = new Map();
  }

  public static getInstance(): ErrorAnalyticsService {
    if (!ErrorAnalyticsService.instance) {
      ErrorAnalyticsService.instance = new ErrorAnalyticsService();
    }
    return ErrorAnalyticsService.instance;
  }

  public analyzeError(error: Error, componentStack?: string): ErrorAnalytics {
    const errorKey = this.generateErrorKey(error);
    const currentStats = this.errorStats.get(errorKey) || this.initializeErrorStats(error);

    currentStats.frequency++;
    currentStats.lastOccurrence = new Date().toISOString();
    if (componentStack) {
      this.updateAffectedComponents(currentStats, componentStack);
    }

    this.errorStats.set(errorKey, currentStats);
    return currentStats;
  }

  private generateErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  private initializeErrorStats(error: Error): ErrorAnalytics {
    const now = new Date().toISOString();
    return {
      errorType: error.name,
      severity: this.calculateSeverity(error),
      frequency: 0,
      firstOccurrence: now,
      lastOccurrence: now,
      affectedComponents: new Set<string>(),
      userImpact: 0,
    };
  }

  private calculateSeverity(error: Error): 'critical' | 'high' | 'medium' | 'low' {
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return 'high';
    }
    if (error instanceof SyntaxError) {
      return 'critical';
    }
    if (error instanceof URIError || error instanceof RangeError) {
      return 'medium';
    }
    return 'low';
  }

  private updateAffectedComponents(stats: ErrorAnalytics, componentStack: string): void {
    const components = componentStack
      .split('\n')
      .map((line) => {
        const match = line.match(/in ([\w]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    components.forEach((component) => stats.affectedComponents.add(component));
  }

  public getErrorTrends(): { [key: string]: ErrorAnalytics } {
    return Object.fromEntries(this.errorStats);
  }

  public getHighSeverityErrors(): ErrorAnalytics[] {
    return Array.from(this.errorStats.values()).filter((stat) =>
      ['critical', 'high'].includes(stat.severity)
    );
  }

  public getMostFrequentErrors(limit: number = 5): ErrorAnalytics[] {
    return Array.from(this.errorStats.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  public clearAnalytics(): void {
    this.errorStats.clear();
  }
}
