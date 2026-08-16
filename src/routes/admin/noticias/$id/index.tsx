import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/noticias/$id/')({
  component: EditarNoticia,
});

function EditarNoticia() {
  const { id } = useParams({ from: '/admin/noticias/$id/' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    city_id: '',
    author_id: '',
    image_url: '',
    is_featured: false,
    is_urgent: false,
  });

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category_id: post.category_id || '',
        city_id: post.city_id || '',
        author_id: post.author_id || '',
        image_url: post.image_url || '',
        is_featured: post.is_featured || false,
        is_urgent: post.is_urgent || false,
      });
    }
  }, [post]);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: cities } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: authors } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('authors').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleUpdate = async (status: 'draft' | 'published') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          ...formData,
          published_at: status === 'published' ? new Date().toISOString() : (post?.published_at || null),
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', id);

      if (error) throw error;

      toast.success('Notícia atualizada!');
      navigate({ to: '/admin/noticias' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isPostLoading) return <div className="p-8 text-neutral-400">Carregando notícia...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/noticias' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Editar Notícia</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleUpdate('draft')} disabled={loading}>
            Salvar Alterações
          </Button>
          {!post?.published_at && (
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleUpdate('published')} disabled={loading}>
              Publicar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
            <div className="space-y-2">
              <Label>Título da Manchete</Label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="bg-neutral-900 border-neutral-700 text-lg font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="bg-neutral-900 border-neutral-700 text-neutral-400 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Resumo / Gravata</Label>
              <Textarea 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="bg-neutral-900 border-neutral-700 h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo da Notícia</Label>
              <Textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="bg-neutral-900 border-neutral-700 h-[400px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-6">
            <h3 className="font-semibold text-neutral-400 uppercase text-xs tracking-wider">Metadados</h3>
            
            <div className="space-y-2">
              <Label>Categoria</Label>
              <select 
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Selecionar Categoria</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Cidade / Região</Label>
              <select 
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2"
                value={formData.city_id}
                onChange={e => setFormData({...formData, city_id: e.target.value})}
              >
                <option value="">Selecionar Cidade</option>
                {cities?.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Autor</Label>
              <select 
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2"
                value={formData.author_id}
                onChange={e => setFormData({...formData, author_id: e.target.value})}
              >
                <option value="">Selecionar Autor</option>
                {authors?.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>URL da Imagem Destacada</Label>
              <Input 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                className="bg-neutral-900 border-neutral-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_featured"
                checked={formData.is_featured}
                onChange={e => setFormData({...formData, is_featured: e.target.checked})}
              />
              <Label htmlFor="is_featured">Destaque na Home</Label>
            </div>

            <div className="flex items-center gap-2 text-red-500">
              <input 
                type="checkbox" 
                id="is_urgent"
                checked={formData.is_urgent}
                onChange={e => setFormData({...formData, is_urgent: e.target.checked})}
              />
              <Label htmlFor="is_urgent" className="text-red-500">Notícia Urgente (AO VIVO)</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
