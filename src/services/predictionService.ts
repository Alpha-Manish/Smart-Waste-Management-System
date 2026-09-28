import { supabase } from '../lib/supabase';

export interface Prediction {
  id?: string;
  bin_id: string;
  predicted_full_time: string;
  confidence_score: number;
  factors?: Record<string, any>;
  created_at?: string;
}

export const predictionService = {
  async getPredictions() {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getPredictionByBinId(binId: string) {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('bin_id', binId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
    return data;
  },

  async createPrediction(prediction: Prediction) {
    const { data, error } = await supabase
      .from('predictions')
      .insert([prediction])
      .select();
    if (error) throw error;
    return data;
  }
};
