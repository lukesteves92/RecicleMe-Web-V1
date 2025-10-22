-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Criar tabela de coletas
CREATE TABLE IF NOT EXISTS public.coletas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_residuo TEXT NOT NULL,
  quantidade NUMERIC NOT NULL,
  unidade TEXT NOT NULL,
  ponto_coleta TEXT NOT NULL,
  endereco TEXT NOT NULL,
  data_coleta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pendente',
  pontos_ganhos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.coletas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para coletas
CREATE POLICY "Usuários podem ver suas próprias coletas"
  ON public.coletas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias coletas"
  ON public.coletas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias coletas"
  ON public.coletas FOR UPDATE
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coletas_updated_at
  BEFORE UPDATE ON public.coletas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados mockados de coletas para testes
INSERT INTO public.coletas (user_id, tipo_residuo, quantidade, unidade, ponto_coleta, endereco, status, pontos_ganhos, data_coleta)
VALUES 
  (auth.uid(), 'Plástico', 5.5, 'kg', 'EcoPonto Centro', 'Rua das Flores, 123', 'concluído', 55, NOW() - INTERVAL '2 days'),
  (auth.uid(), 'Papel', 3.2, 'kg', 'Cooperativa ReciclaVida', 'Av. Reciclagem, 456', 'concluído', 32, NOW() - INTERVAL '5 days'),
  (auth.uid(), 'Vidro', 2.0, 'kg', 'EcoPonto Norte', 'Rua Sustentável, 789', 'pendente', 0, NOW() - INTERVAL '1 day');
