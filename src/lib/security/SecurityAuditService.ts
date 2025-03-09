import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface SecurityAuditLog {
  event_type: 'login' | 'logout' | 'data_access' | 'data_modification' | 'consent_update';
  user_id: string;
  timestamp: Date;
  ip_address?: string;
  details: Record<string, any>;
  gdpr_relevant: boolean;
}

export class SecurityAuditService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  async logSecurityEvent(log: Omit<SecurityAuditLog, 'timestamp'>): Promise<void> {
    try {
      const { error } = await this.client
        .from('security_audit_logs')
        .insert({
          ...log,
          timestamp: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (err) {
      console.error('Error in security audit logging:', err);
    }
  }

  async getGDPRRelevantLogs(userId: string): Promise<SecurityAuditLog[]> {
    const { data, error } = await this.client
      .from('security_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('gdpr_relevant', true)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Failed to fetch GDPR logs:', error);
      return [];
    }

    return data as SecurityAuditLog[];
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      // Log the data deletion request
      await this.logSecurityEvent({
        event_type: 'data_modification',
        user_id: userId,
        details: { action: 'delete_user_data', status: 'initiated' },
        gdpr_relevant: true,
      });

      // Perform data deletion across relevant tables
      const { error } = await this.client
        .from('user_data')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // Log successful deletion
      await this.logSecurityEvent({
        event_type: 'data_modification',
        user_id: userId,
        details: { action: 'delete_user_data', status: 'completed' },
        gdpr_relevant: true,
      });
    } catch (err) {
      console.error('Error in user data deletion:', err);
      throw err;
    }
  }
}