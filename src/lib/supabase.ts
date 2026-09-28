import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('Supabase URL and Anon Key are missing. Please set them in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Connection testing utility
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('test_connection').select('*').limit(1);
    if (error && error.code !== '42P01') { // 42P01 is relation does not exist
      throw error;
    }
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return false;
  }
};
