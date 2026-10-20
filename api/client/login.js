const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204); return res.end();
  }

  const sendJson = (status, data) => {
    if (res.status) return res.status(status).json(data);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  if (req.method !== 'POST') {
    return sendJson(405, { success: false, error: 'Método não permitido' });
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
      return sendJson(400, { success: false, error: 'E-mail e senha são obrigatórios.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return sendJson(500, { success: false, error: 'Configuração do servidor incompleta.' });
    }

    const anonClient = createClient(supabaseUrl, anonKey);
    const { data, error } = await anonClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (error || !data || !data.user) {
      return sendJson(401, {
        success: false,
        error: 'E-mail ou senha incorretos. Caso ainda não tenha criado sua conta, use a aba "Criar Minha Conta".'
      });
    }

    // Busca detalhes do membro no banco
    let memberData = null;
    if (serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      const { data: member } = await adminClient
        .from('members')
        .select('*')
        .ilike('email', cleanEmail)
        .limit(1);
      memberData = member?.[0] || null;
    }

    return sendJson(200, {
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: memberData?.name || data.user.user_metadata?.name || 'Fiel Registrado',
        phone: memberData?.phone || data.user.user_metadata?.phone || '',
        ddi: data.user.user_metadata?.ddi || '+258'
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token
      }
    });

  } catch (err) {
    console.error('❌ Erro no login de cliente:', err);
    return sendJson(500, { success: false, error: err.message });
  }
};
