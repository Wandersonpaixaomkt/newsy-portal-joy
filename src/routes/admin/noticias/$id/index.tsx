import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, ArrowLeft, Image as ImageIcon, Search, Share2, Type, Upload, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import imageCompression from 'browser-image-compression';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute('/admin/noticias/$id/')({
  component: EditarNoticia,
});

function EditarNoticia() {
  const { id } = useParams({ from: '/admin/noticias/$id/' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

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

  const { data: authors } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('authors').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: mediaFiles } = useQuery({
    queryKey: ['admin-media-library-edit'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('news-media-private').list('featured');
      if (error) throw error;
      return data;
    },
    enabled: showMediaLibrary
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    
    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-media-private')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('news-media-private')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl, og_image_url: data.publicUrl }));
      toast.success('Imagem carregada!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (status: 'draft' | 'published') => {
    setLoading(true);
    try {
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
      toast.success(status === 'published' ? 'Notícia publicada!' : 'Notícia atualizada!');
      navigate({ to: '/admin/noticias' });
    } catch (error: any) {
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
                  <Label>Conteúdo da Notícia</Label>
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
                  <Label>Imagem Destacada (Capa)</Label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Label htmlFor="img-upload-edit" className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer text-[10px] font-black uppercase tracking-widest gap-2 text-neutral-300">
                        <Upload className="w-4 h-4 text-primary" />
                        {uploading ? 'Enviando...' : 'Upload'}
                        <Input id="img-upload-edit" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </Label>
                      
                      <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                        <DialogTrigger asChild>
                          <button className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest gap-2 text-neutral-300">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Biblioteca
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-brand-dark border-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Biblioteca de Mídias</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                            {mediaFiles?.map(file => {
                              const url = supabase.storage.from('news-media-private').getPublicUrl(`featured/${file.name}`).data.publicUrl;
                              return (
                                <div 
                                  key={file.id} 
                                  className="aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-primary transition-all cursor-pointer relative group"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, image_url: url, og_image_url: url }));
                                    setShowMediaLibrary(false);
                                  }}
                                >
                                  <img src={url} alt={file.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] text-neutral-500">Ou link externo:</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                          placeholder="https://..." 
                          value={formData.image_url} 
                          onChange={e => setFormData({...formData, image_url: e.target.value})} 
                          className="bg-brand-dark border-white/10 pl-10 focus:border-primary/50 text-xs text-neutral-200" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-neutral-200 focus:border-primary/50" 
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
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-neutral-200 focus:border-primary/50" 
                    value={formData.city_id} 
                    onChange={e => setFormData({...formData, city_id: e.target.value})}
                  >
                    <option value="">Selecionar Cidade</option>
                    {cities?.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-neutral-200 focus:border-primary/50" 
                    value={formData.author_id} 
                    onChange={e => setFormData({...formData, author_id: e.target.value})}
                  >
                    <option value="">Redação (Padrão)</option>
                    {authors?.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
                  </select>
                </div>
                
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="is_featured" 
                    checked={formData.is_featured} 
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-brand-dark text-primary"
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer text-neutral-300">Notícia em Destaque</Label>
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
                <Input value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50 text-neutral-200" maxLength={60} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (Max 160 caracteres)</Label>
                <Textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50 text-neutral-200" maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={formData.canonical_url} onChange={e => setFormData({...formData, canonical_url: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50 text-neutral-200" />
              </div>
            </div>
            <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-4 shadow-premium">
              <h3 className="font-bold flex items-center gap-2 text-blue-500"><Share2 className="w-4 h-4" /> Social Graph (Facebook/Twitter)</h3>
              <div className="space-y-2">
                <Label>Imagem de Compartilhamento (OG Image)</Label>
                <Input value={formData.og_image_url} onChange={e => setFormData({...formData, og_image_url: e.target.value})} className="bg-brand-dark border-white/10 focus:border-primary/50 text-neutral-200" />
              </div>
              <div className="space-y-2">
                <Label>Robots Meta</Label>
                <select className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-neutral-200 focus:border-primary/50" value={formData.robots_meta} onChange={e => setFormData({...formData, robots_meta: e.target.value})}>
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
