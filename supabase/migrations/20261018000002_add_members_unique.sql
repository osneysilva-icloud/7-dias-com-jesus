-- Adicionar constraint UNIQUE em phone para permitir upsert na tabela members
ALTER TABLE public.members ADD CONSTRAINT members_phone_unique UNIQUE (phone);
