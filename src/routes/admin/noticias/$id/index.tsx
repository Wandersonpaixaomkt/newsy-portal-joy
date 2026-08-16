import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/noticias/$id/')({
  component: () => <div>Editar Notícia</div>,
});
