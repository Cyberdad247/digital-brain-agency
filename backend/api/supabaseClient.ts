import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types/supabase.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in environment variables');
}

const config: SupabaseConfig = {
  url: supabaseUrl,
  key: supabaseKey,
};

const supabase = createClient(config.url, config.key);

export default supabase;
