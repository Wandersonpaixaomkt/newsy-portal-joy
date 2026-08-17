import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Search, Eye, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const Route = createFileRoute('/admin/seo/')({
  component: SEODashboard,
});

function SEODashboard() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-seo-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, meta_title, meta_description, slug, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getSEOStats = () => {
    if (!posts) return { total: 0, healthy: 0, issues: 0 };
    const healthy = posts.filter(p => p.meta_title && p.meta_description).length;
    return {
      total: posts.length,
      healthy,
      issues: posts.length - healthy,
      score: posts.length > 0 ? Math.round((healthy / posts.length) * 100) : 0
    };
  };

  const stats = getSEOStats();

  if (isLoading) return <div className="p-8 animate-pulse bg-neutral-800 rounded-lg h-96"></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SEO Avançado</h1>
        <p className="text-neutral-400">Gerencie a visibilidade do seu portal nos motores de busca.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Score Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-red-500">{stats.score}%</div>
            <Progress value={stats.score} className="h-2 mt-4 bg-neutral-900" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Saúde do Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Otimizados</span>
              <span className="text-green-500 font-bold">{stats.healthy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Com Alertas</span>
              <span className="text-yellow-500 font-bold">{stats.issues}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Indexação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-500">
              <Globe className="w-4 h-4" />
              <span className="font-bold">Sitemap.xml Ativo</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2">Última leitura pelo Google: Há 4 horas</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        <div className="p-6 border-b border-neutral-700 bg-neutral-800/50 flex justify-between items-center">
          <h3 className="font-bold">Auditoria de Matérias</h3>
          <Button size="sm" variant="outline" className="border-neutral-700 hover:bg-neutral-700">
            Exportar Relatório
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-widest text-neutral-500 bg-neutral-900/50">
              <tr>
                <th className="p-4">Matéria</th>
                <th className="p-4">Meta Title</th>
                <th className="p-4">Meta Desc</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {posts?.map(post => (
                <tr key={post.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div className="truncate font-medium text-white">{post.title}</div>
                    <div className="text-[10px] text-neutral-500 truncate">/{post.slug}</div>
                  </td>
                  <td className="p-4">
                    {post.meta_title ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </td>
                  <td className="p-4">
                    {post.meta_description ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      post.meta_title && post.meta_description 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {post.meta_title && post.meta_description ? 'Otimizado' : 'Incompleto'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Search className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
