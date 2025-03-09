import { ResourceLimits, ResourceLimitsType } from '@/config/resource-limits';

type ResourceUsage = {
  current: number;
  limit: number;
  warning: number;
  percentage: number;
};

type ResourceAlert = {
  service: string;
  resource: string;
  usage: ResourceUsage;
  message: string;
};

export class ResourceMonitor {
  private static instance: ResourceMonitor;
  private alerts: ResourceAlert[] = [];

  private constructor() {}

  static getInstance(): ResourceMonitor {
    if (!ResourceMonitor.instance) {
      ResourceMonitor.instance = new ResourceMonitor();
    }
    return ResourceMonitor.instance;
  }

  async checkVercelUsage(): Promise<ResourceAlert[]> {
    const alerts: ResourceAlert[] = [];
    try {
      // Implement Vercel API calls to get current usage
      // Example: const usage = await vercelClient.getProjectUsage();
      
      // Check bandwidth usage
      this.checkLimit('vercel', 'bandwidth', ResourceLimits.vercel.bandwidth);
      
      // Check build minutes
      this.checkLimit('vercel', 'builds', ResourceLimits.vercel.builds);
    } catch (error) {
      console.error('Error checking Vercel usage:', error);
    }
    return alerts;
  }

  async checkSupabaseUsage(): Promise<ResourceAlert[]> {
    const alerts: ResourceAlert[] = [];
    try {
      // Implement Supabase usage checks
      // Example: const usage = await supabaseClient.rpc('get_storage_usage');
      
      // Check database size
      this.checkLimit('supabase', 'database', ResourceLimits.supabase.database);
      
      // Check storage usage
      this.checkLimit('supabase', 'storage', ResourceLimits.supabase.storage);
      
      // Check bandwidth usage
      this.checkLimit('supabase', 'bandwidth', ResourceLimits.supabase.bandwidth);
    } catch (error) {
      console.error('Error checking Supabase usage:', error);
    }
    return alerts;
  }

  async checkHuggingFaceUsage(): Promise<ResourceAlert[]> {
    const alerts: ResourceAlert[] = [];
    try {
      // Monitor HuggingFace API rate limits
      this.checkLimit('huggingface', 'inference', ResourceLimits.huggingface.inference);
    } catch (error) {
      console.error('Error checking HuggingFace usage:', error);
    }
    return alerts;
  }

  private checkLimit(service: string, resource: string, limits: { limit: number; warning: number }, current?: number): void {
    if (current === undefined) return;

    const percentage = (current / limits.limit) * 100;
    if (percentage >= (limits.warning / limits.limit) * 100) {
      this.alerts.push({
        service,
        resource,
        usage: {
          current,
          limit: limits.limit,
          warning: limits.warning,
          percentage
        },
        message: `${service} ${resource} usage is at ${percentage.toFixed(1)}% (${current}/${limits.limit})`
      });
    }
  }

  async monitorAllResources(): Promise<ResourceAlert[]> {
    const allAlerts = [
      ...await this.checkVercelUsage(),
      ...await this.checkSupabaseUsage(),
      ...await this.checkHuggingFaceUsage()
    ];

    // Implement notification system for alerts
    if (allAlerts.length > 0) {
      console.warn('Resource usage alerts:', allAlerts);
      // You could implement additional notification methods here
      // e.g., send to Sentry, email notifications, etc.
    }

    return allAlerts;
  }

  getAlerts(): ResourceAlert[] {
    return this.alerts;
  }

  clearAlerts(): void {
    this.alerts = [];
  }
}