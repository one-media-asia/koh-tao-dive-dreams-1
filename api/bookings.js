// /api/bookings.js (for Vercel)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

export default async function handler(req, res) {
  let supabase;

  try {
    supabase = getSupabase();
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Supabase is not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ bookings: data });
  }

  if (req.method === 'POST') {
    const { id, ...rest } = req.body || {};

    if (!id) {
      if (!rest.name || !rest.email) {
        return res.status(400).json({ error: 'Missing required fields: name and email' });
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...rest, created_at: rest.created_at || new Date().toISOString() }])
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
