CREATE TABLE IF NOT EXISTS public.ad_slots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.ad_slots (id, name, description) 
VALUES 
  ('header', 'Header Banner', 'Topo do site'),
  ('sidebar', 'Sidebar Banner', 'Lateral do site'),
  ('in-article', 'In-Article Banner', 'Dentro do conteúdo'),
  ('footer', 'Footer Banner', 'Rodapé do site')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.advertisers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advertiser_id UUID REFERENCES public.advertisers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ad_creatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  slot_id TEXT REFERENCES public.ad_slots(id),
  image_url TEXT,
  target_url TEXT,
  alt_text TEXT,
  script_content TEXT,
  device TEXT CHECK (device IN ('mobile', 'desktop', 'all')) DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT ON public.ad_slots TO anon;
GRANT SELECT ON public.advertisers TO authenticated;
GRANT SELECT ON public.ad_campaigns TO authenticated;
GRANT SELECT ON public.ad_creatives TO anon;

GRANT ALL ON public.ad_slots TO service_role;
GRANT ALL ON public.advertisers TO service_role;
GRANT ALL ON public.ad_campaigns TO service_role;
GRANT ALL ON public.ad_creatives TO service_role;

ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public select ad_slots" ON public.ad_slots FOR SELECT TO public USING (true);
CREATE POLICY "Public select ad_creatives" ON public.ad_creatives FOR SELECT TO public USING (true);
