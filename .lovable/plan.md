# Plano de Implementação: Analytics Real e Eventos de Interação

Implementação de telemetria própria anônima compatível com LGPD e transformação do painel `/admin/analytics` em uma ferramenta funcional com métricas reais.

## Etapa 1: Reforço da Telemetria (`src/lib/analytics.ts`)

- Expandir `AnalyticsEvent` para suportar novos tipos: `article_read_start`, `ad_click`, `share_click`, `copy_attempt`, etc.
- Implementar rastreamento de tempo de engajamento ativo (visibility change + timers).
- Adicionar detecção de browsers e regiões básicas baseada em `navigator` e `Intl.DateTimeFormat`.
- Garantir anonimato total: remoção de qualquer vestígio de IP ou dados sensíveis.

## Etapa 2: Captura de Eventos de Interação

- **Página de Notícia (`src/routes/noticia/$slug.tsx`)**:
  - Rastrear profundidade de rolagem (25%, 50%, 75%, 100%).
  - Rastrear tentativas de cópia.
  - Rastrear visualização de anúncios e cliques.
- **Header/Footer**:
  - Rastrear cliques em categorias e cidades.
  - Rastrear buscas realizadas.

## Etapa 3: Dashboard de Analytics Funcional (`src/routes/admin/analytics/index.tsx`)

- Substituir dados estáticos por consultas reais no Supabase.
- Implementar gráficos detalhados usando `Recharts`:
  - **Gráfico de Área**: Pageviews e Usuários Únicos por tempo.
  - **Gráfico de Pizza**: Dispositivos e Navegadores.
  - **Gráfico de Barras**: Horários de pico e Fontes de tráfego.
- Implementar filtros de período dinâmicos: Hoje, Ontem, 7 dias, 30 dias e Período Personalizado.
- Tabela de "Páginas de Entrada" e "Páginas de Saída".

## Detalhes Técnicos

- **Banco de Dados**: Uso das tabelas `analytics_events`, `analytics_sessions` e `interaction_logs`.
- **Performance**: Consultas otimizadas com filtros de data e agregações no lado do servidor.
- **LGPD**: Telemetria estritamente anônima.

```typescript
// Novos eventos a serem rastreados
type DetailedEventType = 
  | 'page_view' | 'article_view' 
  | 'article_read_25' | 'article_read_50' | 'article_read_75' | 'article_read_complete'
  | 'scroll_depth' | 'search' | 'category_click' | 'city_click'
  | 'share_click' | 'ad_click' | 'copy_attempt';
```
