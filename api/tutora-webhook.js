const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  if (req.method === 'GET') {
    return sendJson(200, { status: 'Webhook endpoint pronto para receber requisições POST da Tutora' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) {}
    } else if (!payload) {
      payload = await new Promise((resolve) => {
        let b = '';
        req.on('data', chunk => { b += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(b || '{}')); } catch (e) { resolve({}); }
        });
      });
    }
    payload = payload || {};
    console.log('📬 Webhook recebido da Tutora:', JSON.stringify(payload));

    const d = payload.data || payload;
    const customer = d.customer || payload.customer || {};
    const transactionId = d.id || d.transaction_id || d.code || payload.id || `tutora_${Date.now()}`;
    const paymentStatus = d.status || payload.status || payload.event || 'completed';
    const isRefund = String(paymentStatus).includes('refund') || payload.event === 'order.refunded';

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      await supabaseAdmin.from('tutora_orders').upsert({
        tutora_transaction_id: String(transactionId),
        customer_name: customer.name || d.name || 'Cliente Tutora',
        customer_email: customer.email || d.email || '',
        customer_phone: customer.phone || d.phone || '',
        amount: d.amount || 197.00,
        currency: d.currency || 'MT',
        payment_method: d.payment_method || 'M-Pesa',
        status: isRefund ? 'refunded' : 'completed',
        raw_payload: payload
      }, { onConflict: 'tutora_transaction_id' });

      if (customer.email || customer.phone) {
        await supabaseAdmin.from('members').upsert({
          email: customer.email || '',
          phone: customer.phone || '',
          name: customer.name || '',
          status: isRefund ? 'canceled' : 'active',
          payment_status: isRefund ? 'refunded' : 'approved'
        }, { onConflict: customer.email ? 'email' : 'phone' });
      }
    }

    return sendJson(200, { success: true, transactionId });
  } catch (err) {
    console.error('❌ Erro no webhook da Tutora:', err.message);
    return sendJson(400, { error: err.message });
  }
};
