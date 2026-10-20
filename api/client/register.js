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

    const { email, password, name, phone, ddi } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const cleanDdi = (ddi || '+258').trim();
    const fullPhone = cleanPhone ? `${cleanDdi}${cleanPhone}` : '';

    if (!cleanEmail || !cleanPassword) {
      return sendJson(400, { success: false, error: 'E-mail e senha são obrigatórios.' });
    }

    if (cleanPassword.length < 6) {
      return sendJson(400, { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return sendJson(500, { success: false, error: 'Configuração do servidor incompleta.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Verificação de compra aprovada na Tutora
    const { data: orders } = await supabaseAdmin
      .from('tutora_orders')
      .select('*')
      .ilike('customer_email', cleanEmail)
      .neq('status', 'refunded')
      .limit(1);

    const { data: members } = await supabaseAdmin
      .from('members')
      .select('*')
      .ilike('email', cleanEmail)
      .eq('payment_status', 'approved')
      .limit(1);

    const adminEmail = (process.env.ADMIN_EMAIL || 'osneysilva@icloud.com').trim().toLowerCase();
    const isPurchased = (orders && orders.length > 0) || (members && members.length > 0) || cleanEmail === adminEmail;

    if (!isPurchased) {
      return sendJson(403, {
        success: false,
        not_purchased: true,
        error: 'Nenhum pagamento aprovado na Tutora foi encontrado para este e-mail.',
        message: 'Para acessar os 7 Dias com Jesus, é necessário adquirir a jornada na Tutora com este e-mail.'
      });
    }

    // 2. Criação ou atualização do usuário no Supabase Auth
    let authUser = null;

    // Verifica se já existe em auth.users
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuth = userList?.users?.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (existingAuth) {
      // Atualiza senha e metadados
      const { data: updated, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        existingAuth.id,
        {
          password: cleanPassword,
          user_metadata: { name: cleanName, phone: fullPhone, ddi: cleanDdi }
        }
      );
      if (updateErr) throw updateErr;
      authUser = updated.user;
    } else {
      // Cria novo usuário
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: cleanPassword,
        email_confirm: true,
        user_metadata: { name: cleanName, phone: fullPhone, ddi: cleanDdi }
      });
      if (createErr) throw createErr;
      authUser = created.user;
    }

    // 3. Atualiza tabela public.members
    await supabaseAdmin.from('members').upsert({
      email: cleanEmail,
      name: cleanName || orders?.[0]?.customer_name || 'Fiel Registrado',
      phone: fullPhone || orders?.[0]?.customer_phone || '',
      status: 'active',
      payment_status: 'approved',
      auth_user_id: authUser.id,
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' });

    // 4. Gera sessão de login com anon client
    let session = null;
    if (anonKey) {
      const anonClient = createClient(supabaseUrl, anonKey);
      const { data: authData } = await anonClient.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });
      session = authData?.session || null;
    }

    return sendJson(200, {
      success: true,
      message: 'Conta de membro criada com sucesso!',
      user: {
        id: authUser.id,
        email: cleanEmail,
        name: cleanName || authUser.user_metadata?.name || 'Fiel Registrado',
        phone: fullPhone || authUser.user_metadata?.phone || '',
        ddi: cleanDdi
      },
      session
    });

  } catch (err) {
    console.error('❌ Erro no registro de cliente:', err);
    return sendJson(500, { success: false, error: err.message });
  }
};
