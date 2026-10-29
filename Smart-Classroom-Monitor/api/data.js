import { createClient } from '@supabase/supabase-js';
const demoRows = (count = 48) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    temp: Number((27 + Math.sin(i / 5) * 2.4 + Math.sin(i / 2.4) * 0.5).toFixed(1)),
    hum: Number((58 + Math.sin(i / 6) * 8 + Math.cos(i / 3) * 2).toFixed(1)),
    air: Math.round(330 + Math.sin(i / 4) * 70 + Math.cos(i / 2.5) * 25),
    created_at: new Date(now - (count - i - 1) * 30 * 60 * 1000).toISOString()
  }));
};
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
  if (req.method === 'POST') {
    if (!process.env.ESP32_API_KEY || req.headers['x-api-key'] !== process.env.ESP32_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
    if (!supabase) return res.status(503).json({ error: 'Database not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY.' });
    const { temp, hum, air } = req.body || {};
    if (![temp, hum, air].every(v => Number.isFinite(Number(v)))) return res.status(400).json({ error: 'temp, hum and air must be numeric.' });
    const { error } = await supabase.from('sensor_readings').insert([{ temp: Number(temp), hum: Number(hum), air: Number(air) }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ status: 'ok' });
  }
  if (req.method === 'GET') {
    if (!supabase) return res.status(200).json(demoRows());
    const ranges = { hour: 1, day: 24, week: 168, month: 720, month2: 1440 };
    const hours = ranges[req.query?.range] || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase.from('sensor_readings').select('temp, hum, air, created_at').gte('created_at', since).order('created_at', { ascending: true }).limit(2000);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data?.length ? data : demoRows());
  }
  return res.status(405).json({ error: 'Method not allowed' });
}