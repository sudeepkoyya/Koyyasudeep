import { createClient } from '@supabase/supabase-js';

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
  if (!supabase) {
    if (req.method === 'GET') return res.status(200).json([]);
    if (req.method === 'POST') return res.status(200).json({ status: 'demo-only', note: 'Configure Supabase to persist alerts.' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    if (!process.env.ESP32_API_KEY || req.headers['x-api-key'] !== process.env.ESP32_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
    const { type, value, limit } = req.body || {};
    const { error } = await supabase.from('alerts').insert([{ type, value, alert_limit: limit }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ status: 'ok' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
