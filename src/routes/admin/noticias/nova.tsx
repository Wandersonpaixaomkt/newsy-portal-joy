import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/noticias/nova')({
  component: () => <div>Nova Notícia</div>,
});
