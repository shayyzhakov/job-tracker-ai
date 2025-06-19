import { createClient } from '@supabase/supabase-js';

export function initializeSupabase(
  supabaseUrl: string,
  supabaseAnonKey: string,
) {
  return createClient(supabaseUrl, supabaseAnonKey);
}
