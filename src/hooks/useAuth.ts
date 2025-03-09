// src/hooks/useAuth.ts
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
// import FingerprintJS from '@fingerprintjs/fingerprintjs'; // Assuming you have this library installed

interface Auth {
  user: {
    email: string | null;
  };
  signOut: () => void;
  enhancedSignIn: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
);

// async function getRecaptchaToken() {
//   // Add hCaptcha/Recaptcha logic here
//   return 'mock_recaptcha_token';
// }

export const useAuth = (): Auth => {
  const [user, setUser] = useState<{ email: string | null }>({
    email: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    // Mock sign out function
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      setUser({ email: null });
    }
  };

  const enhancedSignIn = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check IP first
      const securityCheck = await fetch('/functions/v1/crowdsec-auth-check');
      if (!securityCheck.ok) {
        setError('Security block triggered!');
        return;
      }

      // Proceed with Supabase auth
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Mock authentication loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return { user, signOut, enhancedSignIn, isLoading, error };
};
