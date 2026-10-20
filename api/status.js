const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204); return res.end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  const data = {
    status: 'online',
    app: '7 Dias com Jesus',
    supabase: {
      connected: !!(supabaseUrl && supabaseKey),
      url: supabaseUrl,
      projectRef: process.env.SUPABASE_PROJECT_REF
    },
    timestamp: new Date().toISOString()
  };

  if (res.status) return res.status(200).json(data);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
