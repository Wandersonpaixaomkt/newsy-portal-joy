
-- Adicionar colunas de SEO avançado na tabela posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_card_type TEXT DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS robots_meta TEXT DEFAULT 'index, follow',
ADD COLUMN IF NOT EXISTS schema_data JSONB;

-- Garantir que a tabela navigation_journeys tenha suporte a referências de notícias
ALTER TABLE public.navigation_journeys 
ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL;
