# Plano de Implementação - Upgrade Analytics, SEO e Monitoramento

Este plano detalha as melhorias profundas no painel administrativo do portal Norte em Foco, focando em Analytics Real, SEO Avançado, Monitoramento de Concorrentes e Rastreamento de Jornadas.

## 1. Analytics & Jornada do Usuário
- **Rastreamento de Jornada**: Implementação de captura de fluxo de navegação (entrada -> sequência -> saída) na `navigation_journeys`.
- **Nova Aba "Jornada"**: Adição de visualização de fluxo de usuários no admin, identificando pontos de abandono e notícias de alta continuidade.
- **Análise de Botões**: Implementação de `data-track-id` em elementos críticos e relatório de cliques/CTR no admin.
- **Telemetria LGPD**: Refinamento do `AnalyticsService` para dados agregados e anônimos.

## 2. SEO Avançado
- **Dashboard de Saúde**: Expansão do `/admin/seo` com métricas reais de metadados ausentes, títulos/descrições fora do padrão e auditoria de Schema.org.
- **Edição Otimizada**: Upgrade nas telas de nova notícia e edição para incluir campos de SEO (Meta Title, Description, Canonical, Robots, Social Graph).
- **Checklist Editorial**: Interface de auxílio ao redator para garantir que a notícia cumpra os requisitos mínimos de SEO antes da publicação.

## 3. Monitoramento de Concorrentes
- **Central de Fontes**: Upgrade no `/admin/fontes` para permitir o cadastro e acompanhamento de portais regionais via RSS e Sitemaps.
- **Alertas de Mercado**: Interface para visualizar as últimas publicações detectadas em concorrentes (Zé Dudu, Pebinha, etc.).

## Detalhes Técnicos
- **Database**: Novas colunas de SEO na tabela `posts` e tabela `navigation_journeys` para persistência de fluxos.
- **Frontend**: Utilização de Recharts para novos gráficos de funil e barras.
- **Componentes**: Padronização de identificadores de rastreamento para análise de CTR.

---
### Arquivos a serem modificados:
- `src/lib/analytics.ts` (Core tracking)
- `src/routes/admin/analytics/index.tsx` (Novos gráficos e jornadas)
- `src/routes/admin/seo/index.tsx` (Dashboard de saúde)
- `src/routes/admin/noticias/nova.tsx` & `editar.$id.tsx` (Campos SEO)
- `src/routes/admin/fontes/index.tsx` (Monitoramento ativo)
