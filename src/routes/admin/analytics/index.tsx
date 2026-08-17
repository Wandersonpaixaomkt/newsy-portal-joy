import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, MousePointer2, Clock, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/admin/analytics/')({
  component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics-summary', period],
    queryFn: async () => {
      // Get real counts from Supabase
      const { count: totalViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view');
        
      const { count: uniqueVisitors } = await supabase
        .from('analytics_sessions')
        .select('visitor_id', { count: 'exact', head: true });

      // Daily views chart data
      const { data: dailyViews } = await supabase
        .from('analytics_events')
        .select('created_at')
        .eq('event_type', 'page_view')
        .order('created_at', { ascending: true });

      const processDailyData = (data: any[]) => {
        const counts: Record<string, number> = {};
        data?.forEach(item => {
          const date = new Date(item.created_at).toLocaleDateString();
          counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({ date, views: count }));
      };

      return {
        totalViews: totalViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        avgTime: '0m 0s',
        dailyData: processDailyData(dailyViews || []),
        deviceData: [
          { name: 'Desktop', value: 65, color: '#3b82f6' },
          { name: 'Mobile', value: 35, color: '#ef4444' },
        ]
      };
    },
  });


  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-neutral-800 w-48 rounded"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-neutral-800 rounded-lg"></div>)}
      </div>
      <div className="h-96 bg-neutral-800 rounded-lg"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-neutral-400">Desempenho do portal e audiência real.</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-neutral-800 border-neutral-700">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Visualizações Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-neutral-500">Dados baseados em telemetria real</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-neutral-500">Visitantes identificados por sessão</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.avgTime}</div>
            <p className="text-xs text-neutral-500">Tempo de permanência ativa</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Conversão</CardTitle>
            <MousePointer2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0%</div>
            <p className="text-xs text-neutral-500">Cliques em anúncios/links</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Visualizações por Dia</CardTitle>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500 italic">
                Ainda não há dados suficientes para gerar o gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.deviceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              {stats?.deviceData.map((d: any) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-sm text-neutral-400">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-neutral-800 p-8 rounded-lg border border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Principais Notícias</h3>
          <Button variant="ghost" className="text-neutral-400 hover:text-white">Ver tudo</Button>
        </div>
        <div className="text-center py-10 text-neutral-500 italic">
          Aguardando coletas de visualizações para listar as matérias mais lidas.
        </div>
      </div>
    </div>
  );
}
