# Plano de Implementação: Central de Pautas e Radar de Concorrentes

Implementação de um sistema de inteligência editorial para monitoramento de portais concorrentes, triagem de notícias e conversão em pautas/rascunhos, com alertas de alta relevância.

## Mudanças Propostas

### Backend (Supabase)
- Criar migração para a tabela `pautas_central`:
    - Campos: `id`, `source_portal`, `headline`, `summary`, `image_url`, `original_link`, `category`, `city`, `keywords`, `discovered_at`, `is_new`, `is_analyzed`, `is_ignored`, `is_saved`, `duplicate_post_id`.
- Criar migração para `competitor_alerts`:
    - Campos: `id`, `type`, `message`, `relevance`, `is_read`, `created_at`.

### Frontend & UI/UX
- **Radar em Tempo Real (`/admin/fontes`)**:
    - Atualizar a aba "Radar" para exibir os itens encontrados.
    - Implementar cards detalhados com: Portal, Manchete, Resumo, Imagem, Data, Categoria, Cidade, Link Original e Palavras-chave.
    - Indicadores de novidade e alertas de duplicidade com conteúdo interno.
- **Ações Rápidas**:
    - Botões: Abrir fonte, Pesquisar tema, Criar pauta, Criar rascunho, Marcar analisado, Ignorar, Salvar para depois.
- **Fluxo de Importação**:
    - Ao "Criar pauta/rascunho", redirecionar para `/admin/noticias/nova` injetando os dados da fonte (título, link, fonte, texto integral).
    - Implementar lógica de proteção: cópia de imagens, exigência de revisão editorial, atribuição de fonte obrigatória e detector de semelhança.
- **Central de Alertas**:
    - Notificações no painel administrativo para temas urgentes (Mineração, Política, Emprego, Polícia).
    - Agrupamento de temas publicados por múltiplos concorrentes.

## Detalhes Técnicos
- Utilizar `framer-motion` para animações na lista do radar.
- Integrar com `lucide-react` para iconografia (AlertCircle, Zap, Search, PenTool).
- Adicionar validação editorial em tempo real no formulário de notícias ao importar de fontes externas.
- Adicionar política de RLS para as novas tabelas.

## Considerações de Segurança
- Monitoramento anônimo e respeitando limites de requisição.
- Bloqueio de publicação automática para evitar plágio ou erros factuais.
