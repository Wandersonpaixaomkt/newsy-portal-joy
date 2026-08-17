
-- Adicionar colunas para métricas de engajamento se não existirem
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS engagement_time INTEGER DEFAULT 0;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS scroll_depth INTEGER DEFAULT 0;

-- Tabela para rastrear cliques em botões específicos/principais
CREATE TABLE IF NOT EXISTS public.interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
    element_id TEXT NOT NULL,
    element_type TEXT,
    page_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT ON public.interaction_logs TO authenticated, anon;
GRANT ALL ON public.interaction_logs TO service_role;

ALTER TABLE public.interaction_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'interaction_logs' AND policyname = 'Permitir inserção de logs de interação para todos') THEN
        CREATE POLICY "Permitir inserção de logs de interação para todos"
        ON public.interaction_logs FOR INSERT
        TO authenticated, anon
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'interaction_logs' AND policyname = 'Permitir leitura de logs de interação para autenticados') THEN
        CREATE POLICY "Permitir leitura de logs de interação para autenticados"
        ON public.interaction_logs FOR SELECT
        TO authenticated
        USING (true);
    END IF;
END $$;
