# Plano de Atualização: Funções de Publicação e Edição

Este plano visa estabilizar e aprimorar as funcionalidades de publicação e atualização de notícias no painel administrativo, garantindo que a estrutura de dados (cidades, categorias e autores) esteja corretamente integrada e que a experiência de edição seja fluida.

## Alterações Propostas

### 1. Camada de Dados (`src/lib/news.ts` e `src/lib/admin.functions.ts`)
- Ajustar `fetchNews` e outras consultas para garantir que não falhem caso a tabela `authors` esteja ausente ou inacessível, mantendo o fallback para "Redação".
- Otimizar a consulta de notícias no admin para incluir campos de SEO e metadados.

### 2. Interface de Edição (`src/routes/admin/noticias/$id/index.tsx`)
- Adicionar campos de Categoria, Cidade e Autor na aba de "Conteúdo Editorial" (que estavam ausentes ou incompletos).
- Implementar a lógica de salvamento para os campos de SEO (Meta Title, Meta Description, Canonical, etc.).
- Melhorar o feedback visual ao salvar/atualizar.

### 3. Criação de Notícias (`src/routes/admin/noticias/nova.tsx`)
- Refinar a geração automática de Slug a partir do título.
- Garantir que a importação via Radar (URL Params) preencha todos os campos, incluindo metadados sugeridos.

### 4. Gestão de Notícias (`src/routes/admin/noticias/index.tsx`)
- Implementar a funcionalidade de "Excluir Notícia".
- Melhorar a exibição do status (Rascunho vs Publicado) e a data de publicação.

## Detalhes Técnicos
- Utilização do SDK do Supabase para operações CRUD.
- TanStack Query para gerenciamento de cache e estado de carregamento.
- Validação de dados antes do envio para evitar erros de banco (violação de FKs).
