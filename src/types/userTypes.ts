export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export interface ServiceAccess {
  [service: string]: boolean;
}

export const TIER_ACCESS: Record<SubscriptionTier, ServiceAccess> = {
  free: {
    basicAnalytics: true,
    chatbot: false,
    automation: false,
    emailMarketing: false
  },
  basic: {
    basicAnalytics: true,
    chatbot: true,
    automation: false,
    emailMarketing: false
  },
  pro: {
    basicAnalytics: true,
    chatbot: true,
    automation: true,
    emailMarketing: false
  },
  enterprise: {
    basicAnalytics: true,
    chatbot: true,
    automation: true,
    emailMarketing: true
  }
};
