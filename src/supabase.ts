import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amnqqqglmwgvvcjyqvte.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbnFxcWdsbXdndnZjanlxdnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjY0MTcsImV4cCI6MjA2NTYwMjQxN30.Nto5QmhRUsDBvGgowsJ5pjOFffjvaVkN9QqE8pAiwOE';

export function initializeSupabase(authToken?: string, refreshToken?: string) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
  return supabase;
}
