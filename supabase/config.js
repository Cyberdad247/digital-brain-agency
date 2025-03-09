/**
 * Supabase Configuration File
 *
 * This file holds the database connection settings and related configurations.
 * For further database migrations and scripts, refer to the supabase/migrations/ directory.
 * Ensure that all database interactions are well-documented.
 */

// Ensure sensitive keys are read from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
