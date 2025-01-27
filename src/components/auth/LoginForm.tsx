'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormValues {
  username?: string;
  email: string;
  password: string;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }).superRefine((data, ctx) => {
    if (data.username === undefined && isSignup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username is required for signup',
        path: ['username']
      });
    }
  });
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError('');
    
    try {
      if (isSignup) {
        // Sign up new user
        const { error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username
            }
          }
        });
        
        if (signUpError) throw signUpError;
        onSuccess?.();
        navigate('/dashboard');
      } else {
        // Sign in existing user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        
        if (signInError) throw signInError;
        onSuccess?.();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isSignup && (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="Choose a username" 
                value={form.watch('username')}
                onChange={(e) => form.setValue('username', e.target.value)}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.username?.message}</FormMessage>
          </FormItem>
        )}
        
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your email" 
              value={form.watch('email')}
              onChange={(e) => form.setValue('email', e.target.value)}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>
        
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="Enter your password"
              value={form.watch('password')}
              onChange={(e) => form.setValue('password', e.target.value)}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormItem>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between">
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
