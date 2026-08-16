import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/configuracoes/')({
  component: () => <div>Configurações</div>,
});
