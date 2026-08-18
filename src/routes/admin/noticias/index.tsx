import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ENV } from '@/lib/env';
import { getAllLocalPosts, deleteLocalPost } from '@/lib/local-posts';

export const Route = createFileRoute('/admin/noticias/')({
  component: NoticiasList,
});

function NoticiasList() {
  const queryClient = useQueryClient();

  const { data: noticias, isLoading, error } = useQuery({
    queryKey: ['admin-noticias'],
    queryFn: async () => {
      // Posts locais (seed + criados no admin)
      const local = getAllLocalPosts().map((p) => ({
        id: p.id,
        title: p.title,
        published_at: p.published_at,
        created_at: p.created_at,
        category: p.category,
        is_local: true,
      }));

      // Tenta buscar do Supabase também
      let remote: any[] = [];
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            published_at,
            created_at,
            category:categories(name)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          remote = data.map((p: any) => ({ ...p, is_local: false }));
        }
      } catch (e) {
        console.warn('Não foi possível carregar posts do Supabase:', e);
      }

      // Merge: local tem prioridade (mesmo slug/id)
      const remoteIds = new Set(remote.map((p) => p.id));
      const uniqueLocal = local.filter((p) => !remoteIds.has(p.id));

      const merged = [...uniqueLocal, ...remote].sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || 0).getTime();
        const dateB = new Date(b.published_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

      return merged;
    },
    retry: 1,
  });

  const handleDelete = async (id: string, isLocal: boolean) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      if (isLocal || ENV.USE_LOCAL_ADMIN_MOCK) {
        deleteLocalPost(id);
        toast.success('Notícia excluída (modo local)!');
      } else {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
        toast.success('Notícia excluída!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-noticias'] });
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + (err.message || 'desconhecido'));
    }
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-brand-dark border border-white/5 rounded-2xl animate-pulse" />
        <div className="h-10 w-32 bg-brand-dark border border-white/5 rounded-2xl animate-pulse" />
      </div>
      <div className="bg-brand-dark rounded-2xl border border-white/5 p-8 text-center shadow-premium">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
        <p className="text-neutral-400">Carregando notícias...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-900/50 p-12 rounded-lg text-center">
      <h3 className="text-xl font-bold text-red-500 mb-2">Erro de Conexão</h3>
      <p className="text-neutral-400 mb-6">Não foi possível carregar a lista de notícias.</p>
      <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
        Tentar Novamente
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notícias</h1>
          <p className="text-neutral-400">
            Gerencie o conteúdo do portal.
            {ENV.USE_LOCAL_ADMIN_MOCK && (
              <span className="ml-2 text-amber-500 text-sm">(modo local ativo)</span>
            )}
          </p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link to="/admin/noticias/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Notícia
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input 
            placeholder="Buscar por título..." 
            className="pl-10 bg-brand-dark border-white/10 rounded-xl focus:border-primary/50"
          />
        </div>
      </div>

      <div className="bg-brand-dark rounded-2xl border border-white/5 overflow-hidden shadow-premium">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Categoria</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Autor</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {noticias?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  Nenhuma notícia encontrada. Clique em "Nova Notícia" para começar.
                </td>
              </tr>
            )}
            {noticias?.map((noticia: any) => (
              <tr key={noticia.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium max-w-md truncate">{noticia.title}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {noticia.published_at 
                      ? format(new Date(noticia.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
                      : 'Rascunho'}
                    {noticia.is_local && (
                      <span className="ml-2 text-amber-500">• local</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-white/5 rounded text-xs text-neutral-300">
                    {noticia.category?.name || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-300">
                  Redação
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    noticia.published_at ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {noticia.published_at ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/noticias/$id" params={{ id: noticia.id }}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(noticia.id, !!noticia.is_local)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
