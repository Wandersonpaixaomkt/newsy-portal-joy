import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, ArrowLeft, Image as ImageIcon, Search, Share2, Type } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    og_image_url: '',
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
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        canonical_url: post.canonical_url || '',
        robots_meta: post.robots_meta || 'index, follow',
        og_image_url: post.og_image_url || '',
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

  const handleUpdate = async (status: 'draft' | 'published') => {
    setLoading(true);
    try {
      // Garantir atualização do post
      
      const updatePayload = {
        ...formData,
        published_at: status === 'published' ? (post?.published_at || new Date().toISOString()) : (status === 'draft' ? null : post?.published_at),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('posts')
        .update(updatePayload as any)
        .eq('id', id);

      if (error) throw error;
      toast.success(status === 'published' ? 'Notícia publicada com sucesso!' : 'Notícia atualizada!');
      navigate({ to: '/admin/noticias' });
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Erro ao atualizar notícia');
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
          <Button variant="outline" onClick={() => handleUpdate('draft')} disabled={loading}>Salvar Alterações</Button>
          {!post?.published_at && (
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleUpdate('published')} disabled={loading}>Publicar</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="conteudo" className="space-y-6">
        <TabsList className="bg-brand-dark border-white/5">
          <TabsTrigger value="conteudo">Conteúdo Editorial</TabsTrigger>
          <TabsTrigger value="seo">SEO e Metadados</TabsTrigger>
        </TabsList>

        <TabsContent value="conteudo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-4 shadow-premium">
                <div className="space-y-2">
                  <Label>Título da Manchete</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-brand-dark border-white/10 font-bold focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-brand-dark border-white/10 text-xs focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Resumo</Label>
                  <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="bg-brand-dark border-white/10 h-24 focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <RichTextEditor 
                    content={formData.content} 
                    onChange={content => setFormData({...formData, content})} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-6 shadow-premium">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-white focus:border-primary/50" 
                    value={formData.category_id} 
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Selecionar Categoria</option>
                    {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-white focus:border-primary/50" 
                    value={formData.city_id} 
                    onChange={e => setFormData({...formData, city_id: e.target.value})}
                  >
                    <option value="">Selecionar Cidade</option>
                    {cities?.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Imagem Destacada (URL)</Label>
                  <Input 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    className="bg-brand-dark border-white/10 focus:border-primary/50" 
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 w-full aspect-video object-cover rounded border border-neutral-700" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="is_featured" 
                    checked={formData.is_featured} 
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-brand-dark text-primary"
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">Notícia em Destaque</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_urgent" 
                    checked={formData.is_urgent} 
                    onChange={e => setFormData({...formData, is_urgent: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-brand-dark text-primary"
                  />
                  <Label htmlFor="is_urgent" className="cursor-pointer text-red-500 font-bold">Plantão Urgente</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-4 shadow-premium">
              <h3 className="font-bold flex items-center gap-2 text-red-500"><Search className="w-4 h-4" /> Otimização para Google</h3>
              <div className="space-y-2">
                <Label>Meta Title (Max 60 caracteres)</Label>
                <Input value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50" maxLength={60} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (Max 160 caracteres)</Label>
                <Textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50" maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={formData.canonical_url} onChange={e => setFormData({...formData, canonical_url: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50" />
              </div>
            </div>
            <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-4 shadow-premium">
              <h3 className="font-bold flex items-center gap-2 text-blue-500"><Share2 className="w-4 h-4" /> Social Graph (Facebook/Twitter)</h3>
              <div className="space-y-2">
                <Label>Imagem de Compartilhamento (OG Image)</Label>
                <Input value={formData.og_image_url} onChange={e => setFormData({...formData, og_image_url: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label>Robots Meta</Label>
                <select className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2" value={formData.robots_meta} onChange={e => setFormData({...formData, robots_meta: e.target.value})}>
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, nofollow">NoIndex, NoFollow</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
