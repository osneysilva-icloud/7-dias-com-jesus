require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 3000;

// Inicializa cliente administrativo do Supabase se houver chave
let supabaseAdmin = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    console.log('✓ Supabase Admin conectado no servidor!');
  } catch (e) {
    console.warn('! Supabase não inicializado no servidor:', e.message);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqUrl = req.url.split('?')[0];

  // ============================================================================
  // ENDPOINT API: Status do Servidor e Supabase
  // ============================================================================
  if (reqUrl === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      app: '7 Dias com Jesus',
      supabase: {
        connected: !!supabaseAdmin,
        url: process.env.SUPABASE_URL,
        projectRef: process.env.SUPABASE_PROJECT_REF
      },
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ============================================================================
  // ENDPOINT API: Autenticação Segura do Administrador (Infalível e Resiliente)
  // ============================================================================
  if (reqUrl === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body || '{}');
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();

        if (!cleanEmail || !cleanPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'E-mail e senha são obrigatórios.' }));
          return;
        }

        const adminEmailEnv = (process.env.ADMIN_EMAIL || 'osneysilva@icloud.com').trim().toLowerCase();
        const adminPassEnv = (process.env.ADMIN_PASSWORD || 'Minder_Ads1998').trim();

        // 1. Verificação prioritária de credenciais mestre do Administrador
        if (cleanEmail === adminEmailEnv && cleanPassword === adminPassEnv) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            user: {
              id: '418b62c0-ca36-493d-8902-e76247bfffe9',
              email: adminEmailEnv,
              role: 'admin'
            }
          }));
          return;
        }

        // 2. Verificação via Supabase Auth caso seja outro usuário cadastrado
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
          const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
          const { data, error } = await anonClient.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword
          });

          if (!error && data && data.user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
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
            }));
            return;
          }
        }

        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Credenciais inválidas. Verifique o seu e-mail e senha.' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ============================================================================
  // ENDPOINT API: Webhook Oficial da Tutora (Moçambique & Internacional)
  // Suporta estrutura da documentação oficial da Tutora (order.paid / payload.data)
  // ============================================================================
  if (reqUrl === '/api/tutora-webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        console.log('📬 Webhook recebido da Tutora:', JSON.stringify(payload));

        // Normalização de dados (lê tanto payload.data quanto formato raiz)
        const d = payload.data || payload;
        const customer = d.customer || payload.customer || {};
        const transactionId = d.id || d.transaction_id || d.code || payload.id || `tutora_${Date.now()}`;
        const paymentStatus = d.status || payload.status || payload.event || 'completed';
        const isRefund = paymentStatus.includes('refund') || payload.event === 'order.refunded';

        // Gravação no Supabase
        if (supabaseAdmin) {
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
            }, { onConflict: 'phone' });
          }

          console.log(`✅ Webhook Tutora gravado com sucesso! ID: ${transactionId}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true, status: 'success' }));
      } catch (err) {
        console.error('❌ Erro no webhook da Tutora:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ============================================================================
  // ARQUIVOS ESTÁTICOS DO APP E LANDING PAGE
  // ============================================================================
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  } else if (reqUrl === '/admin') {
    reqUrl = '/admin.html';
  }

  const filePath = path.join(__dirname, reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Não Encontrado</h1><p>Página não encontrada. <a href="/">Voltar ao Início</a></p>');
      } else {
        res.writeHead(500);
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✝ 7 DIAS COM JESUS - APLICATIVO E FUNIL DE CONVERSÃO`);
  console.log(`=======================================================`);
  console.log(`🚀 Servidor rodando com sucesso!`);
  console.log(`🌐 Landing Page (Funil VSL + Oferta): http://localhost:${PORT}/index.html`);
  console.log(`📱 Web App dos 7 Dias (Área de Membros): http://localhost:${PORT}/app.html`);
  console.log(`🔌 Webhook Tutora: http://localhost:${PORT}/api/tutora-webhook`);
  console.log(`📊 Status da Conexão: http://localhost:${PORT}/api/status`);
  console.log(`=======================================================`);
});
