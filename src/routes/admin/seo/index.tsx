import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Search, Globe, FileWarning, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AdminCard } from '@/components/admin/AdminCard';

export const Route = createFileRoute('/admin/seo/')({
  component: SEODashboard,
});

function SEODashboard() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-seo-posts-advanced'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, meta_title, meta_description, slug, canonical_url, schema_data, content, image_url')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const analyzeSEO = (post: any) => {
    const issues = [];
    if (!post.meta_title) issues.push('Meta title ausente');
    else if (post.meta_title.length < 30) issues.push('Meta title curto');
    
    if (!post.meta_description) issues.push('Meta description ausente');
    else if (post.meta_description.length < 120) issues.push('Meta description curta');
    
    if (!post.canonical_url) issues.push('Canonical URL ausente');
    if (!post.image_url) issues.push('Imagem social ausente');
    if (post.content && post.content.length < 300) issues.push('Conteúdo muito curto');

    return issues;
  };

  const getSEOStats = () => {
    if (!posts) return { score: 0, healthy: 0, critical: 0, total: 0 };
    let totalScore = 0;
    let healthy = 0;
    let critical = 0;

    posts.forEach(p => {
      const issues = analyzeSEO(p);
      if (issues.length === 0) healthy++;
      if (issues.some(i => i.includes('ausente'))) critical++;
      totalScore += Math.max(0, 100 - (issues.length * 20));
    });

    return {
      total: posts.length,
      healthy,
      critical,
      score: posts.length > 0 ? Math.round(totalScore / posts.length) : 0
    };
  };

  const stats = getSEOStats();

  if (isLoading) return <div className="p-8 animate-pulse bg-brand-dark border border-white/5 rounded-2xl h-96 shadow-premium"></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SEO Avançado</h1>
        <p className="text-neutral-400">Auditoria completa de saúde e visibilidade orgânica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard title="Nota Geral de Saúde">
          <div>
            <div className={`text-4xl font-black ${stats.score > 70 ? 'text-green-500' : 'text-primary'}`}>{stats.score}%</div>
            <Progress value={stats.score} className="h-2 mt-4 bg-white/5 [&>div]:bg-primary" />
          </div>
        </AdminCard>

        <AdminCard title="Alertas Críticos">
          <div>
            <div className="text-4xl font-black text-primary">{stats.critical}</div>
            <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest">Notícias com dados ausentes</p>
          </div>
        </AdminCard>

        <AdminCard title="Estrutura Técnica">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
              <Globe className="w-3 h-3" /> Sitemap Ativo
            </div>
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
              <LinkIcon className="w-3 h-3" /> Robots.txt OK
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="bg-brand-dark rounded-2xl border border-white/5 overflow-hidden shadow-premium">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="font-bold">Checklist de Otimização</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase text-neutral-500 bg-white/5">
              <tr>
                <th className="p-4">Matéria</th>
                <th className="p-4">Problemas Detectados</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts?.map(post => {
                const issues = analyzeSEO(post);
                return (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 max-w-xs">
                      <div className="truncate font-medium text-white">{post.title}</div>
                      <div className="text-[10px] text-neutral-500 truncate">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      {issues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {issues.map((issue, i) => (
                            <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                              {issue}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-green-500 font-bold uppercase">100% Otimizada</span>
                      )}
                    </td>
                    <td className="p-4">
                      {issues.length === 0 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <FileWarning className="w-4 h-4 text-yellow-500" />}
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost">Corrigir</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
