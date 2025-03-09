import { AuthProvider } from '@refinedev/core';
import { supabase } from './lib/supabase';
import { SecurityAuditService } from './lib/security/SecurityAuditService';

const securityAuditService = new SecurityAuditService();

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Promise.reject(error);
    }

    if (data?.user) {
      localStorage.setItem('auth', JSON.stringify(data.user));
      await securityAuditService.logSecurityEvent({
        event_type: 'login',
        user_id: data.user.id,
        details: { provider: 'supabase', success: true },
        gdpr_relevant: true
      });
      return Promise.resolve({
        success: true,
        redirectTo: '/',
      });
    }

    return Promise.reject(new Error('Login failed'));
  },
  logout: async () => {
    const session = JSON.parse(localStorage.getItem('auth') || 'null');
    const { error } = await supabase.auth.signOut();
    if (session?.id) {
      await securityAuditService.logSecurityEvent({
        event_type: 'logout',
        user_id: session.id,
        details: { provider: 'supabase' },
        gdpr_relevant: true
      });
    }
    localStorage.removeItem('auth');

    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve({
      success: true,
      redirectTo: '/login',
    });
  },
  check: async () => {
    const session = JSON.parse(localStorage.getItem('auth') || 'null');
    if (session) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: '/login',
      logout: true,
    };
  },
  getPermissions: async () => {
    const session = JSON.parse(localStorage.getItem('auth') || 'null');
    return session ? Promise.resolve(session.role) : Promise.reject();
  },
  getIdentity: async () => {
    const session = JSON.parse(localStorage.getItem('auth') || 'null');
    if (session) {
      return Promise.resolve({
        id: session.id,
        name: session.email,
        avatar: session.user_metadata?.avatar_url,
      });
    }
    return Promise.reject();
  },
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true };
    }
    return {};
  },
};

export default authProvider;
