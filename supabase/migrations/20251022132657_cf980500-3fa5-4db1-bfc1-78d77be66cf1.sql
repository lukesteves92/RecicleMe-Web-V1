-- Criar bucket para fotos de coletas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coletas-fotos',
  'coletas-fotos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Políticas RLS para o bucket
CREATE POLICY "Usuários podem ver fotos de coletas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'coletas-fotos');

CREATE POLICY "Usuários podem fazer upload de suas fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coletas-fotos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem atualizar suas fotos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'coletas-fotos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas fotos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coletas-fotos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Adicionar campo de foto na tabela coletas
ALTER TABLE public.coletas ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Adicionar campo de avatar no perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Criar tabela de categorias de materiais
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  pontos_por_kg INTEGER NOT NULL DEFAULT 10,
  cor TEXT NOT NULL DEFAULT '#22c55e',
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de categorias
CREATE POLICY "Todos podem ver categorias"
  ON public.categorias FOR SELECT
  USING (true);

-- Inserir categorias padrão
INSERT INTO public.categorias (nome, descricao, pontos_por_kg, cor, icone) VALUES
  ('Plástico', 'Garrafas PET, embalagens plásticas, sacolas', 10, '#3b82f6', '♻️'),
  ('Papel', 'Papelão, jornais, revistas, papel de escritório', 8, '#8b5cf6', '📄'),
  ('Vidro', 'Garrafas, potes, vidros em geral', 10, '#10b981', '🫙'),
  ('Metal', 'Latas de alumínio, ferro, cobre', 15, '#f59e0b', '🔩'),
  ('Eletrônicos', 'Celulares, computadores, pilhas, baterias', 20, '#ef4444', '📱'),
  ('Orgânico', 'Restos de alimentos, cascas, folhas', 5, '#84cc16', '🌿')
ON CONFLICT (nome) DO NOTHING;