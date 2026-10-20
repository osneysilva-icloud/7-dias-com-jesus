const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204); return res.end();
  }

  const sendJson = (status, data) => {
    if (res.status) return res.status(status).json(data);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    let email = '';
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      email = url.searchParams.get('email') || '';
    } else {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      email = body?.email || '';
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return sendJson(400, { allowed: false, error: 'E-mail é obrigatório.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return sendJson(500, { allowed: false, error: 'Configuração do servidor incompleta.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Busca em tutora_orders
    const { data: orders } = await supabaseAdmin
      .from('tutora_orders')
      .select('*')
      .ilike('customer_email', cleanEmail)
      .neq('status', 'refunded')
      .order('created_at', { ascending: false })
      .limit(1);

    // 2. Busca em members
    const { data: members } = await supabaseAdmin
      .from('members')
      .select('*')
      .ilike('email', cleanEmail)
      .eq('payment_status', 'approved')
      .limit(1);

    const adminEmail = (process.env.ADMIN_EMAIL || 'osneysilva@icloud.com').trim().toLowerCase();
    const hasOrder = orders && orders.length > 0;
    const hasMember = members && members.length > 0;
    const isAdmin = cleanEmail === adminEmail;

    if (hasOrder || hasMember || isAdmin) {
      const foundOrder = orders?.[0];
      const foundMember = members?.[0];
      return sendJson(200, {
        allowed: true,
        purchased: true,
        customer_name: foundOrder?.customer_name || foundMember?.name || (isAdmin ? 'Administrador' : ''),
        customer_phone: foundOrder?.customer_phone || foundMember?.phone || '',
        message: 'Compra aprovada na Tutora localizada com sucesso!'
      });
    }

    return sendJson(200, {
      allowed: false,
      purchased: false,
      message: 'Nenhum pagamento aprovado na Tutora foi encontrado com este e-mail.'
    });

  } catch (err) {
    return sendJson(500, { allowed: false, error: err.message });
  }
};
