import { supabase } from '../lib/supabase';
import { isAuthorizedAdminEmail } from '../utils/auth';

export interface Complaint {
  id?: string;
  user_id?: string;
  user_email?: string;
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
    
    // Resolve image URLs for all complaints
    const complaintsWithUrls = await Promise.all(
      (data || []).map(async (complaint) => {
        if (complaint.image_url) {
          const resolvedUrl = await this.getImageUrl(complaint.image_url);
          return {
            ...complaint,
            image_url: resolvedUrl || complaint.image_url,
          };
        }
        return complaint;
      })
    );

    return complaintsWithUrls;
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
    const payload = { ...complaint };
    if ('user_id' in payload) {
      delete payload.user_id;
    }
    
    // First attempt: Insert with dedicated user_email column
    const { data, error } = await supabase
      .from('complaints')
      .insert([payload])
      .select();

    if (error) {
      // If user_email column does not exist yet (PGRST204 or missing column),
      // fallback to embedding [Reported By: email] in description
      if (error.code === 'PGRST204' || error.message?.includes('user_email') || error.details?.includes('user_email')) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.user_email;
        if (payload.user_email && !fallbackPayload.description.includes('[Reported By:')) {
          fallbackPayload.description = `[Reported By: ${payload.user_email}] ${fallbackPayload.description}`;
        }
        const fallbackRes = await supabase
          .from('complaints')
          .insert([fallbackPayload])
          .select();
        if (fallbackRes.error) throw fallbackRes.error;
        return fallbackRes.data;
      }
      throw error;
    }

    return data;
  },

  async updateComplaintStatus(id: string | number, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAuthorizedAdminEmail(user.email)) {
      throw new Error('Unauthorized: Only the authorized system admin can update complaint statuses.');
    }

    // Notice: The complaints table does not have an updated_at column in the database schema.
    const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
    const { data, error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', numericId)
      .select();
    if (error) throw error;
    return data;
  },



  async uploadComplaintImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('complaint-images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  },

  async getImageUrl(path: string): Promise<string | null> {
    if (!path) return null;
    // If it's already a full URL (e.g. legacy data), return it
    if (path.startsWith('http')) return path;

    try {
      const { data, error } = await supabase.storage
        .from('complaint-images')
        .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days expiry

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
      if (error) {
        console.warn('Could not create signed URL, trying public URL fallback:', error);
      }
    } catch (e) {
      console.warn('Signed URL exception, trying fallback:', e);
    }

    const { data: publicData } = supabase.storage
      .from('complaint-images')
      .getPublicUrl(path);

    return publicData?.publicUrl || null;
  }
};

