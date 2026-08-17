import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCcw, TrendingUp, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/fontes/')({
  component: FontesList,
});

function FontesList() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ['admin-competitor-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitor_sources')
        .select(`
          *,
          competitor_articles(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-8 animate-pulse bg-neutral-800 rounded-lg h-96"></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento de Concorrentes</h1>
          <p className="text-neutral-400">Acompanhe o que outros portais estão publicando em tempo real.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Nova Fonte RSS</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
             <CardTitle className="text-xs text-neutral-500 uppercase">Fontes Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sources?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
             <CardTitle className="text-xs text-neutral-500 uppercase">Matérias Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-neutral-800/50">
           <h3 className="font-bold flex items-center gap-2">
             <LinkIcon className="w-4 h-4 text-red-500" />
             Portais Monitorados
           </h3>
           <Button variant="ghost" size="sm" className="text-neutral-400">
             <RefreshCcw className="w-4 h-4 mr-2" /> Sincronizar Tudo
           </Button>
        </div>

        {sources && sources.length > 0 ? (
          <div className="divide-y divide-neutral-700">
            {sources.map(source => (
              <div key={source.id} className="p-6 flex items-center justify-between hover:bg-neutral-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center text-lg font-bold text-neutral-400">
                    {source.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{source.name}</h4>
                    <p className="text-xs text-neutral-500">{source.rss_url || source.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                     <div className="text-xs text-neutral-500 uppercase">Status</div>
                     <Badge className={source.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                       {source.status === 'active' ? 'Ativo' : 'Inativo'}
                     </Badge>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-neutral-500 uppercase">Frequência</div>
                     <div className="text-sm font-medium">{source.frequency_minutes || 60} min</div>
                   </div>
                   <Button variant="ghost" size="icon">
                     <ExternalLink className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
            <h4 className="text-lg font-bold text-neutral-400">Nenhuma fonte configurada</h4>
            <p className="text-neutral-500 max-w-sm mx-auto mt-2">
              Adicione URLs RSS de concorrentes para começar a receber alertas de furos jornalísticos.
            </p>
            <Button className="mt-6 bg-red-600 hover:bg-red-700">Adicionar Primeiro Concorrente</Button>
          </div>
        )}
      </div>

      <div className="bg-red-950/10 border border-red-900/20 p-6 rounded-lg">
         <div className="flex items-center gap-2 mb-4">
           <TrendingUp className="w-5 h-5 text-red-500" />
           <h3 className="font-bold text-red-500">Últimas do Mercado</h3>
         </div>
         <div className="text-sm text-neutral-500 italic">
           Nenhuma matéria externa detectada nos últimos 60 minutos.
         </div>
      </div>
    </div>
  );
}
