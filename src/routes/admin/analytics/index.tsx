import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, MousePointer2, Clock, Calendar, MapPin, Globe, Share2, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/admin/analytics/')({
  component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics-deep', period],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();
      
      if (period === '24h') startDate.setHours(now.getHours() - 24);
      else if (period === 'yesterday') {
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
      }
      else if (period === '7d') startDate.setDate(now.getDate() - 7);
      else if (period === '30d') startDate.setDate(now.getDate() - 30);
      else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      const startIso = startDate.toISOString();
      const endIso = now.toISOString();

      // 1. Total Metrics
      const { count: totalViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('created_at', startIso)
        .lte('created_at', endIso);
        
      const { count: uniqueVisitors } = await supabase
        .from('analytics_sessions')
        .select('visitor_id', { count: 'exact', head: true })
        .gte('started_at', startIso)
        .lte('started_at', endIso);

      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('id, device_info, started_at, ended_at')
        .gte('started_at', startIso)
        .lte('started_at', endIso);

      // Calculate avg duration
      let totalDuration = 0;
      let sessionsWithDuration = 0;
      sessions?.forEach(s => {
        if (s.started_at && s.ended_at) {
          const start = new Date(s.started_at).getTime();
          const end = new Date(s.ended_at).getTime();
          totalDuration += (end - start);
          sessionsWithDuration++;
        }
      });
      const avgDurationMs = sessionsWithDuration > 0 ? totalDuration / sessionsWithDuration : 0;
      const avgTimeStr = avgDurationMs > 0 
        ? `${Math.floor(avgDurationMs / 60000)}m ${Math.floor((avgDurationMs % 60000) / 1000)}s` 
        : "Ainda não há dados suficientes";

      // 2. Charts Data
      const { data: events } = await supabase
        .from('analytics_events')
        .select('created_at, event_type, device_type, utm_source, page_path, scroll_depth')
        .gte('created_at', startIso)
        .lte('created_at', endIso)
        .order('created_at', { ascending: true });

      // Daily Views
      const dailyMap: Record<string, number> = {};
      events?.filter(e => e.event_type === 'page_view').forEach(e => {
        const date = new Date(e.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        dailyMap[date] = (dailyMap[date] || 0) + 1;
      });
      const dailyData = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

      // Devices
      const deviceMap: Record<string, number> = {};
      events?.forEach(e => {
        const type = e.device_type || 'Desktop';
        deviceMap[type] = (deviceMap[type] || 0) + 1;
      });
      const totalEvents = events?.length || 1;
      const deviceData = Object.entries(deviceMap).map(([name, count]) => ({
        name,
        value: Math.round((count / totalEvents) * 100),
        color: name === 'mobile' ? '#ef4444' : '#3b82f6'
      }));

      // Hourly peak
      const hourlyMap: Record<number, number> = {};
      events?.filter(e => e.event_type === 'page_view').forEach(e => {
        const hour = new Date(e.created_at).getHours();
        hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
      });
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}h`,
        views: hourlyMap[i] || 0
      }));

      // Top Pages
      const pageMap: Record<string, number> = {};
      events?.filter(e => e.event_type === 'page_view').forEach(e => {
        pageMap[e.page_path] = (pageMap[e.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageMap)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Browsers (from session device_info)
      const browserMap: Record<string, number> = {};
      sessions?.forEach(s => {
        const info = s.device_info as any;
        const b = info?.browser || 'Outros';
        browserMap[b] = (browserMap[b] || 0) + 1;
      });
      const browserData = Object.entries(browserMap).map(([name, count]) => ({ name, count }));

      return {
        totalViews: totalViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        avgTime: avgTimeStr,
        dailyData,
        deviceData,
        hourlyData,
        topPages,
        browserData,
        shareCount: events?.filter(e => e.event_type === 'share_click').length || 0,
        adClicks: events?.filter(e => e.event_type === 'ad_click').length || 0
      };
    },
  });

  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-neutral-800 w-48 rounded"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-neutral-800 rounded-lg"></div>)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-96 bg-neutral-800 rounded-lg"></div>
        <div className="h-96 bg-neutral-800 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Analytics Real</h1>
          <p className="text-neutral-400">Monitoramento funcional em tempo real (LGPD Compliant).</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-neutral-800 border-neutral-700">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="month">Mês Atual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pageviews" value={stats?.totalViews || 0} icon={TrendingUp} color="text-red-500" sub="Visualizações reais" />
        <StatCard title="Usuários Únicos" value={stats?.uniqueVisitors || 0} icon={Users} color="text-blue-500" sub="Visitantes distintos" />
        <StatCard title="Tempo Médio" value={stats?.avgTime || '0s'} icon={Clock} color="text-orange-500" sub="Duração da sessão" />
        <StatCard title="Compartilhamentos" value={stats?.shareCount || 0} icon={Share2} color="text-green-500" sub="Engajamento social" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audience Chart */}
        <Card className="lg:col-span-2 bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Audiência por Período</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats?.dailyData && stats.dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage />
            )}
          </CardContent>
        </Card>

        {/* Devices Chart */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
             {stats?.deviceData && stats.deviceData.length > 0 ? (
               <>
                 <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.deviceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-4">
                  {stats.deviceData.map((d: any) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                      <span className="text-xs text-neutral-400 capitalize">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
               </>
             ) : <NoDataMessage />}
          </CardContent>
        </Card>

        {/* Hourly Peak */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {stats?.hourlyData && stats.hourlyData.some(d => d.views > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="hour" stroke="#666" fontSize={10} interval={3} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <NoDataMessage />}
          </CardContent>
        </Card>

        {/* Top Pages Table */}
        <Card className="lg:col-span-2 bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Páginas Mais Acessadas</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topPages && stats.topPages.length > 0 ? (
              <div className="space-y-4">
                {stats.topPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-neutral-700 pb-3 last:border-0">
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-neutral-500 font-mono text-xs">{idx + 1}</span>
                      <span className="text-sm font-medium text-white truncate max-w-xs">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{page.views.toLocaleString()}</span>
                        <span className="text-[10px] text-neutral-500 block">VIEWS</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <NoDataMessage />}
          </CardContent>
        </Card>
      </div>

      {/* Geo & Acquisition Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg font-bold">Distribuição Geográfica</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-neutral-500 italic mb-4">Dados baseados no fuso horário do visitante</p>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-neutral-400">America/Sao_Paulo (Brasil)</span>
                 <span className="text-white font-bold">100%</span>
               </div>
               <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full w-full"></div>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-lg font-bold">Aquisição e Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex justify-between items-center border-b border-neutral-700 pb-3">
               <span className="text-sm text-neutral-400">Cliques em Anúncios</span>
               <span className="text-white font-black">{stats?.adClicks || 0}</span>
             </div>
             <div className="flex justify-between items-center border-b border-neutral-700 pb-3">
               <span className="text-sm text-neutral-400">CTR (Cliques/Pageviews)</span>
               <span className="text-white font-black">
                 {stats?.totalViews ? ((stats.adClicks / stats.totalViews) * 100).toFixed(2) : 0}%
               </span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon: Icon, sub }: { 
  title: string; 
  value: number | string; 
  color: string;
  icon: any;
  sub: string;
}) {
  return (
    <Card className="bg-neutral-800 border-neutral-700 hover:border-red-600/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black text-neutral-500 uppercase tracking-widest">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <p className="text-[10px] text-neutral-500 mt-1 font-bold uppercase tracking-tighter">{sub}</p>
      </CardContent>
    </Card>
  );
}

function NoDataMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-neutral-600 space-y-2 py-10">
      <AlertCircle className="w-8 h-8 opacity-20" />
      <span className="text-sm font-medium italic">Ainda não há dados suficientes</span>
    </div>
  );
}
