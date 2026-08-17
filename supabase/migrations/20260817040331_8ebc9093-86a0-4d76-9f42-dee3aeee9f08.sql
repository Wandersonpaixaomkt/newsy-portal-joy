CREATE TABLE IF NOT EXISTS public.pautas_central (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_portal text NOT NULL,
    headline text NOT NULL,
    summary text,
    image_url text,
    original_link text,
    category text,
    city text,
    keywords text[],
    discovered_at timestamptz DEFAULT now(),
    is_new boolean DEFAULT true,
    is_analyzed boolean DEFAULT false,
    is_ignored boolean DEFAULT false,
    is_saved boolean DEFAULT false,
    duplicate_post_id uuid REFERENCES public.posts(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pautas_central TO authenticated;
GRANT ALL ON public.pautas_central TO service_role;
ALTER TABLE public.pautas_central ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.competitor_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    message text NOT NULL,
    relevance text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitor_alerts TO authenticated;
GRANT ALL ON public.competitor_alerts TO service_role;
ALTER TABLE public.competitor_alerts ENABLE ROW LEVEL SECURITY;