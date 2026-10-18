-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS - SAAS 7 DIAS COM JESUS (SUPABASE)
-- ==============================================================================

-- 1. Tabela de Membros / Usuários
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    name TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'pending', 'canceled'
    payment_status TEXT DEFAULT 'approved', -- 'approved', 'trial'
    subscription_type TEXT DEFAULT 'lifetime_access',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Progresso dos 7 Dias
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    phone TEXT, -- identificador rápido via telemóvel/M-Pesa
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (member_id, day)
);

-- 3. Tabela do Diário de Fé Pessoal
CREATE TABLE IF NOT EXISTS public.user_diary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    phone TEXT,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
    reflection TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (member_id, day)
);

-- 4. Tabela de Pedidos / Transações da Tutora (Moçambique)
CREATE TABLE IF NOT EXISTS public.tutora_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutora_transaction_id TEXT UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    amount NUMERIC DEFAULT 197.00,
    currency TEXT DEFAULT 'MT',
    payment_method TEXT, -- 'M-Pesa', 'E-Mola', 'Cartao'
    status TEXT DEFAULT 'completed', -- 'completed', 'refunded'
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_progress_member ON public.user_progress(member_id);
CREATE INDEX IF NOT EXISTS idx_progress_phone ON public.user_progress(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tutora_id ON public.tutora_orders(tutora_transaction_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutora_orders ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (RLS)
-- Permitir leitura e escrita para chaves anon e autenticadas do app
CREATE POLICY "Permitir acesso anon ao progresso" ON public.user_progress
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso anon ao diario" ON public.user_diary
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de membros" ON public.members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir insercao de pedidos da tutora" ON public.tutora_orders
    FOR ALL USING (true) WITH CHECK (true);
