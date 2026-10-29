import { createClient } from '@supabase/supabase-js';
const defaults = { id: 1, temp_limit: 30, hum_limit: 75, air_limit: 500 };
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  return url && key ? createClient(url, key) : null;
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const supabase = getClient();
  if (req.method === 'GET') {
    if (!supabase) return res.status(200).json(defaults);
    try {
      const { data, error } = await supabase.from('thresholds').select('*').eq('id', 1).maybeSingle();
      return res.status(200).json(error || !data ? defaults : data);
    } catch { return res.status(200).json(defaults); }
  }
  if (req.method === 'POST') {
    const body = req.body || {};
    const next = { id: 1, temp_limit: Number(body.temp_limit), hum_limit: Number(body.hum_limit), air_limit: Number(body.air_limit) };
    if (![next.temp_limit, next.hum_limit, next.air_limit].every(Number.isFinite)) return res.status(400).json({ error: 'All threshold values must be numeric.' });
    if (!supabase) return res.status(200).json({ status: 'demo-only', ...next, note: 'Add Supabase environment variables to persist thresholds.' });
    const { error } = await supabase.from('thresholds').upsert([next]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ status: 'ok', ...next });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}