import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCcw, TrendingUp, AlertCircle, Link as LinkIcon, Globe, MapPin, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute('/admin/fontes/')({
  component: MonitoramentoDashboard,
});

function MonitoramentoDashboard() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ['admin-competitor-sources-advanced'],
    queryFn: async () => {
      const { data, error } = await supabase.from('competitor_sources').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-8 animate-pulse bg-neutral-800 rounded-lg h-96"></div>;

  const defaultSources = [
    { name: 'Zé Dudu', region: 'Parauapebas', frequency: '15 min' },
    { name: 'Pebinha de Açúcar', region: 'Parauapebas', frequency: '15 min' },
    { name: 'Portal Canaã', region: 'Canaã', frequency: '30 min' },
    { name: 'G1 Pará', region: 'Estadual', frequency: '10 min' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento de Concorrentes</h1>
          <p className="text-neutral-400">Inteligência competitiva e radar de furos jornalísticos.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Adicionar Nova Fonte</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Radar de Notícias</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-black">12 Detectadas</div><p className="text-[10px] text-green-500 font-bold mt-1">Última há 4 minutos</p></CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Alertas de Urgência</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-black text-red-500">2 Críticos</div><p className="text-[10px] text-neutral-500 mt-1 uppercase">Possíveis furos jornalísticos</p></CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Cidades em Foco</CardTitle></CardHeader>
          <CardContent><div className="flex gap-1 flex-wrap"><Badge variant="outline">Parauapebas</Badge><Badge variant="outline">Canaã</Badge><Badge variant="outline">Marabá</Badge></div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fontes" className="space-y-6">
        <TabsList className="bg-neutral-800 border-neutral-700">
          <TabsTrigger value="fontes">Fontes Monitoradas</TabsTrigger>
          <TabsTrigger value="radar">Radar em Tempo Real</TabsTrigger>
          <TabsTrigger value="config">Configurações de Varredura</TabsTrigger>
        </TabsList>

        <TabsContent value="fontes">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] uppercase text-neutral-500 bg-neutral-900/50">
                  <tr>
                    <th className="p-4">Veículo</th>
                    <th className="p-4">Região</th>
                    <th className="p-4">Frequência</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {defaultSources.map((s, i) => (
                    <tr key={i} className="hover:bg-neutral-900/30">
                      <td className="p-4 font-bold text-white flex items-center gap-2"><Globe className="w-3 h-3 text-red-500" /> {s.name}</td>
                      <td className="p-4 text-neutral-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.region}</td>
                      <td className="p-4 text-neutral-500">{s.frequency}</td>
                      <td className="p-4"><Badge className="bg-green-500/10 text-green-500">Ativo</Badge></td>
                      <td className="p-4 text-right"><Button size="sm" variant="ghost">Relatório</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
