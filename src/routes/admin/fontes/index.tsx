import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, RefreshCcw, TrendingUp, AlertCircle, 
  Link as LinkIcon, Globe, MapPin, Hash, Search, 
  PenTool, CheckCircle, Trash2, Bookmark, Eye,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export const Route = createFileRoute('/admin/fontes/')({
  component: MonitoramentoDashboard,
});

function MonitoramentoDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['admin-competitor-sources'],
    queryFn: async () => {
      const { data, error } = await supabase.from('competitor_sources').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: radarItems, isLoading: radarLoading } = useQuery({
    queryKey: ['admin-pautas-radar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pautas_central')
        .select('*')
        .order('discovered_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const updatePautaMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('pautas_central').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pautas-radar'] });
      toast.success('Pauta atualizada');
    }
  });

  const handleCreateRascunho = (item: any) => {
    const params = new URLSearchParams({
      import_title: item.headline,
      import_summary: item.summary || '',
      import_link: item.original_link || '',
      import_source: item.source_portal,
      import_image: item.image_url || '',
    });
    navigate({ to: `/admin/noticias/nova?${params.toString()}` });
  };

  const defaultSources = [
    { name: 'Zé Dudu', region: 'Parauapebas', frequency: '15 min' },
    { name: 'Pebinha de Açúcar', region: 'Parauapebas', frequency: '15 min' },
    { name: 'Portal Canaã', region: 'Canaã', frequency: '30 min' },
    { name: 'G1 Pará', region: 'Estadual', frequency: '10 min' },
  ];

  const isLoading = sourcesLoading || radarLoading;

  if (isLoading) return <div className="p-8 animate-pulse bg-neutral-800 rounded-lg h-96"></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Central de Pautas & Radar</h1>
          <p className="text-neutral-400">Inteligência competitiva e radar de notícias da região.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Atualizar Radar
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">Adicionar Nova Fonte</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Radar Ativo</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{radarItems?.filter(i => !i.is_analyzed && !i.is_ignored).length || 0}</div>
            <p className="text-[10px] text-green-500 font-bold mt-1">Varredura em execução</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Alertas Críticos</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-500">2 Urgentes</div>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase">Possíveis furos</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Pautas Salvas</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-500">{radarItems?.filter(i => i.is_saved).length || 0}</div>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase">Para revisar depois</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-neutral-500 uppercase">Cidades Monitoradas</CardTitle></CardHeader>
          <CardContent><div className="flex gap-1 flex-wrap"><Badge variant="outline">Parauapebas</Badge><Badge variant="outline">Canaã</Badge><Badge variant="outline">Marabá</Badge></div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="radar" className="space-y-6">
        <TabsList className="bg-neutral-800 border-neutral-700">
          <TabsTrigger value="radar" className="gap-2"><TrendingUp className="w-4 h-4" /> Radar em Tempo Real</TabsTrigger>
          <TabsTrigger value="fontes" className="gap-2"><Globe className="w-4 h-4" /> Fontes Monitoradas</TabsTrigger>
          <TabsTrigger value="alertas" className="gap-2"><AlertCircle className="w-4 h-4" /> Alertas de Relevância</TabsTrigger>
        </TabsList>

        <TabsContent value="radar" className="space-y-4">
          <AnimatePresence>
            {radarItems?.filter(i => !i.is_ignored && !i.is_analyzed).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-red-500/50 transition-all group"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                  <div className="md:col-span-1">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.headline} className="w-full h-40 object-cover rounded-lg bg-neutral-900" />
                    ) : (
                      <div className="w-full h-40 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-neutral-700" />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">{item.source_portal}</Badge>
                          <span className="text-[10px] text-neutral-500 uppercase font-bold">
                            {format(new Date(item.discovered_at || new Date()), "HH:mm '•' d 'de' MMMM", { locale: ptBR })}
                          </span>
                          {item.is_new && <Badge className="bg-green-500 text-white animate-pulse">NOVO</Badge>}
                          {item.duplicate_post_id && <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 gap-1"><AlertCircle className="w-3 h-3" /> Possível Duplicidade</Badge>}
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors leading-tight">{item.headline}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-neutral-500 hover:text-white" onClick={() => updatePautaMutation.mutate({ id: item.id, is_saved: !item.is_saved })}>
                          <Bookmark className={`w-5 h-5 \${item.is_saved ? 'fill-blue-500 text-blue-500' : ''}`} />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-neutral-500 hover:text-red-500" onClick={() => updatePautaMutation.mutate({ id: item.id, is_ignored: true })}>
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-neutral-400 text-sm line-clamp-2">{item.summary}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-neutral-500"><Hash className="w-3 h-3" /> {item.category || 'Geral'}</div>
                      <div className="flex items-center gap-1 text-neutral-500"><MapPin className="w-3 h-3" /> {item.city || 'Região'}</div>
                      <div className="flex items-center gap-1 text-neutral-500"><Eye className="w-3 h-3" /> Descoberto há {format(new Date(item.discovered_at || new Date()), "mm")} min</div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline" className="gap-2" asChild>
                        <a href={item.original_link || '#'} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" /> Abrir Fonte
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Search className="w-3 h-3" /> Pesquisar Tema
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
                        <PenTool className="w-3 h-3" /> Criar Pauta
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 gap-2" onClick={() => handleCreateRascunho(item)}>
                        <PenTool className="w-3 h-3" /> Criar Rascunho
                      </Button>
                      <Button size="sm" variant="ghost" className="text-green-500 hover:bg-green-500/10 gap-2" onClick={() => updatePautaMutation.mutate({ id: item.id, is_analyzed: true })}>
                        <CheckCircle className="w-3 h-3" /> Marcar Analisado
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {radarItems?.filter(i => !i.is_ignored && !i.is_analyzed).length === 0 && (
              <div className="p-12 text-center bg-neutral-800 rounded-xl border border-dashed border-neutral-700">
                <div className="bg-neutral-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="w-8 h-8 text-neutral-700" />
                </div>
                <h3 className="text-lg font-bold">Nenhuma novidade no momento</h3>
                <p className="text-neutral-500">O radar continua varrendo as fontes em busca de novos conteúdos.</p>
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

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
