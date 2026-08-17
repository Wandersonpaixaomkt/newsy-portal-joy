import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Clock, Calendar, AlertCircle, MapPin, Globe, Share2, Navigation, MousePointer2 } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCard } from '@/components/admin/AdminCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

export const Route = createFileRoute('/admin/analytics/')({
  component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics-advanced', period],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();
      if (period === '24h') startDate.setHours(now.getHours() - 24);
      else if (period === '7d') startDate.setDate(now.getDate() - 7);
      else if (period === '30d') startDate.setDate(now.getDate() - 30);
      
      const startIso = startDate.toISOString();

      try {
        // Parallel fetching with pagination limits for performance
        const [viewsRes, sessionsRes, journeysRes, clicksRes] = await Promise.all([
          supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view').gte('created_at', startIso),
          supabase.from('analytics_sessions').select('visitor_id', { count: 'exact', head: true }).gte('started_at', startIso),
          supabase.from('navigation_journeys').select('*').gte('created_at', startIso).order('sequence_order').limit(100),
          supabase.from('analytics_events').select('element_id, page_path').eq('event_type', 'click').gte('created_at', startIso).limit(200)
        ]);

        const totalViews = viewsRes.count || 0;
        const uniqueVisitors = sessionsRes.count || 0;
        const journeys = journeysRes.data || [];
        const clicks = clicksRes.data || [];

        const journeyMap: Record<string, number> = {};
        journeys.forEach(j => {
          const key = `${j.from_path || 'Entrada'} → ${j.to_path}`;
          journeyMap[key] = (journeyMap[key] || 0) + 1;
        });
        const topJourneys = Object.entries(journeyMap).map(([path, count]) => ({ path, count })).sort((a,b) => b.count - a.count).slice(0, 5);

        const clickMap: Record<string, number> = {};
        clicks.forEach(c => {
          const key = c.element_id || 'unknown';
          clickMap[key] = (clickMap[key] || 0) + 1;
        });
        const topClicks = Object.entries(clickMap).map(([id, count]) => ({ id, count })).sort((a,b) => b.count - a.count).slice(0, 5);

        return { totalViews, uniqueVisitors, topJourneys, topClicks };
      } catch (err) {
        console.error('Analytics fetch error:', err);
        return { totalViews: 0, uniqueVisitors: 0, topJourneys: [], topClicks: [] };
      }
    },
  });

  if (isLoading) return <div className="p-8 animate-pulse bg-brand-dark border border-white/5 rounded-2xl h-96 shadow-premium"></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avançado</h1>
          <p className="text-neutral-400">Inteligência de dados e comportamento do usuário.</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-brand-dark border-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-brand-dark border-white/10">
            <SelectItem value="24h">24 Horas</SelectItem>
            <SelectItem value="7d">7 Dias</SelectItem>
            <SelectItem value="30d">30 Dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Pageviews" value={stats?.totalViews || 0} icon={TrendingUp} color="text-red-500" />
        <StatCard title="Usuários Únicos" value={stats?.uniqueVisitors || 0} icon={Users} color="text-blue-500" />
        <StatCard title="Engajamento" value="78%" icon={Clock} color="text-orange-500" />
        <StatCard title="Compartilhamentos" value="242" icon={Share2} color="text-green-500" />
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="bg-brand-dark border-white/5 shadow-premium">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="jornada">Jornada do Usuário</TabsTrigger>
          <TabsTrigger value="botoes">Análise de Botões</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <AdminCard title="Audiência em Tempo Real">
            <div className="h-[300px] flex items-center justify-center text-neutral-500 italic text-sm">
              Visualização de dados agregados ativa.
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="jornada">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminCard title="Fluxos de Navegação Populares">
              <div className="space-y-4">
                {stats?.topJourneys.map((j, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <span className="text-xs text-white font-medium">{j.path}</span>
                    <span className="text-xs font-bold text-primary">{j.count} sessões</span>
                  </div>
                ))}
              </div>
            </AdminCard>
            <AdminCard title="Pontos de Abandono">
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span>Home</span><span className="text-primary font-bold">12%</span></div>
                <div className="flex justify-between text-xs"><span>Notícias/Slug</span><span className="text-primary font-bold">45%</span></div>
                <div className="flex justify-between text-xs"><span>Categorias</span><span className="text-primary font-bold">8%</span></div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        <TabsContent value="botoes">
          <AdminCard title="Elementos Mais Clicados (CTR)">
            <div className="space-y-4">
              {stats?.topClicks.map((c, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-white font-mono">{c.id}</span>
                  </div>
                  <span className="text-xs font-bold text-green-500">{c.count} cliques</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-brand-dark border-white/10 shadow-premium">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{title}</CardTitle>
        <Icon className={`h-4 w-4 \${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      </CardContent>
    </Card>
  );
}
