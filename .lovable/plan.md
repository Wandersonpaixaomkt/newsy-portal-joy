# Plano de Implementação - Norte em Foco

Implementação de rotas dinâmicas, página individual de notícias, bypass temporário de autenticação administrativa, otimização de performance e ajustes de UI/UX.

## 1. Infraestrutura e Roteamento
- [ ] Criar arquivo `src/lib/env.ts` para controle central da autenticação admin via `VITE_ADMIN_AUTH_ENABLED`.
- [ ] Criar a rota dinâmica `src/routes/noticia/$slug.tsx` para exibição individual de matérias.
- [ ] Atualizar `src/lib/news.ts` com funções para buscar notícia por slug, buscar matérias relacionadas e gerar slugs seguros.

## 2. Página Individual de Notícia (`/noticia/:slug`)
- [ ] Implementar layout editorial completo seguindo a identidade visual (dark theme/red accents).
- [ ] Integrar metadados SEO dinâmicos e Schema.org `NewsArticle`.
- [ ] Adicionar componentes: Breadcrumb, botões de compartilhamento, espaços publicitários e matérias relacionadas.
- [ ] Implementar lógica de visualização: rascunhos e agendados bloqueados para público.
- [ ] Adicionar suporte a "Conteúdo Demonstrativo" (Lorem Ipsum) caso o corpo esteja vazio.

## 3. Painel Administrativo (`/admin`)
- [ ] Modificar `src/routes/admin/route.tsx` para respeitar o flag `ENV.ADMIN_AUTH_ENABLED`.
- [ ] Adicionar aviso visual no dashboard quando o modo sem senha estiver ativo.
- [ ] Garantir que o RLS do Supabase continue sendo o guardião final dos dados.

## 4. UI/UX e Redes Sociais
- [ ] Substituir placeholders de redes sociais (`IG`, `FB`, `TW`) por ícones da Lucide React em `Footer.tsx` e `Sidebar.tsx`.
- [ ] Tornar todos os cards de notícias da home clicáveis usando `<Link>` do TanStack Router.
- [ ] Corrigir links `#` para rotas reais.

## 5. Performance e Otimização de Imagens
- [ ] Centralizar e otimizar queries no TanStack Query (ajustar `staleTime`, `cacheTime`).
- [ ] Implementar carregamento lazy, skeletons e placeholders para imagens.
- [ ] Corrigir possíveis loops de renderização identificados na auditoria.

## Detalhes Técnicos
- Utilização de `createServerFn` para lógica de servidor quando necessário.
- Validação de dados com Zod.
- Manutenção do padrão OKLCH para cores e Sora para tipografia.
- Verificação final de build e TypeScript.
