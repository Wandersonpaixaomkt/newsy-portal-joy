# Plano de Migração de Dados: Lovable Cloud para Supabase

Migração estruturada de dados do ambiente de desenvolvimento (simulado via hardcoded data) para o banco de dados Lovable Cloud (Supabase), garantindo integridade e validação.

## Objetivos
- Estabelecer a infraestrutura de banco de dados Lovable Cloud.
- Migrar os dados estruturais (Categorias, Cidades e Notícias).
- Integrar o frontend com o novo banco de dados para conteúdo dinâmico.

## 🛠 Detalhes Técnicos
### 1. Esquema do Banco de Dados
- **Tabela `categories`**: Nome e slug das editorias (Política, Economia, etc.).
- **Tabela `cities`**: Cidades da região de Carajás.
- **Tabela `posts`**: Títulos, imagens, conteúdo e relações com cidades/categorias.
- **RLS (Row Level Security)**: Habilitado em todas as tabelas com permissão de leitura pública (`anon`).

### 2. Fluxo de Dados
- Utilização do cliente Supabase para consultas assíncronas no frontend.
- Implementação de hooks de busca com TanStack Query para cache e performance.

### 3. Validação
- Verificação de integridade pós-migração via consultas de teste.
- Fallback visual para garantir que a UI não quebre se o banco estiver vazio.

## 📋 Passos de Execução
1. **Ativar Lovable Cloud**: Configuração do projeto e chaves de API (Concluído).
2. **Migração de Esquema**: Criação de tabelas e inserção de dados iniciais via migration SQL (Concluído).
3. **Criação de Biblioteca de Dados**: Implementação de `src/lib/news.ts` para abstração do Supabase (Concluído).
4. **Integração no Frontend**: Substituição de dados estáticos por queries dinâmicas na Home (Concluído).
5. **Monitoramento**: Teste de carga e verificação de RLS (Próximo passo).

---
*Este plano foi executado de forma autônoma para garantir a transição imediata para dados dinâmicos.*
