import { supabase } from '../lib/supabase';
import { isAuthorizedAdminEmail } from '../utils/auth';
import { mockBins } from '../data/mockBins';

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
const mapDBToBin = (dbBin: any): Bin => {
  const fallbackDate = dbBin.created_at 
    ? new Date(dbBin.created_at).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  return {
    id: dbBin.id,
    name: dbBin.bin_name || dbBin.name || 'Unknown Bin',
    location: dbBin.location || 'Unknown Location',
    capacity: dbBin.capacity ? `${dbBin.capacity}L` : '120L',
    fillPercentage: dbBin.fill_percentage ?? dbBin.fillPercentage ?? 0,
    status: dbBin.status || 'Empty',
    lastCollectedDate: dbBin.last_collection_date || dbBin.lastCollectedDate || fallbackDate,
    created_at: dbBin.created_at,
  };
};

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
    try {
      const { data, error } = await supabase
        .from('bins')
        .select('*');
      if (error) throw error;
      const dbBins = (data || []).map(mapDBToBin);
      return dbBins.length > 0 ? dbBins : mockBins;
    } catch (err) {
      console.warn('Database query failed, returning local mock bins:', err);
      return mockBins;
    }
  },

  async getBinById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return mapDBToBin(data);
      }
    } catch (err) {
      // Ignore database query error and fallback to mock data
    }
    const localBin = mockBins.find(b => b.id === id);
    if (localBin) return localBin;
    throw new Error('Bin not found');
  },

  async createBin(bin: Bin) {
    await assertAdmin();
    if (!bin.lastCollectedDate) {
      bin.lastCollectedDate = new Date().toISOString().split('T')[0];
    }
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

