# ✝ Conexão do Supabase — 7 Dias com Jesus

O projeto está 100% conectado com o **Supabase** através do backend Node.js, front-end do Web App e ferramentas de CLI.

---

## 📌 Credenciais Configuradas no Projeto

As credenciais fornecidas foram salvas com segurança no arquivo [`.env`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/.env) e integradas em [`config.js`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/config.js):

* **Project URL**: `https://eokhadlpvyuejulwxnvq.supabase.co`
* **Project Reference**: `eokhadlpvyuejulwxnvq`
* **Chave Pública (Anon)**: Utilizada no front-end (`app.html`) para sincronização em tempo real de devocionais e progresso.
* **Chave Administrativa (Service Role)**: Utilizada no backend (`server.js`) e no CLI (`supabase-admin.js`) com acesso total para criação de usuários, processamento de pedidos e auditoria.

---

## 🗄️ Tabelas Estruturadas para o SaaS

Criamos a migração SQL oficial em [`supabase/migrations/20261018000001_create_7_dias_tables.sql`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/supabase/migrations/20261018000001_create_7_dias_tables.sql).

### Como Rodar no Painel do Supabase (1 Minuto):
1. Acesse o seu painel do Supabase: [https://supabase.com/dashboard/project/eokhadlpvyuejulwxnvq](https://supabase.com/dashboard/project/eokhadlpvyuejulwxnvq)
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New Query**.
4. Abra o arquivo [`supabase/migrations/20261018000001_create_7_dias_tables.sql`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/supabase/migrations/20261018000001_create_7_dias_tables.sql), copie todo o conteúdo e cole no editor.
5. Clique em **Run** (Executar).

As seguintes tabelas serão criadas instantaneamente:
* `members`: Membros ativos e dados de inscrição.
* `user_progress`: Progresso diário (Dia 1 ao 7) de cada fiel.
* `user_diary`: O Diário de Fé onde ficam salvas as reflexões e orações de cada dia.
* `tutora_orders`: Histórico de pedidos pagos via M-Pesa, E-Mola e Cartão na Tutora.

---

## 🛠️ CLI de Administração do Projeto

Nós criamos uma ferramenta de linha de comando (`supabase-admin.js`) com **acesso total** ao seu Supabase.

Execute no terminal:

```bash
# 1. Verificar o status da conexão
node supabase-admin.js status

# 2. Listar todos os usuários cadastrados
node supabase-admin.js users

# 3. Criar um usuário manualmente no Supabase Auth
node supabase-admin.js create-user usuario@exemplo.com SenhaSegura123

# 4. Listar pedidos e transações da Tutora
node supabase-admin.js orders

# 5. Listar progresso dos membros
node supabase-admin.js progress
```

---

## 🔌 Webhook Automático da Tutora

O servidor local (`server.js`) agora possui o endpoint de integração com a Tutora:
* **URL do Webhook**: `http://localhost:3000/api/tutora-webhook` (ou a URL do seu domínio em produção)
* Quando a Tutora aprovar um pagamento via **M-Pesa** ou **E-Mola**, ela enviará os dados automaticamente para este endpoint, que:
  1. Grava a transação na tabela `tutora_orders`.
  2. Ativa o acesso do membro na tabela `members`.

---

## 🔑 Nota Sobre o Supabase CLI Oficial

Se desejar usar os comandos remotos da CLI oficial do Supabase (como `supabase link` ou `supabase db push`):
1. Aceda a [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens).
2. Clique em **Generate New Token** (Token de Acesso Pessoal).
3. No terminal, execute:
   ```bash
   npx supabase login --token SEU_TOKEN_SBP_AQUI
   npx supabase link --project-ref eokhadlpvyuejulwxnvq
   ```
*(Lembrando que o nosso CLI `node supabase-admin.js` e o servidor já têm acesso total imediato utilizando a chave Service Role que você forneceu!)*
