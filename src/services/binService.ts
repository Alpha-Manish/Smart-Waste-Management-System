import { supabase } from '../lib/supabase';

export interface Bin {
  id?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  fill_level: number;
  status: 'empty' | 'half_full' | 'full' | 'overflowing';
  last_collected_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const binService = {
  async getBins() {
    const { data, error } = await supabase
      .from('bins')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getBinById(id: string) {
    const { data, error } = await supabase
      .from('bins')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createBin(bin: Bin) {
    const { data, error } = await supabase
      .from('bins')
      .insert([bin])
      .select();
    if (error) throw error;
    return data;
  },

  async updateBinFillLevel(id: string, fill_level: number, status: string) {
    const { data, error } = await supabase
      .from('bins')
      .update({ fill_level, status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }
};
