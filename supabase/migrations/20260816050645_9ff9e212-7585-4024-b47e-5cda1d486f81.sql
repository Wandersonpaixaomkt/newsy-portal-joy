-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. News Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- 2. Regional Cities
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT SELECT ON public.cities TO anon, authenticated;
GRANT ALL ON public.cities TO service_role;

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);

-- 3. News Posts
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id),
    city_id UUID REFERENCES public.cities(id),
    is_urgent BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);

-- 4. Initial Seed Data
INSERT INTO public.categories (name, slug) VALUES 
('Cultura', 'cultura'),
('Mineração', 'mineracao'),
('Economia', 'economia'),
('Cidades', 'cidades'),
('Segurança', 'seguranca'),
('Saúde', 'saude'),
('Política', 'politica');

INSERT INTO public.cities (name, slug) VALUES 
('Parauapebas', 'parauapebas'),
('Canaã dos Carajás', 'canaa-dos-carajas'),
('Marabá', 'maraba'),
('Curionópolis', 'curionopolis'),
('Eldorado do Carajás', 'eldorado-do-carajas'),
('Belém', 'belem');

-- Insert initial sample posts matching existing hardcoded data
DO $$
DECLARE
    cat_cultura_id UUID;
    cat_mineracao_id UUID;
    cat_economia_id UUID;
    cat_cidades_id UUID;
    cat_seguranca_id UUID;
    cat_saude_id UUID;
    city_canaa_id UUID;
    city_parauapebas_id UUID;
    city_maraba_id UUID;
    city_curionopolis_id UUID;
BEGIN
    SELECT id INTO cat_cultura_id FROM public.categories WHERE slug = 'cultura';
    SELECT id INTO cat_mineracao_id FROM public.categories WHERE slug = 'mineracao';
    SELECT id INTO cat_economia_id FROM public.categories WHERE slug = 'economia';
    SELECT id INTO cat_cidades_id FROM public.categories WHERE slug = 'cidades';
    SELECT id INTO cat_seguranca_id FROM public.categories WHERE slug = 'seguranca';
    SELECT id INTO cat_saude_id FROM public.categories WHERE slug = 'saude';

    SELECT id INTO city_canaa_id FROM public.cities WHERE slug = 'canaa-dos-carajas';
    SELECT id INTO city_parauapebas_id FROM public.cities WHERE slug = 'parauapebas';
    SELECT id INTO city_maraba_id FROM public.cities WHERE slug = 'maraba';
    SELECT id INTO city_curionopolis_id FROM public.cities WHERE slug = 'curionopolis';

    INSERT INTO public.posts (title, slug, image_url, category_id, city_id, excerpt, is_featured) VALUES
    ('Vale anuncia expansão histórica em Carajás com foco em sustentabilidade.', 'vale-anuncia-expansao-historica', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop', cat_economia_id, city_parauapebas_id, 'O projeto estratégico prevê a geração de mais de 5 mil postos de trabalho diretos na região do sudeste paraense.', true),
    ('Canaã dos Carajás anuncia festival de gastronomia com atrações nacionais.', 'festival-gastronomia-canaa', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', cat_cultura_id, city_canaa_id, 'Festival promete movimentar o turismo local.', false),
    ('Mineração: Novas tecnologias aumentam eficiência e segurança na Serra Sul.', 'mineracao-tecnologias-serra-sul', 'https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=2070&auto=format&fit=crop', cat_mineracao_id, city_canaa_id, 'Inovações no setor mineral.', false),
    ('Parauapebas registra saldo positivo na geração de empregos no último trimestre.', 'parauapebas-saldo-positivo-empregos', 'https://images.unsplash.com/photo-1521791136366-39853759d2fe?q=80&w=2070&auto=format&fit=crop', cat_economia_id, city_parauapebas_id, 'Dados do CAGED mostram crescimento.', false),
    ('Obras de saneamento avançam em bairros periféricos de Parauapebas.', 'obras-saneamento-parauapebas', 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop', cat_cidades_id, city_parauapebas_id, 'Melhorias na infraestrutura urbana.', false),
    ('Polícia Militar intensifica rondas comerciais no centro de Marabá.', 'pm-intensifica-rondas-maraba', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop', cat_seguranca_id, city_maraba_id, 'Segurança reforçada no comércio.', false),
    ('Curionópolis recebe novos equipamentos de saúde para o hospital municipal.', 'curionopolis-saude-hospital', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop', cat_saude_id, city_curionopolis_id, 'Investimentos na saúde pública.', false);
END $$;