import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/noticias/')({
  component: NoticiasList,
});

function NoticiasList() {
  const { data: noticias, isLoading, error } = useQuery({
    queryKey: ['admin-noticias'],
    queryFn: async () => {
      // First check if categories and authors exist to avoid join errors
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          published_at,
          category:categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching noticias:', error);
        throw error;
      }
      return data;
    },
    retry: 1,
    meta: {
      errorMessage: 'Não foi possível carregar as notícias. Verifique se as tabelas existem no banco de dados.'
    }
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-neutral-800 rounded animate-pulse" />
        <div className="h-10 w-32 bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
        <p className="text-neutral-400">Carregando notícias...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-900/50 p-12 rounded-lg text-center">
      <h3 className="text-xl font-bold text-red-500 mb-2">Erro de Conexão</h3>
      <p className="text-neutral-400 mb-6">Não foi possível carregar a lista de notícias. Verifique sua permissão ou conexão com o banco.</p>
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
          <p className="text-neutral-400">Gerencie o conteúdo do portal.</p>
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
            placeholder="Buscar por título ou autor..." 
            className="pl-10 bg-neutral-800 border-neutral-700"
          />
        </div>
      </div>

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Categoria</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Autor</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {noticias?.map((noticia: any) => (
              <tr key={noticia.id} className="hover:bg-neutral-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium max-w-md truncate">{noticia.title}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {noticia.published_at 
                      ? format(new Date(noticia.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
                      : 'Rascunho'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-neutral-900 rounded text-xs text-neutral-300">
                    {noticia.category?.name || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-300">
                  {'Redação'}
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
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
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
