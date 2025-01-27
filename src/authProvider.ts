import { AuthProvider } from '@refinedev/core';
import { supabase } from './lib/supabase';
import { UserProfile, SubscriptionTier, TIER_ACCESS } from './types/userTypes';

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
      // Get user profile with subscription tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userData = {
        ...data.user,
        profile: {
          ...profile,
          access: TIER_ACCESS[profile?.subscription_tier || 'free']
        }
      };

      localStorage.setItem('auth', JSON.stringify(userData));
      return Promise.resolve({
        success: true,
        redirectTo: '/'
      });
    }

    return Promise.reject(new Error('Login failed'));
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem('auth');

    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve({
      success: true,
      redirectTo: '/login'
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
    if (session) {
      return Promise.resolve(session.profile.access);
    }
    return Promise.reject();
  },

  getIdentity: async () => {
    const session = JSON.parse(localStorage.getItem('auth') || 'null');
    if (session) {
      return Promise.resolve({
        id: session.id,
        name: session.email,
        avatar: session.user_metadata?.avatar_url,
        tier: session.profile?.subscription_tier
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
