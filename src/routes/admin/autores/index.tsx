import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/autores/')({
  component: () => <div>Autores</div>,
});
