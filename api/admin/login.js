const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204); return res.end();
  }

  const sendJson = (statusCode, payload) => {
    if (res.status) return res.status(statusCode).json(payload);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  if (req.method !== 'POST') {
    return sendJson(405, { error: 'Método não permitido' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    } else if (!body) {
      body = await new Promise((resolve) => {
        let b = '';
        req.on('data', chunk => { b += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(b || '{}')); } catch (e) { resolve({}); }
        });
      });
    }

    const { email, password } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return sendJson(400, { error: 'E-mail e senha são obrigatórios.' });
    }

    const adminEmailEnv = (process.env.ADMIN_EMAIL || 'osneysilva@icloud.com').trim().toLowerCase();
    const adminPassEnv = (process.env.ADMIN_PASSWORD || 'Minder_Ads1998').trim();

    // 1. Verificação prioritária de credenciais mestre
    if (cleanEmail === adminEmailEnv && cleanPassword === adminPassEnv) {
      return sendJson(200, {
        success: true,
        user: {
          id: '418b62c0-ca36-493d-8902-e76247bfffe9',
          email: adminEmailEnv,
          role: 'admin'
        }
      });
    }

    // 2. Verificação via Supabase Auth caso cadastrado
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      const anonClient = createClient(supabaseUrl, anonKey);
      const { data, error } = await anonClient.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (!error && data && data.user) {
        return sendJson(200, {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'admin'
          },
          session: {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token
          }
        });
      }
    }

    return sendJson(401, { error: 'Credenciais inválidas. Verifique o seu e-mail e senha.' });
  } catch (err) {
    return sendJson(500, { error: err.message });
  }
};
