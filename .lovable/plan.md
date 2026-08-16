# Auditoria Técnica e Melhoria Profissional - Norte em Foco

O portal passará por uma auditoria completa e refinamento técnico para garantir estabilidade, performance e confiabilidade em produção.

## Problemas Identificados (Resumo da Auditoria)

1.  **Segurança e Acesso:**
    *   Falta de verificação de sessão (`loader` ou `middleware`) nas rotas `/admin`. O componente `AdminLayout` apenas redireciona no logout, mas não impede o acesso direto se o usuário não estiver logado.
    *   `src/routes/admin/login/index.tsx` usa `window.location.href` para redirecionamento, o que é menos performático que o `navigate` do TanStack Router.
2.  **Lógica de Dados e Tipagem:**
    *   `src/lib/news.ts` mapeia para `posts` mas menciona `articles` em comentários. A inconsistência entre o schema real e o esperado causa confusão técnica.
    *   Uso de `any` em mapeamentos de posts e categorias no admin.
    *   Falta de tratamento robusto para slugs duplicados ou inválidos na criação de notícias.
3.  **Performance e UX:**
    *   `CategoryMenu.tsx` usa links `<a>` com `href="#"`, o que causa recarregamento ou comportamento nulo. Deve usar `Link` do TanStack Router.
    *   Falta de skeletons em várias áreas do admin durante o carregamento.
    *   Consultas Supabase no admin não estão filtrando por usuário ou permissão explicitamente (embora o RLS deva cuidar disso, a UI deve refletir o estado de erro).
4.  **UX/UI e Responsividade:**
    *   Sidebar do admin e menus mobile precisam de refinamento nas transições.
    *   Falta de feedback visual em botões de ação (loading states) em alguns formulários.
    *   SEO: O `__root.tsx` tem metadados fixos, mas rotas individuais de notícias precisam de `head()` dinâmico.

## Plano de Ação

### 1. Fortalecimento da Segurança (Auth & Guardas)
- [ ] Implementar `loader` na rota pai `src/routes/admin/route.tsx` para verificar `supabase.auth.getSession()` e redirecionar para `/admin/login` se não autenticado.
- [ ] Refinar `attachSupabaseAuth` e `errorMiddleware` para garantir que falhas de rede no backend sejam capturadas graciosamente.

### 2. Estabilização da Camada de Dados (`src/lib/news.ts`)
- [ ] Padronizar tipos e remover `any`.
- [ ] Adicionar validação Zod para entradas de formulário no admin.
- [ ] Implementar tratamento de erro centralizado para queries Supabase.

### 3. Refinamento de UI/UX (Frontend)
- [ ] Substituir links `<a>` por `<Link>` em toda a navegação.
- [ ] Adicionar estados de carregamento (Skeletons) em todos os dashboards e listas.
- [ ] Refinar a responsividade do `NewsGrid` e `Sidebar` no mobile.

### 4. Auditoria de Performance e SEO
- [ ] Configurar `head()` dinâmico nas rotas de conteúdo.
- [ ] Otimizar carregamento de imagens com `loading="lazy"` e fallbacks consistentes.

## Detalhes Técnicos
- **TanStack Router:** Uso de `beforeLoad` para proteção de rotas.
- **TanStack Query:** Garantir `staleTime` adequado para evitar requisições duplicadas.
- **Supabase:** Verificar e aplicar RLS (Row Level Security) em todas as novas tabelas (`authors`, `tags`, `ad_slots`).
