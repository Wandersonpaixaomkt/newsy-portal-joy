# Plano de Aprimoramento do Painel Administrativo - Norte em Foco

Este plano visa estabilizar o painel administrativo atual e expandir suas capacidades para incluir analytics real, SEO avançado, monitoramento de concorrentes e proteção de conteúdo.

## 1. Estabilização e Correção (Fase Crítica)

- **Correção da Listagem de Notícias**: Investigar e corrigir o loading infinito em `/admin/noticias`. Adicionar timeouts, tratamento de erros explícito e estados visuais para: "Carregando", "Lista Vazia", "Erro de Conexão".
- **Padronização de Joins**: Garantir que as consultas ao Supabase não falhem por tabelas ou relacionamentos inexistentes (especialmente `authors`).
- **Navegação Consistente**: Revisar o `AdminLayout` para garantir que todos os itens da sidebar apontem para rotas válidas e funcionais.
- **Tratamento de Autenticação**: Garantir que o bypass temporário (`VITE_ADMIN_AUTH_ENABLED=false`) funcione em todas as funções de servidor e carregadores sem gerar erros 401.

## 2. Dashboard Executivo e Analytics Real

- **Telemetria Ativa**: Integrar o `AnalyticsService` para coletar dados reais de visualizações, sessões e interações.
- **Métricas de Performance**: Substituir dados demonstrativos no dashboard principal por agregados reais do banco de dados (Visualizações Hoje, Usuários Online, Notícias Publicadas).
- **Gráficos Avançados**: Implementar visualizações de tendência (visualizações por dia, dispositivos, matérias mais lidas) usando Recharts com dados da tabela `analytics_events`.

## 3. SEO e Monitoramento Editorial

- **Auditoria de SEO**: Aprimorar o dashboard de SEO para listar matérias que faltam meta-tags, canonical URLs ou que possuem baixo score de legibilidade.
- **Monitoramento de Concorrentes**: Implementar a lógica de descoberta de pautas, permitindo o cadastro de fontes RSS e exibindo as últimas publicações do mercado.
- **Proteção de Conteúdo**: Adicionar scripts de proteção no frontend (`/noticia/:slug`) para dificultar cópias não autorizadas (bloqueio de clique direito opcional/configurável e seleção de texto).

## Detalhes Técnicos

- **Tecnologias**: TanStack Query para gerenciamento de estado assíncrono, Recharts para visualização de dados, Supabase para persistência.
- **Resiliência**: Implementação de Error Boundaries e fallbacks de UI para falhas de rede.
- **Segurança**: Assegurar que as policies RLS permitam o funcionamento do Analytics mesmo sem login (anônimo), mantendo a integridade dos dados.

---
**Próximos passos após aprovação**:
1. Aplicar correções de erro e loading na página de notícias.
2. Conectar os gráficos de Analytics aos dados reais.
3. Finalizar o fluxo de monitoramento de concorrentes.
