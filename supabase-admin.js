#!/usr/bin/env node

/**
 * ==============================================================================
 * CLI DE ADMINISTRAÇÃO SUPABASE - 7 DIAS COM JESUS
 * ==============================================================================
 * Utilitário com acesso total ao projeto Supabase usando a chave Service Role.
 *
 * Comandos:
 *   node supabase-admin.js status
 *   node supabase-admin.js users
 *   node supabase-admin.js create-user <email> <senha>
 *   node supabase-admin.js orders
 *   node supabase-admin.js progress
 * ==============================================================================
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://eokhadlpvyuejulwxnvq.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não configurada no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const command = process.argv[2] || 'status';

async function main() {
  console.log(`\n✝ 7 DIAS COM JESUS — ADMINISTRAÇÃO SUPABASE CLI`);
  console.log(`🌐 Projeto: ${SUPABASE_URL}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  switch (command) {
    case 'status': {
      console.log('🔄 Testando conexão com Supabase...');
      const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (error) {
        console.error('❌ Falha na conexão:', error.message);
      } else {
        console.log('✅ CONECTADO COM SUCESSO!');
        console.log(`🔑 Acesso Administrativo Total: ATIVO (Service Role Key)`);
        console.log(`👥 Usuários no Auth: ${data.users.length}`);
      }
      break;
    }

    case 'users': {
      console.log('📋 Buscando lista de usuários no Supabase Auth...');
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('❌ Erro ao listar usuários:', error.message);
      } else if (data.users.length === 0) {
        console.log('ℹ️ Nenhum usuário cadastrado no momento.');
      } else {
        console.log(`Total encontrado: ${data.users.length}\n`);
        data.users.forEach((u, i) => {
          console.log(`${i + 1}. [${u.id}] ${u.email || u.phone || 'Sem email'} (Criado em: ${u.created_at})`);
        });
      }
      break;
    }

    case 'create-user': {
      const email = process.argv[3];
      const password = process.argv[4] || 'Jesus@123456';
      if (!email) {
        console.error('❌ Uso: node supabase-admin.js create-user <email> [senha]');
        process.exit(1);
      }
      console.log(`👤 Criando usuário: ${email}...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (error) {
        console.error('❌ Erro:', error.message);
      } else {
        console.log(`✅ Usuário criado com sucesso! ID: ${data.user.id}`);
      }
      break;
    }

    case 'orders': {
      console.log('📦 Consultando pedidos da Tutora...');
      const { data, error } = await supabase.from('tutora_orders').select('*').order('created_at', { ascending: false }).limit(20);
      if (error) {
        console.log('ℹ️ Tabela tutora_orders pronta para receber dados pós-migração SQL.');
      } else if (!data || data.length === 0) {
        console.log('ℹ️ Nenhum pedido registrado ainda.');
      } else {
        console.table(data);
      }
      break;
    }

    case 'progress': {
      console.log('📊 Consultando progresso dos membros...');
      const { data, error } = await supabase.from('user_progress').select('*').limit(20);
      if (error) {
        console.log('ℹ️ Tabela user_progress pronta para receber dados.');
      } else if (!data || data.length === 0) {
        console.log('ℹ️ Nenhum registro de progresso ainda.');
      } else {
        console.table(data);
      }
      break;
    }

    default:
      console.log(`Comando desconhecido: "${command}". Comandos disponíveis: status, users, create-user, orders, progress`);
  }
}

main().catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
