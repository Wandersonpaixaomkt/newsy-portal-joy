import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/fontes/')({
  component: () => <div>Fontes</div>,
});
