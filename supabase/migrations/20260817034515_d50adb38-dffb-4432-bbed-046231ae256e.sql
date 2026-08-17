
-- Tabela para rastrear jornadas de navegação (page flows)
CREATE TABLE IF NOT EXISTS public.navigation_journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
    from_path TEXT,
    to_path TEXT NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT ON public.navigation_journeys TO authenticated, anon;
GRANT ALL ON public.navigation_journeys TO service_role;

-- RLS
ALTER TABLE public.navigation_journeys ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'navigation_journeys' AND policyname = 'Permitir inserção de jornadas para todos') THEN
        CREATE POLICY "Permitir inserção de jornadas para todos"
        ON public.navigation_journeys FOR INSERT
        TO authenticated, anon
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'navigation_journeys' AND policyname = 'Permitir leitura de jornadas para autenticados') THEN
        CREATE POLICY "Permitir leitura de jornadas para autenticados"
        ON public.navigation_journeys FOR SELECT
        TO authenticated
        USING (true);
    END IF;
END $$;
