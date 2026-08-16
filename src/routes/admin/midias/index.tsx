import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, File, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/admin/midias/')({
  component: MediaLibrary,
});

function MediaLibrary() {
  const [uploading, setUploading] = useState(false);
  
  const { data: media, refetch } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      // Nota: Estamos usando news-media-private, mas para listar arquivos, 
      // precisamos do bucket correto. Se não houver bucket público, 
      // precisaremos gerar URLs assinadas.
      const { data, error } = await supabase.storage.from('news-media-private').list();
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('news-media-private')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast.success('Upload concluído!');
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('news-media-private').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Mídia</h1>
          <p className="text-neutral-400">Gerencie imagens e documentos.</p>
        </div>
        <div>
          <Label htmlFor="media-upload" className="cursor-pointer">
            <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium">
              <Upload className="w-4 h-4" />
              Upload de Mídia
            </div>
            <Input 
              id="media-upload" 
              type="file" 
              className="hidden" 
              onChange={handleUpload} 
              disabled={uploading}
              accept="image/*"
            />
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media?.map(item => {
          const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name);
          const url = getPublicUrl(item.name);

          return (
            <div key={item.id} className="group relative aspect-square bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden hover:border-red-500 transition-colors">
              {isImage ? (
                <img 
                  src={url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/262626/white?text=Erro+Carregamento';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  <File className="w-12 h-12" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <span className="text-[10px] text-white truncate w-full text-center">{item.name}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-red-600"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-red-600"
                    onClick={async () => {
                      if (confirm('Deseja excluir este arquivo?')) {
                        await supabase.storage.from('news-media-private').remove([item.name]);
                        refetch();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  className="mt-2 text-[10px] h-6 bg-white text-black hover:bg-neutral-200"
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success('URL copiada!');
                  }}
                >
                  Copiar Link
                </Button>
              </div>
            </div>
          );
        })}

        {media?.length === 0 && (
          <div className="col-span-full py-20 text-center text-neutral-500 bg-neutral-800/50 rounded-lg border border-dashed border-neutral-700">
            Nenhum arquivo encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
