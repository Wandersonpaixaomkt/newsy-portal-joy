import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/midias/')({
  component: () => <div>Biblioteca de Mídia</div>,
});
