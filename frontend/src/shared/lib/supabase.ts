import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TODO: Type the client with `createClient<Database>(...)` after generating
// complete types via `npx supabase gen types typescript --local` (requires
// Supabase running). The generated types include Relationships needed for
// typed join queries like `.select('*, detachments(*)')`.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
