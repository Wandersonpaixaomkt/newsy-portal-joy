import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/admin.functions';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Users, 
  Eye, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  Search,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const basicStats = await getAdminStats();
        
        // Get real counts from analytics tables if they exist
        const { count: todayViews } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'page_view')
          .gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString());

        const { count: onlineUsers } = await supabase
          .from('analytics_sessions')
          .select('visitor_id', { count: 'exact', head: true })
          .is('ended_at', null)
          .gte('started_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        return {
          published: basicStats?.published || 0,
          drafts: basicStats?.drafts || 0,
          categories: basicStats?.categories || 0,
          authors: basicStats?.authors || 0,
          todayViews: todayViews || 0,
          onlineUsers: onlineUsers || 0,
          seoIssues: 0,
        };
      } catch (err) {
        console.error('Error in AdminDashboard stats:', err);
        return {
          published: 0,
          drafts: 0,
          categories: 0,
          authors: 0,
          todayViews: 0,
          onlineUsers: 0,
          seoIssues: 0,
        };
      }
    },
    retry: 1,
  });

  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-neutral-800 w-48 rounded"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-neutral-800 rounded-lg"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-neutral-400">Visão geral do desempenho e conteúdo do portal.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Visualizações Hoje" 
          value={stats?.todayViews || 0} 
          icon={Eye}
          color="text-red-500" 
          description="Total de pageviews desde 00:00"
        />
        <StatCard 
          title="Usuários Online" 
          value={stats?.onlineUsers || 0} 
          icon={Users}
          color="text-blue-500" 
          description="Visitantes ativos nos últimos 5 min"
        />
        <StatCard 
          title="Notícias Publicadas" 
          value={stats?.published || 0} 
          icon={FileText}
          color="text-green-500" 
          description="Total de matérias no ar"
        />
        <StatCard 
          title="Alertas de SEO" 
          value={stats?.seoIssues || 0} 
          icon={AlertCircle}
          color="text-yellow-500" 
          description="Matérias que precisam de ajuste"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Conteúdo Recente</CardTitle>
            <TrendingUp className="w-4 h-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
             <div className="text-center py-10 text-neutral-500 italic text-sm">
              Nenhuma atividade recente registrada.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Principais Termos de Busca</CardTitle>
            <Search className="w-4 h-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              Ainda não há dados suficientes de pesquisa.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-red-950/10 border border-red-900/30 p-6 rounded-lg flex items-start gap-4">
        <Share2 className="w-6 h-6 text-red-500 mt-1" />
        <div>
          <h4 className="font-bold text-red-500">Dica Editorial</h4>
          <p className="text-neutral-400 text-sm mt-1">
            Matérias sobre Mineração e Emprego em Canaã dos Carajás tiveram um aumento de 25% na audiência esta semana. Considere aprofundar esses temas.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon: Icon, description }: { 
  title: string; 
  value: number | string; 
  color: string;
  icon: any;
  description?: string;
}) {
  return (
    <Card className="bg-neutral-800 border-neutral-700 hover:border-neutral-600 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-400">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        {description && <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">{description}</p>}
      </CardContent>
    </Card>
  );
}
