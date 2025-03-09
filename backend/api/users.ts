import { Request, Response } from 'express';

import supabase from './supabaseClient';

const handler = async (req: Request, res: Response): Promise<void> => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all users
    try {
      const { data, error } = await supabase.from('users').select('*');

      if (error) {
        console.error('Supabase Error Details:', error);
        return res.status(500).json({ error: 'Failed to get users', details: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error getting users:', error);
      return res.status(500).json({ error: 'Failed to get users' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export { handler };
