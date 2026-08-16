---
title: Plano de Estabilização e Mapeamento de Dados - Norte em Foco
description: Correção de erros, mapeamento de tabelas e estabilização da home page utilizando a estrutura real do banco de dados.
---

# Plano de Estabilização e Mapeamento de Dados

O objetivo desta etapa é corrigir erros de TypeScript/Build e garantir que o portal **Norte em Foco** consuma dados reais do banco de dados configurado, respeitando a identidade visual já estabelecida.

## 1. Mapeamento de Dados (Camada de Dados)
Apesar do plano original prever tabelas como `articles`, o banco de dados atual (`jlhbgriiyfijxqyhrgkm`) utiliza as tabelas `posts`, `categories` e `cities`.
- **Ação:** Manter o uso de `posts` para evitar quebra de funcionalidade, mas preparar a tipagem para uma futura migração.
- **Arquivo:** `src/lib/news.ts` será refatorado para incluir estados de erro, carregamento e tratamento de nulos.

## 2. Interface e UX
- **Correção de Imagens:** Implementar fallback para imagens (placeholder local) quando `image_url` for nulo ou inválido.
- **Distribuição na Home:**
  - **Destaque:** Matéria com `is_featured = true`.
  - **Próximas Notícias:** Matérias recentes excluindo o destaque.
  - **Últimas da Região:** Lista geral ordenada por `published_at`.
  - **Cidades & Política:** Filtragem por categorias específicas (Cidades e Política).

## 3. Estabilidade e Qualidade
- **TypeScript:** Resolver `any` residuais em `src/routes/index.tsx` e `src/lib/news.ts`.
- **Build:** Garantir que `bun run build` execute sem erros.
- **Micro-interações:** Ajustar contrastes e legibilidade conforme solicitado (reduzir itálicos em blocos longos).

## 4. Segurança
- **Auditoria:** Confirmar que chaves privadas (`service_role`) não estão sendo utilizadas no frontend.

## Técnicas e Ferramentas
- **TanStack Query:** Para gerenciamento de estado assíncrono e cache.
- **Supabase JS:** Para consultas tipadas.
- **Lucide React:** Para ícones e indicadores de estado.
