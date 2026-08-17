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
  Share2,
  Calendar,
  MousePointer2,
  Clock,
  LayoutDashboard,
  Zap,
  Radio
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminCard } from '@/components/admin/AdminCard';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [period, setPeriod] = useState('7d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats-executive', period],
    queryFn: async () => {
      try {
        const basicStats = await getAdminStats();
        
        const now = new Date();
        let startDate = new Date();
        if (period === '24h') startDate.setHours(now.getHours() - 24);
        else if (period === '7d') startDate.setDate(now.getDate() - 7);
        else if (period === '30d') startDate.setDate(now.getDate() - 30);

        const startIso = startDate.toISOString();

        // Real Metrics from Analytics
        const { count: views } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'page_view')
          .gte('created_at', startIso);

        const { count: uniqueUsers } = await supabase
          .from('analytics_sessions')
          .select('visitor_id', { count: 'exact', head: true })
          .gte('started_at', startIso);

        const { count: sessions } = await supabase
          .from('analytics_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('started_at', startIso);

        const { count: onlineUsers } = await supabase
          .from('analytics_sessions')
          .select('visitor_id', { count: 'exact', head: true })
          .is('ended_at', null)
          .gte('started_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        const { count: scheduled } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .gt('published_at', new Date().toISOString());

        const { count: adClicks } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'ad_click')
          .gte('created_at', startIso);

        const { count: shares } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'share_click')
          .gte('created_at', startIso);

        // Chart data
        const { data: chartEvents } = await supabase
          .from('analytics_events')
          .select('created_at')
          .eq('event_type', 'page_view')
          .gte('created_at', startIso)
          .order('created_at', { ascending: true });

        const dailyMap: Record<string, number> = {};
        chartEvents?.forEach(e => {
          const d = new Date(e.created_at || new Date()).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          dailyMap[d] = (dailyMap[d] || 0) + 1;
        });
        const chartData = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

        return {
          published: basicStats?.published || 0,
          drafts: basicStats?.drafts || 0,
          scheduled: scheduled || 0,
          views: views || 0,
          uniqueUsers: uniqueUsers || 0,
          sessions: sessions || 0,
          onlineUsers: onlineUsers || 0,
          adClicks: adClicks || 0,
          shares: shares || 0,
          chartData,
          alerts: (await supabase.from('competitor_alerts').select('*').eq('is_read', false).order('created_at', { ascending: false }).limit(3)).data || []
        };
      } catch (err) {
        console.error('Error in Executive Dashboard:', err);
        return null;
      }
    }
  });

  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-neutral-800 w-48 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-24 bg-neutral-800 rounded-lg"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <header>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Dashboard Executivo</h1>
          <p className="text-neutral-400">Indicadores reais de performance e conteúdo.</p>
        </header>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-brand-dark border-white/10 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-brand-dark border-white/10 text-white">
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs italic">
            <Radio className="w-4 h-4 animate-pulse" /> Radar de Relevância
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.alerts.map((alert: any) => (
              <Alert key={alert.id} className="bg-red-950/20 border-red-900/30 text-white">
                <Zap className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-[10px] font-black uppercase text-red-500">{alert.type}</AlertTitle>
                <AlertDescription className="text-xs font-medium">
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Visualizações" value={stats?.views} icon={Eye} color="text-red-500" />
        <MetricCard title="Usuários Únicos" value={stats?.uniqueUsers} icon={Users} color="text-blue-500" />
        <MetricCard title="Sessões" value={stats?.sessions} icon={LayoutDashboard} color="text-orange-500" />
        <MetricCard title="Usuários Online" value={stats?.onlineUsers} icon={TrendingUp} color="text-green-500" />
      </div>

      {/* Content Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Publicadas" value={stats?.published} icon={FileText} color="text-white" />
        <MetricCard title="Rascunhos" value={stats?.drafts} icon={AlertCircle} color="text-neutral-500" />
        <MetricCard title="Agendadas" value={stats?.scheduled} icon={Calendar} color="text-yellow-500" />
        <MetricCard title="Compartilhamentos" value={stats?.shares} icon={Share2} color="text-pink-500" />
      </div>

      {/* Performance & Conversão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard className="lg:col-span-2" title="Tendência de Audiência">
          <div className="h-[300px]">
            {stats?.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="dashViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#dashViews)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600 italic">Ainda não há dados suficientes</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white uppercase tracking-widest italic">Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex justify-between items-center border-b border-neutral-700 pb-4">
                <div className="flex items-center gap-2">
                   <MousePointer2 size={18} className="text-red-500" />
                   <span className="text-sm font-medium">Cliques em Anúncios</span>
                </div>
                <span className="text-xl font-black">{stats?.adClicks || 0}</span>
             </div>
             <div className="flex justify-between items-center border-b border-neutral-700 pb-4">
                <div className="flex items-center gap-2">
                   <TrendingUp size={18} className="text-blue-500" />
                   <span className="text-sm font-medium">CTR Estimado</span>
                </div>
                <span className="text-xl font-black">
                   {stats?.views ? ((stats.adClicks / stats.views) * 100).toFixed(2) : 0}%
                </span>
             </div>
             <div className="bg-red-950/20 p-4 rounded-lg border border-red-900/30">
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Dica de Performance</p>
                <p className="text-xs text-neutral-400">O engajamento aumentou nos últimos 7 dias. Revise seus rascunhos para manter o ritmo.</p>
             </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string, value: any, icon: any, color: string }) {
  const displayValue = value === undefined || value === null ? "..." : value;
  
  return (
    <Card className="bg-brand-dark border-white/10 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{title}</span>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">
            {typeof value === 'number' ? value.toLocaleString() : displayValue}
          </span>
          {value === 0 && <span className="text-[10px] text-neutral-600 italic font-medium">Sem dados</span>}
        </div>
      </CardContent>
    </Card>
  );
}
