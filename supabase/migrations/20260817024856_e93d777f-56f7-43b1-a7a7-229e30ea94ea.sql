-- 1. Tabelas de Analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL,
    event_type text NOT NULL,
    page_path text NOT NULL,
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
    element_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    user_agent text,
    device_type text,
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id uuid NOT NULL,
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz,
    entry_page text,
    exit_page text,
    device_info jsonb DEFAULT '{}'::jsonb,
    location_city text,
    location_region text,
    location_country text
);

-- 2. Colunas Aditivas de SEO na tabela posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS twitter_card text DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS focus_keyword text;

-- 3. Tabela de Monitoramento de Concorrentes
CREATE TABLE IF NOT EXISTS public.competitor_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    domain text NOT NULL,
    rss_url text,
    sitemap_url text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    last_scraped_at timestamptz,
    frequency_minutes integer DEFAULT 60,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.competitor_articles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid REFERENCES public.competitor_sources(id) ON DELETE CASCADE,
    title text NOT NULL,
    summary text,
    content text,
    url text UNIQUE NOT NULL,
    image_url text,
    published_at timestamptz,
    discovered_at timestamptz DEFAULT now(),
    category text,
    city text,
    status text DEFAULT 'new' CHECK (status IN ('new', 'analyzed', 'drafted', 'ignored')),
    relevance_score integer DEFAULT 0,
    is_urgent boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- 4. Permissões (Grants)
GRANT SELECT, INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.analytics_sessions TO anon, authenticated;
GRANT ALL ON public.analytics_sessions TO service_role;

GRANT SELECT ON public.competitor_sources TO authenticated;
GRANT ALL ON public.competitor_sources TO service_role;

GRANT SELECT, UPDATE ON public.competitor_articles TO authenticated;
GRANT ALL ON public.competitor_articles TO service_role;

-- 5. RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert of events" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view all events" ON public.analytics_events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow public session management" ON public.analytics_sessions FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Admins can view all sessions" ON public.analytics_sessions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage competitor sources" ON public.competitor_sources FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage competitor articles" ON public.competitor_articles FOR ALL TO authenticated USING (true);
