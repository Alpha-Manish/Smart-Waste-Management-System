import { supabase } from '../lib/supabase';
import { isAuthorizedAdminEmail } from '../utils/auth';

export interface Bin {
  id?: string;
  name: string;
  location: string;
  capacity: string;
  fillPercentage: number;
  status: string;
  lastCollectedDate?: string;
  created_at?: string;
  updated_at?: string;
}

// Maps Database schema to Frontend Bin interface
const mapDBToBin = (dbBin: any): Bin => ({
  id: dbBin.id,
  name: dbBin.bin_name || dbBin.name || 'Unknown Bin',
  location: dbBin.location || 'Unknown Location',
  capacity: dbBin.capacity ? `${dbBin.capacity}L` : '120L',
  fillPercentage: dbBin.fill_percentage ?? dbBin.fillPercentage ?? 0,
  status: dbBin.status || 'Empty',
  lastCollectedDate: dbBin.last_collection_date || dbBin.lastCollectedDate || undefined,
  created_at: dbBin.created_at,
});

// Maps Frontend Bin interface to Database schema
const mapBinToDB = (bin: Partial<Bin>): any => {
  const dbBin: any = {};
  
  if (bin.name !== undefined) dbBin.bin_name = bin.name;
  if (bin.location !== undefined) dbBin.location = bin.location;
  
  if (bin.capacity !== undefined) {
    // Convert '120L' to integer 120
    dbBin.capacity = parseInt(bin.capacity.replace(/\D/g, ''), 10) || 120;
  }
  
  if (bin.fillPercentage !== undefined) {
    // Validate fill percentage between 0 and 100
    dbBin.fill_percentage = Math.max(0, Math.min(100, Number(bin.fillPercentage) || 0));
  }
  
  if (bin.status !== undefined) dbBin.status = bin.status;
  
  if (bin.lastCollectedDate !== undefined) {
    dbBin.last_collection_date = bin.lastCollectedDate;
  }
  
  return dbBin;
};

const assertAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAuthorizedAdminEmail(user.email)) {
    throw new Error('Unauthorized: Only the authorized system admin can perform this operation.');
  }
};

export const binService = {
  async getBins() {
    const { data, error } = await supabase
      .from('bins')
      .select('*');
    if (error) throw error;
    return (data || []).map(mapDBToBin);
  },

  async getBinById(id: string) {
    const { data, error } = await supabase
      .from('bins')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return mapDBToBin(data);
  },

  async createBin(bin: Bin) {
    await assertAdmin();
    const dbPayload = mapBinToDB(bin);
    const { data, error } = await supabase
      .from('bins')
      .insert([dbPayload])
      .select()
      .single();
    if (error) throw error;
    return mapDBToBin(data);
  },

  async updateBin(id: string, bin: Partial<Bin>) {
    await assertAdmin();
    const dbPayload = mapBinToDB(bin);
    // Remove id from payload if it exists
    delete dbPayload.id;
    
    const { data, error } = await supabase
      .from('bins')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDBToBin(data);
  },

  async deleteBin(id: string) {
    await assertAdmin();
    const { error } = await supabase
      .from('bins')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};

