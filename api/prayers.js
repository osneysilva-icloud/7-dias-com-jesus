const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(500, { success: false, error: 'Configuração do servidor incompleta.' });
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const getPrayers = async () => {
    try {
      const { data, error } = await sb.storage.from('community').download('prayer_requests.json');
      if (error || !data) return [];
      const text = await data.text();
      return JSON.parse(text || '[]');
    } catch (e) {
      return [];
    }
  };

  const savePrayers = async (prayers) => {
    const buf = Buffer.from(JSON.stringify(prayers, null, 2));
    await sb.storage.from('community').upload('prayer_requests.json', buf, {
      contentType: 'application/json',
      upsert: true
    });
  };

  try {
    if (req.method === 'GET') {
      const prayers = await getPrayers();
      return sendJson(200, { success: true, prayers });
    }

    if (req.method === 'POST') {
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

      const { action, name, request, location, prayerId, userPhone } = body || {};

      if (action === 'create') {
        const cleanRequest = (request || '').trim();
        const cleanName = (name || 'Fiel em Cristo').trim();
        const cleanLocation = (location || '').trim();

        if (!cleanRequest || cleanRequest.length < 5) {
          return sendJson(400, { success: false, error: 'O pedido de oração precisa ter pelo menos 5 caracteres.' });
        }

        const prayers = await getPrayers();
        const newPrayer = {
          id: 'pr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          name: cleanName,
          location: cleanLocation,
          request: cleanRequest,
          prayerCount: 1,
          intercessors: userPhone ? [userPhone] : [],
          createdAt: new Date().toISOString()
        };

        prayers.unshift(newPrayer);
        // Mantém as 100 orações mais recentes
        if (prayers.length > 100) prayers.length = 100;
        await savePrayers(prayers);

        return sendJson(200, { success: true, prayer: newPrayer, message: 'Pedido publicado com sucesso!' });
      }

      if (action === 'intercede') {
        if (!prayerId) {
          return sendJson(400, { success: false, error: 'ID do pedido obrigatório.' });
        }

        const prayers = await getPrayers();
        const target = prayers.find(p => p.id === prayerId);
        if (!target) {
          return sendJson(404, { success: false, error: 'Pedido não encontrado.' });
        }

        target.prayerCount = (target.prayerCount || 0) + 1;
        if (!target.intercessors) target.intercessors = [];
        if (userPhone && !target.intercessors.includes(userPhone)) {
          target.intercessors.push(userPhone);
        }

        await savePrayers(prayers);
        return sendJson(200, { success: true, prayerCount: target.prayerCount, message: 'Intercessão registrada!' });
      }

      return sendJson(400, { success: false, error: 'Ação não reconhecida.' });
    }

    return sendJson(405, { success: false, error: 'Método não permitido.' });

  } catch (err) {
    console.error('❌ Erro no mural de orações:', err);
    return sendJson(500, { success: false, error: err.message });
  }
};
