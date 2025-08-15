import { supabase } from './client';

export interface ConsultationData {
  user_id: string;
  question: string;
  hexagram_number: number;
  hexagram_name: string;
  lines: number[];
  changing_lines?: number[];
  interpretation: {
    interpretation: string;
    guidance?: string;
    practicalAdvice?: string;
    culturalContext?: string;
  };
  consultation_method?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  status?: 'active' | 'archived';
  tags?: string[];
  notes?: string | null;
}

export interface Consultation {
  id: string;
  user_id: string;
  question: string;
  hexagram_number: number;
  hexagram_name: string;
  lines: number[];
  changing_lines: number[];
  interpretation: {
    interpretation: string;
    guidance?: string;
    practicalAdvice?: string;
    culturalContext?: string;
  };
  consultation_method: string;
  ip_address: string | null;
  user_agent: string | null;
  status: 'active' | 'archived';
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Save a new consultation to the database
 */
export async function saveConsultation(
  data: ConsultationData
): Promise<Consultation> {
  const { data: result, error } = await supabase
    .from('consultations')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return result;
}

/**
 * Get consultations for a specific user
 */
export async function getUserConsultations(
  userId: string,
  limit: number = 20
): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get a specific consultation by ID
 */
export async function getConsultationById(
  id: string
): Promise<Consultation | null> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // Handle not found error specifically
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update a consultation
 */
export async function updateConsultation(
  id: string,
  updates: Partial<Pick<Consultation, 'notes' | 'tags' | 'status'>>
): Promise<Consultation> {
  const { data, error } = await supabase
    .from('consultations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete a consultation (soft delete by marking as archived)
 */
export async function deleteConsultation(id: string): Promise<void> {
  const { error } = await supabase
    .from('consultations')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get consultation statistics for a user
 */
export async function getUserConsultationStats(userId: string) {
  const { data, error } = await supabase
    .from('consultation_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return (
    data || {
      total_consultations: 0,
      unique_hexagrams: 0,
      last_consultation: null,
      first_consultation: null,
    }
  );
}

/**
 * Search consultations by question text
 */
export async function searchConsultations(
  userId: string,
  searchTerm: string,
  limit: number = 10
): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .ilike('question', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
