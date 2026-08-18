import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  ArrowLeft, Image as ImageIcon, Search, Share2, Upload, Link as LinkIcon, 
  Trash2, CheckCircle2, AlertTriangle, Globe, Loader2, FileDown 
} from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import imageCompression from 'browser-image-compression';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ENV } from '@/lib/env';
import { generateLocalId, saveLocalPost } from '@/lib/local-posts';
import type { Post } from '@/lib/news';
import { extractNewsFromUrl, type ExtractedNews } from '@/lib/extract-from-url';

export const Route = createFileRoute('/admin/noticias/nova')({
  component: NovaNoticia,
});

function NovaNoticia() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/admin/noticias/nova' }) as any;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Importador de URL
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedNews | null>(null);
  const [selectedCover, setSelectedCover] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    city_id: '',
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
    author_id: null as string | null,
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

  const { data: mediaFiles } = useQuery({
    queryKey: ['admin-media-library'],
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
    if (!file) {
      setUploading(false);
      return;
    }
    
    try {
      // Modo local: grava como base64 (não depende do Supabase Storage)
      if (ENV.USE_LOCAL_ADMIN_MOCK) {
        if (file.size > 1.5 * 1024 * 1024) {
          toast.error('Imagem muito grande. Use até 1,5 MB ou cole um link.');
          setUploading(false);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setFormData(prev => ({ ...prev, image_url: dataUrl, og_image_url: dataUrl }));
          toast.success('Imagem de capa carregada (modo local)!');
          setUploading(false);
        };
        reader.onerror = () => {
          toast.error('Erro ao ler a imagem');
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

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
      toast.success('Imagem carregada com sucesso!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExtract = async () => {
    if (!importUrl.trim()) {
      toast.error('Cole um link válido');
      return;
    }
    setExtracting(true);
    setExtracted(null);
    setSelectedCover('');
    try {
      const result = await extractNewsFromUrl(importUrl.trim());
      setExtracted(result);
      // Seleciona a primeira imagem como capa por padrão
      if (result.images.length > 0) {
        setSelectedCover(result.images[0]);
      }
      toast.success('Conteúdo extraído! Revise e aplique no formulário.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao extrair notícia');
    } finally {
      setExtracting(false);
    }
  };

  const handleApplyExtracted = () => {
    if (!extracted) return;

    const slug = extracted.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 80);

    setFormData(prev => ({
      ...prev,
      title: extracted.title,
      slug,
      excerpt: extracted.excerpt,
      content: extracted.contentHtml,
      image_url: selectedCover || prev.image_url,
      og_image_url: selectedCover || prev.og_image_url,
      source_link: extracted.sourceUrl,
      source_name: extracted.sourceName,
      meta_title: extracted.title.slice(0, 60),
      meta_description: extracted.excerpt.slice(0, 160),
      canonical_url: extracted.sourceUrl,
    }));

    setShowImportDialog(false);
    setExtracted(null);
    setImportUrl('');
    setSelectedCover('');
    toast.success('Dados importados — revise o texto e a capa antes de publicar!');
  };

  const resetImportDialog = (open: boolean) => {
    setShowImportDialog(open);
    if (!open) {
      setExtracted(null);
      setImportUrl('');
      setSelectedCover('');
      setExtracting(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title) {
      toast.error('Título é obrigatório');
      return;
    }
    if (!formData.slug) {
      toast.error('Slug é obrigatório');
      return;
    }
    
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const categoryName = categories?.find(c => c.id === formData.category_id)?.name || 'Geral';
      const categorySlug = categories?.find(c => c.id === formData.category_id)?.slug || 'geral';
      const cityName = cities?.find(c => c.id === formData.city_id)?.name || null;
      const citySlug = cities?.find(c => c.id === formData.city_id)?.slug || null;

      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        category_id: formData.category_id || null,
        city_id: formData.city_id || null,
        author_id: formData.author_id || null,
        image_url: formData.image_url || null,
        is_featured: formData.is_featured || false,
        is_urgent: formData.is_urgent || false,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        canonical_url: formData.canonical_url || null,
        robots_meta: formData.robots_meta || 'index, follow',
        og_image_url: formData.og_image_url || null,
        published_at: status === 'published' ? now : null,
        updated_at: now,
        created_at: now,
      };

      if (ENV.USE_LOCAL_ADMIN_MOCK) {
        const localPost: Post = {
          ...payload,
          id: generateLocalId(),
          category: formData.category_id
            ? { name: categoryName, slug: categorySlug }
            : { name: 'Geral', slug: 'geral' },
          city: formData.city_id && cityName
            ? { name: cityName, slug: citySlug! }
            : null,
          author: { name: 'Redação', slug: 'redacao' },
          tags: [],
          focus_keyword: null,
          og_image: null,
          schema_data: null,
          seo_score: null,
          twitter_card: null,
          twitter_card_type: 'summary_large_image',
        };

        saveLocalPost(localPost);
        toast.success(
          status === 'published'
            ? 'Notícia publicada (modo local)!'
            : 'Rascunho salvo (modo local)!'
        );
        navigate({ to: '/admin/noticias' });
        return;
      }

      const { error } = await supabase.from('posts').insert([payload]);
      if (error) throw error;
      toast.success(status === 'published' ? 'Notícia publicada!' : 'Rascunho salvo!');
      navigate({ to: '/admin/noticias' });
    } catch (error: any) {
      console.error('Erro ao salvar notícia:', error);
      toast.error(error.message || 'Erro ao salvar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/noticias' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Nova Notícia</h1>
            {ENV.USE_LOCAL_ADMIN_MOCK && (
              <p className="text-xs text-amber-600 mt-1">Modo local ativo — grava no navegador</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Dialog open={showImportDialog} onOpenChange={resetImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 gap-2">
                <Globe className="w-4 h-4" />
                Importar de URL
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-neutral-200 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-neutral-900">
                  <FileDown className="w-5 h-5 text-blue-600" />
                  Extrair notícia de um link
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {!extracted ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-neutral-700">Cole o link da notícia</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input
                            placeholder="https://g1.globo.com/... ou qualquer portal"
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !extracting && handleExtract()}
                            className="pl-10 bg-white border-neutral-200"
                            disabled={extracting}
                          />
                        </div>
                        <Button
                          onClick={handleExtract}
                          disabled={extracting || !importUrl.trim()}
                          className="bg-blue-600 hover:bg-blue-700 shrink-0"
                        >
                          {extracting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Extraindo...
                            </>
                          ) : (
                            'Extrair'
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Funciona com a maioria dos portais. O conteúdo é extraído automaticamente e você poderá editar tudo antes de publicar.
                      </p>
                    </div>
                    {extracting && (
                      <div className="flex flex-col items-center justify-center py-10 gap-3 text-neutral-500">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm">Lendo a página e extraindo título, texto e imagens...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-5">
                    <Alert className="bg-green-50 border-green-200 text-green-800 rounded-xl">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle className="font-bold">Extração concluída</AlertTitle>
                      <AlertDescription>
                        Revise os dados abaixo. Depois de aplicar, você ainda pode editar título, texto e imagens no formulário.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label className="text-neutral-700">Título extraído</Label>
                      <p className="font-semibold text-neutral-900 text-lg leading-snug bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                        {extracted.title}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-neutral-700">Resumo</Label>
                      <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200 line-clamp-4">
                        {extracted.excerpt || '—'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-neutral-700">
                        Escolha a imagem de capa {extracted.images.length > 0 && `(${extracted.images.length} encontradas)`}
                      </Label>
                      {extracted.images.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">Nenhuma imagem grande encontrada. Você pode adicionar manualmente depois.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                          {extracted.images.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedCover(img)}
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                selectedCover === img
                                  ? 'border-blue-600 ring-2 ring-blue-200'
                                  : 'border-neutral-200 hover:border-blue-400'
                              }`}
                            >
                              <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                              {selectedCover === img && (
                                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-neutral-500 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Fonte: <span className="font-medium">{extracted.sourceName}</span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {extracted ? (
                  <>
                    <Button variant="outline" onClick={() => { setExtracted(null); setSelectedCover(''); }}>
                      Extrair outro link
                    </Button>
                    <Button onClick={handleApplyExtracted} className="bg-blue-600 hover:bg-blue-700">
                      Aplicar no formulário
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => resetImportDialog(false)}>
                    Cancelar
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading} className="border-neutral-300">
            Salvar Rascunho
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleSave('published')} disabled={loading}>
            Publicar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="conteudo" className="space-y-6">
        <TabsList className="bg-white border border-neutral-200">
          <TabsTrigger value="conteudo">Conteúdo Editorial</TabsTrigger>
          <TabsTrigger value="seo">SEO e Metadados</TabsTrigger>
        </TabsList>

        <TabsContent value="conteudo">
          {formData.source_link && (
            <Alert className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800 rounded-2xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Aviso de Atribuição</AlertTitle>
              <AlertDescription>
                Esta notícia está sendo criada com base em uma fonte externa: <strong>{formData.source_name}</strong>.
                {formData.source_link && (
                  <> (<a href={formData.source_link} target="_blank" rel="noopener noreferrer" className="underline">ver original</a>)</>
                )}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
                <div className="space-y-2">
                  <Label className="text-neutral-700">Título da Manchete</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '')})} className="bg-white border-neutral-200 font-bold focus:border-red-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-700">Slug (URL)</Label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-white border-neutral-200 text-xs focus:border-red-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-700">Resumo</Label>
                  <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="bg-white border-neutral-200 h-24 focus:border-red-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-700">Conteúdo da Notícia</Label>
                  <p className="text-[11px] text-neutral-400 mb-1">Use o ícone de imagem na barra do editor para inserir foto no meio do texto (por link ou upload).</p>
                  <RichTextEditor 
                    content={formData.content} 
                    onChange={content => setFormData({...formData, content})} 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-6">
                <div className="space-y-2">
                  <Label className="text-neutral-700">Imagem Destacada (Capa)</Label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 group">
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
                      <Label htmlFor="img-upload" className="flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-xl p-4 hover:bg-neutral-50 transition-colors cursor-pointer text-[10px] font-black uppercase tracking-widest gap-2 text-neutral-600">
                        <Upload className="w-4 h-4 text-red-600" />
                        {uploading ? 'Enviando...' : 'Upload'}
                        <Input id="img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </Label>
                      
                      <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                        <DialogTrigger asChild>
                          <button className="flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-xl p-4 hover:bg-neutral-50 transition-colors text-[10px] font-black uppercase tracking-widest gap-2 text-neutral-600">
                            <ImageIcon className="w-4 h-4 text-red-600" />
                            Biblioteca
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-neutral-200 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Biblioteca de Mídias</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                            {mediaFiles?.map(file => {
                              const url = supabase.storage.from('news-media-private').getPublicUrl(`featured/${file.name}`).data.publicUrl;
                              return (
                                <div 
                                  key={file.id} 
                                  className="aspect-square rounded-lg overflow-hidden border border-neutral-200 hover:border-red-500 transition-all cursor-pointer relative group"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, image_url: url, og_image_url: url }));
                                    setShowMediaLibrary(false);
                                  }}
                                >
                                  <img src={url} alt={file.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input 
                          placeholder="https://..." 
                          value={formData.image_url.startsWith('data:') ? '' : formData.image_url} 
                          onChange={e => setFormData({...formData, image_url: e.target.value, og_image_url: e.target.value})} 
                          className="bg-white border-neutral-200 pl-10 focus:border-red-400 text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-700">Categoria</Label>
                  <select className="w-full bg-white border border-neutral-200 rounded-xl p-2 focus:border-red-400 text-neutral-800" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Selecionar Categoria</option>
                    {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-700">Cidade</Label>
                  <select className="w-full bg-white border border-neutral-200 rounded-xl p-2 focus:border-red-400 text-neutral-800" value={formData.city_id} onChange={e => setFormData({...formData, city_id: e.target.value})}>
                    <option value="">Selecionar Cidade</option>
                    {cities?.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-700">Autor</Label>
                  <select className="w-full bg-white border border-neutral-200 rounded-xl p-2 focus:border-red-400 text-neutral-800" value={formData.author_id || ''} onChange={e => setFormData({...formData, author_id: e.target.value || null})}>
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
                    className="w-4 h-4 rounded border-neutral-300 text-red-600"
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer text-neutral-700">Notícia em Destaque</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_urgent" 
                    checked={formData.is_urgent} 
                    onChange={e => setFormData({...formData, is_urgent: e.target.checked})}
                    className="w-4 h-4 rounded border-neutral-300 text-red-600"
                  />
                  <Label htmlFor="is_urgent" className="cursor-pointer text-red-600 font-bold">Plantão Urgente</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-red-600"><Search className="w-4 h-4" /> Otimização para Google</h3>
              <div className="space-y-2">
                <Label className="text-neutral-700">Meta Title (Max 60 caracteres)</Label>
                <Input value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="bg-white border-neutral-200 focus:border-red-400" maxLength={60} />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Meta Description (Max 160 caracteres)</Label>
                <Textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="bg-white border-neutral-200 focus:border-red-400" maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Canonical URL</Label>
                <Input value={formData.canonical_url} onChange={e => setFormData({...formData, canonical_url: e.target.value})} className="bg-white border-neutral-200 focus:border-red-400" placeholder="https://seusite.com/noticia/exemplo" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-blue-600"><Share2 className="w-4 h-4" /> Social Graph (Facebook/Twitter)</h3>
              <div className="space-y-2">
                <Label className="text-neutral-700">Imagem de Compartilhamento (OG Image)</Label>
                <Input value={formData.og_image_url.startsWith('data:') ? '' : formData.og_image_url} onChange={e => setFormData({...formData, og_image_url: e.target.value})} className="bg-white border-neutral-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Robots Meta</Label>
                <select className="w-full bg-white border border-neutral-200 rounded-xl p-2 focus:border-red-400 text-neutral-800" value={formData.robots_meta} onChange={e => setFormData({...formData, robots_meta: e.target.value})}>
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
