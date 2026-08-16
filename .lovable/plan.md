# Plano de Melhoria Profunda de UI/UX - Norte em Foco

Este plano visa elevar o nível visual e a experiência do usuário do portal Norte em Foco para um padrão moderno, premium e altamente intuitivo, focando em consistência, hierarquia visual e microinterações suaves.

## Melhorias de UI (Interface Visual)

### 1. Refinamento do Design System (OKLCH)
- Ajustar os tokens semânticos no `src/styles.css` para garantir maior contraste e uma paleta de cores mais sofisticada.
- Implementar gradientes sutis e sombras premium (`shadow-premium`) para criar profundidade.
- Suavizar os arredondamentos (`--radius`) de `0.75rem` para um padrão mais elegante de `1rem` em elementos principais.

### 2. Hierarquia Tipográfica e Escaneabilidade
- Otimizar o uso da fonte **Sora**, ajustando o `letter-spacing` e `line-height` para melhorar a leitura.
- Padronizar os tamanhos de fonte em toda a aplicação, removendo variações desnecessárias.
- Garantir que todos os títulos sigam a regra de "Somente primeira letra maiúscula" (Sentence case) de forma consistente.

### 3. Componentização e Consistência
- **Cards de Notícias:** Refinar o design dos cards no `NewsGrid.tsx` e `index.tsx`, adicionando bordas mais sutis e efeitos de hover mais elegantes.
- **Header e Navegação:** Melhorar o `MainHeader.tsx` e `CategoryMenu.tsx` com maior espaçamento e estados ativos mais claros.
- **Botões:** Unificar os estilos de botões usando variantes do shadcn/ui com microinterações de escala e brilho.

## Melhorias de UX (Experiência do Usuário)

### 1. Redução de Fricção e Navegação
- Substituir links `<a>` remanescentes por componentes `<Link>` do TanStack Router para navegação instantânea.
- Melhorar a descoberta de funcionalidades na Sidebar e no Footer.
- Implementar uma barra de progresso de leitura em páginas de notícias (futuro) e skeletons mais precisos.

### 2. Estados e Feedback Visual
- Adicionar transições suaves entre estados de carregamento e conteúdo final usando **Framer Motion**.
- Melhorar as mensagens de erro e estados vazios com ilustrações ou ícones mais amigáveis.
- Refinar o feedback visual de cliques e interações com menus.

### 3. Otimização Mobile-First
- Ajustar os grids no mobile para evitar densidade excessiva.
- Aumentar áreas de toque (touch targets) em menus e botões.
- Otimizar o cabeçalho mobile para ocupar menos espaço vertical mantendo a identidade.

## Detalhes Técnicos

- **Tecnologias:** Tailwind CSS v4, Framer Motion, TanStack Router.
- **Arquivos Principais:** `src/styles.css`, `src/routes/index.tsx`, `src/components/layout/*`.
- **Performance:** Manter o bundle leve, priorizando CSS nativo e animações eficientes via GPU.

---

Este plano foca na lapidação do que já existe, transformando o Norte em Foco em uma plataforma de notícias de nível nacional em termos de design e usabilidade.
