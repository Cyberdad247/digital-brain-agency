import { AuthProvider } from '@refinedev/core';
import { supabase } from './lib/supabase';

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
