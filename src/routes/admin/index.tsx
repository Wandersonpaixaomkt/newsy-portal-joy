import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/admin.functions';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats(),
  });

  if (isLoading) return <div>Carregando estatísticas...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-400">Bem-vindo ao painel administrativo do Norte em Foco.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Notícias Publicadas" value={stats?.published || 0} color="text-green-500" />
        <StatCard title="Rascunhos" value={stats?.drafts || 0} color="text-yellow-500" />
        <StatCard title="Categorias" value={stats?.categories || 0} color="text-blue-500" />
        <StatCard title="Autores" value={stats?.authors || 0} color="text-purple-500" />
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
        <h3 className="text-xl font-semibold mb-4 text-neutral-400">Analytics</h3>
        <p className="text-neutral-500 text-sm">Analytics ainda não configurado.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
      <h3 className="text-sm font-medium text-neutral-400 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
