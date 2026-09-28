import { supabase } from '../lib/supabase';

export interface Complaint {
  id?: string;
  user_id?: string;
  title?: string;
  issue_type?: string;
  description: string;
  location: string;
  status: string; // 'Pending' | 'In Progress' | 'Resolved' etc.
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const complaintService = {
  async getComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getComplaintById(id: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createComplaint(complaint: Complaint) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        ...complaint,
        user_id: user?.id // automatically attach the logged-in user
      }])
      .select();
    if (error) throw error;
    return data;
  },

  async updateComplaintStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }
};
