import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tags/')({
  component: () => <div>Tags</div>,
});
