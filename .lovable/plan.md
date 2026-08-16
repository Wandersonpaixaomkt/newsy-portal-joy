# Plano de Atualização: Norte em Foco Portal de Notícias

Este plano descreve a migração completa do projeto "Orange News Carajás" para a nova identidade "Norte em Foco", utilizando o banco de dados Supabase existente e adaptando a estrutura para a stack nativa do Lovable (React, Vite, TanStack Start).

## 1. Identidade Visual e Design System

- **Cores:** Fundo escuro (`#0f0f0f`), destaque em Vermelho (`#e11d48`), Branco e tons de Cinza.
- **Tipografia:** Manter Sora para títulos (agressivo/moderno) e Inter para textos de leitura.
- **Estilo:** Visual inspirado em canais de vídeos, com cards dinâmicos e layout premium.

## 2. Banco de Dados e Integração (Supabase Engineer)

- **Referência:** Conectar ao projeto Supabase `ggchlyiiabfifrngnjah`.
- **Mapeamento:** Atualizar `src/lib/news.ts` e `src/integrations/supabase/types.ts` para refletir as tabelas oficiais:
    - `articles` (substitui `posts`)
    - `categories`
    - `tags`
    - `media`
    - `ad_slots` (Publicidade)
- **RLS:** Garantir que as políticas existentes sejam respeitadas no frontend.

## 3. Reestruturação de Componentes (UI Architect)

- **Layout:**
    - **Header:** Novo design em modo escuro com busca e "Envie sua Pauta".
    - **Sidebar:** Menu lateral retrátil/persistente com cidades e editorias.
    - **Hero:** Manchete principal com visual cinematográfico.
    - **News Cards:** Formato de "vídeo" (aspect-ratio específico, ícones de reprodução/informação).
- **Categorias Oficiais:** Parauapebas, Canaã, Marabá, Política, Mineração, etc.

## 4. Área Administrativa (Full Stack)

- **Painel:** `/admin` protegido por Supabase Auth.
- **Editor:** Implementar editor de texto rico (TipTap ou similar).
- **SEO:** Campos de meta tags, slug, canonical e Schema.org NewsArticle.
- **Upload:** Integração com o bucket `news-media` com conversão para WebP.

## 5. Publicidade e Analytics (API Integrator)

- **Ads:** Espaços para banners no header, sidebar, footer e corpo da matéria.
- **Analytics:** Estrutura visual para GA4 com estados de "Aguardando conexão".

## Detalhes Técnicos

- **Stack:** React 19, TanStack Start v1, Tailwind CSS v4, Framer Motion.
- **Imagens:** Otimização via Supabase Storage + WebP.
- **Performance:** Code splitting, lazy loading e cache via TanStack Query.

---

### Arquivos Impactados:
- `src/styles.css` (Cores e tema escuro)
- `src/routes/index.tsx` (Reconstrução da Home)
- `src/routes/__root.tsx` (Metadados e Layout base)
- `src/lib/news.ts` (API fetchers)
- `src/components/layout/*` (Todos os componentes de layout)
- `src/routes/admin/` (Nova rota protegida)
