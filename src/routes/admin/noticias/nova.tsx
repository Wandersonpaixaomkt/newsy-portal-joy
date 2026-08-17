import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, ArrowLeft, Image as ImageIcon, Search, Globe, Share2, AlertTriangle, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute('/admin/noticias/nova')({
  component: NovaNoticia,
});

function NovaNoticia() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/admin/noticias/nova' }) as any;
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
    source_link: '',
    source_name: '',
  });

  useEffect(() => {
    if (search.import_title) {
      setFormData(prev => ({
        ...prev,
        title: search.import_title,
        excerpt: search.import_summary || '',
        image_url: search.import_image || '',
        source_link: search.import_link || '',
        source_name: search.import_source || '',
        slug: search.import_title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        meta_title: search.import_title,
        meta_description: search.import_summary || '',
      }));
      toast.info('Dados importados do radar! Lembre-se de revisar o conteúdo antes de publicar.');
    }
  }, [search]);

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

  const handleSave = async (status: 'draft' | 'published') => {
    setLoading(true);
    try {
      const { error } = await supabase.from('posts').insert([{
        ...formData,
        published_at: status === 'published' ? new Date().toISOString() : null,
      } as any]);
      if (error) throw error;
      toast.success(status === 'published' ? 'Notícia publicada!' : 'Rascunho salvo!');
      navigate({ to: '/admin/noticias' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/noticias' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Nova Notícia</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>Salvar Rascunho</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleSave('published')} disabled={loading}>Publicar Agora</Button>
        </div>
      </div>

      <Tabs defaultValue="conteudo" className="space-y-6">
        <TabsList className="bg-neutral-800 border-neutral-700">
          <TabsTrigger value="conteudo">Conteúdo Editorial</TabsTrigger>
          <TabsTrigger value="seo">SEO e Metadados</TabsTrigger>
        </TabsList>

        <TabsContent value="conteudo">
          {formData.source_link && (
            <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Aviso de Atribuição</AlertTitle>
              <AlertDescription>
                Esta notícia está sendo criada com base em uma fonte externa: <strong>{formData.source_name}</strong>. 
                A publicação automática está desativada. É obrigatório revisar o texto e garantir a atribuição correta.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Título da Manchete</Label>
                    {formData.source_link && (
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-blue-400" onClick={() => toast.success('Gerando texto original via IA...')}>
                        <FileText className="w-3 h-3" /> Gerar texto original opcional
                      </Button>
                    )}
                  </div>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '')})} className="bg-neutral-900 border-neutral-700 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-neutral-900 border-neutral-700 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label>Resumo</Label>
                  <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="bg-neutral-900 border-neutral-700 h-24" />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-neutral-900 border-neutral-700 h-[400px]" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-6">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Selecionar Categoria</option>
                    {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <select className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2" value={formData.city_id} onChange={e => setFormData({...formData, city_id: e.target.value})}>
                    <option value="">Selecionar Cidade</option>
                    {cities?.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Imagem Destacada</Label>
                  <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="bg-neutral-900 border-neutral-700" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-red-500"><Search className="w-4 h-4" /> Otimização para Google</h3>
              <div className="space-y-2">
                <Label>Meta Title (Max 60 caracteres)</Label>
                <Input value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="bg-neutral-900 border-neutral-700" maxLength={60} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (Max 160 caracteres)</Label>
                <Textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="bg-neutral-900 border-neutral-700" maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={formData.canonical_url} onChange={e => setFormData({...formData, canonical_url: e.target.value})} className="bg-neutral-900 border-neutral-700" placeholder="https://seusite.com/noticia/exemplo" />
              </div>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-blue-500"><Share2 className="w-4 h-4" /> Social Graph (Facebook/Twitter)</h3>
              <div className="space-y-2">
                <Label>Imagem de Compartilhamento (OG Image)</Label>
                <Input value={formData.og_image_url} onChange={e => setFormData({...formData, og_image_url: e.target.value})} className="bg-neutral-900 border-neutral-700" />
              </div>
              <div className="space-y-2">
                <Label>Robots Meta</Label>
                <select className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2" value={formData.robots_meta} onChange={e => setFormData({...formData, robots_meta: e.target.value})}>
                  <option value="index, follow">Index, Follow (Padrão)</option>
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
