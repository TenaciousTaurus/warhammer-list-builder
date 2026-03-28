import { createClient } from '@supabase/supabase-js';
// Import generated types when available (run `npm run gen:types` after schema changes)
// import type { Database } from '../types/supabase-generated';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
