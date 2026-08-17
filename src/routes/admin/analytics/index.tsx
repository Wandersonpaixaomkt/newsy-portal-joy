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


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-neutral-400">Desempenho do portal e audiência.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Visualizações Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-neutral-500">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-neutral-500">+5.4% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Tempo Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.avgTime}</div>
            <p className="text-xs text-neutral-500">-2s em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">CTR de Anúncios</CardTitle>
            <MousePointer2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4%</div>
            <p className="text-xs text-neutral-500">+0.3% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-neutral-800 p-8 rounded-lg border border-neutral-700 text-center py-20">
        <BarChart3 className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
        <h3 className="text-xl font-bold text-neutral-300">Gráficos Detalhados</h3>
        <p className="text-neutral-500 max-w-md mx-auto mt-2">
          Integração com Google Analytics ou sistema próprio de telemetria em breve para visualização de tendências.
        </p>
      </div>
    </div>
  );
}
