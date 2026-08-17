# Plano de Melhoria do Painel Administrativo - Norte em Foco

Este plano visa corrigir e aprimorar as funcionalidades de gestão de notícias, biblioteca de mídias e publicidade no painel administrativo, garantindo uma experiência profissional e funcional para a equipe editorial.

## 1. Cadastro de Notícias e Imagem Destacada
- **Upload de Imagem:** Implementar componente de upload direto para o Supabase Storage (bucket `news-media-private`).
- **Compressão e Otimização:** Adicionar lógica de compressão de imagem no cliente antes do upload para garantir performance.
- **Opção de Link Externo:** Manter campo de URL com validação de formato de imagem.
- **Preview:** Exibição imediata da imagem escolhida (seja via upload ou link).

## 2. Editor de Texto (Rich Text)
- **Upgrade do Editor:** Refinar o `RichTextEditor` baseado em Tiptap para suportar H2, H3, citações e listas.
- **Inserção de Mídia:** Integrar a Biblioteca de Mídias diretamente no editor para inserção de imagens no corpo da matéria.
- **Preservação de Formatação:** Ajustar a exibição no site público para interpretar corretamente o HTML gerado.

## 3. Biblioteca de Mídias
- **Grid de Mídias:** Criar visualização em grade com miniaturas das imagens no bucket.
- **Gestão de Arquivos:** Exibir metadados (nome, data, tamanho) e permitir exclusão.
- **Integração:** Adicionar funcionalidade de "Selecionar para Destaque" ou "Copiar Link" para facilitar o uso em notícias.

## 4. Sistema de Publicidade
- **Formulário de Campanha:** Criar o formulário de cadastro de anúncios com upload de banner e definição de posição.
- **Posições Estratégicas:** Implementar as posições solicitadas (Topo, Destaque, Blocos, Polícia, Rodapé).
- **Exibição Dinâmica:** Atualizar o site público para renderizar os banners ativos conforme a posição configurada no banco.

## 5. Fluxo de Publicação e Estabilidade
- **Persistência de Dados:** Garantir que todos os campos (autor, cidade, tags, SEO) sejam salvos corretamente no Supabase.
- **Responsividade:** Garantir que o painel e as notícias publicadas funcionem perfeitamente em dispositivos móveis.

---

### Detalhes Técnicos

- **Frontend:** React + TanStack Router/Query + Tailwind CSS.
- **Editor:** Tiptap (Rich Text).
- **Backend:** Supabase Auth, Database (tabelas `posts`, `ad_campaigns`, `ad_creatives`) e Storage.
- **Segurança:** Políticas de RLS para proteger o acesso administrativo e o bucket privado.
- **Mapeamento de Dados:** Atualizar `src/lib/news.ts` para refletir as melhorias de campos.
