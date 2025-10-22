-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar se é admin (SECURITY DEFINER para evitar recursão)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND role = 'admin'
  );
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Admins podem ver todos os roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Criar tabela de configurações da plataforma
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para platform_settings
CREATE POLICY "Todos podem ver configurações"
  ON public.platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins podem modificar configurações"
  ON public.platform_settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- Inserir configurações padrão
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('coletas_enabled', 'true', 'Sistema de coletas ativo'),
  ('chat_enabled', 'true', 'Chat de suporte ativo'),
  ('notifications_enabled', 'true', 'Notificações ativas'),
  ('max_coletas_per_day', '10', 'Máximo de coletas por usuário/dia');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();