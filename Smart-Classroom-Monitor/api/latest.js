import { createClient } from '@supabase/supabase-js';
function demoReading() {
  const minute = Math.floor(Date.now() / 60000);
  return { temp: Number((27.5 + Math.sin(minute / 8) * 1.8).toFixed(1)), hum: Number((59 + Math.sin(minute / 11) * 5).toFixed(1)), air: Math.round(345 + Math.cos(minute / 7) * 45), created_at: new Date().toISOString(), demo: true };
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) return res.status(200).json(demoReading());
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('sensor_readings').select('temp, hum, air, created_at').order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (error || !data) return res.status(200).json(demoReading());
    return res.status(200).json(data);
  } catch {
    return res.status(200).json(demoReading());
  }
}