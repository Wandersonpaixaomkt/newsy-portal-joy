import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Megaphone, Calendar, Trash2, Edit, ExternalLink, Filter, CheckCircle2, Layout, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminCard } from '@/components/admin/AdminCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { format } from 'date-fns';
import imageCompression from 'browser-image-compression';

export const Route = createFileRoute('/admin/publicidade/')({
  component: PublicidadeList,
});

function PublicidadeList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    advertiser_id: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [creativeData, setCreativeData] = useState({
    image_url: '',
    target_url: '',
    slot_id: '',
    alt_text: '',
    device: 'all',
  });

  const { data: ads, refetch } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select(`
          *,
          advertiser:advertisers(name),
          creatives:ad_creatives(*, slot:ad_slots(name))
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: advertisers } = useQuery({
    queryKey: ['admin-advertisers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('advertisers').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: slots } = useQuery({
    queryKey: ['admin-slots'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ad_slots').select('*').order('name');
      if (error) throw error;
      return data;
    },
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
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 2560, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const fileExt = file.name.split('.').pop();
      const fileName = `ads/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('news-media-private').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('news-media-private').getPublicUrl(fileName);
      setCreativeData(prev => ({ ...prev, image_url: data.publicUrl }));
      toast.success('Banner carregado!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !creativeData.image_url || !creativeData.slot_id) {
      toast.error('Preencha os campos obrigatórios (Nome, Banner, Posição)');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('ad_campaigns')
        .insert([{
          name: formData.name,
          advertiser_id: formData.advertiser_id || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          status: formData.status,
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Create Creative
      const { error: creativeError } = await supabase
        .from('ad_creatives')
        .insert([{
          campaign_id: campaign.id,
          image_url: creativeData.image_url,
          target_url: creativeData.target_url || null,
          slot_id: creativeData.slot_id,
          alt_text: creativeData.alt_text || formData.name,
          device: creativeData.device,
        }]);

      if (creativeError) throw creativeError;

      toast.success('Campanha criada com sucesso!');
      setIsModalOpen(false);
      refetch();
      // Reset form
      setFormData({ name: '', advertiser_id: '', start_date: '', end_date: '', status: 'active' });
      setCreativeData({ image_url: '', target_url: '', slot_id: '', alt_text: '', device: 'all' });
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta campanha?')) return;
    try {
      const { error } = await supabase.from('ad_campaigns').delete().eq('id', id);
      if (error) throw error;
      toast.success('Campanha excluída');
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publicidade</h1>
          <p className="text-neutral-400">Gerencie campanhas e espaços publicitários.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 h-12 px-6 rounded-xl font-bold shadow-lg shadow-red-600/20">
              <Plus className="w-5 h-5 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-brand-dark border-white/10 max-w-2xl text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Configurar Nova Campanha</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Campanha *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Campanha de Natal"
                    className="bg-brand-dark border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Anunciante</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-sm focus:border-primary/50"
                    value={formData.advertiser_id}
                    onChange={e => setFormData({...formData, advertiser_id: e.target.value})}
                  >
                    <option value="">Selecionar Anunciante</option>
                    {advertisers?.map(adv => <option key={adv.id} value={adv.id}>{adv.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 p-4 border border-white/5 rounded-2xl bg-white/5">
                <Label className="text-red-500 font-bold flex items-center gap-2"><Layout className="w-4 h-4" /> Arte do Banner</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label htmlFor="ad-upload" className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl p-6 hover:bg-white/5 transition-colors cursor-pointer gap-2 group">
                      <Upload className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-widest">{uploading ? 'Carregando...' : 'Upload da Arte'}</span>
                      <Input id="ad-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </Label>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-neutral-500 uppercase">Ou URL externa:</Label>
                      <Input 
                        value={creativeData.image_url} 
                        onChange={e => setCreativeData({...creativeData, image_url: e.target.value})}
                        placeholder="https://..."
                        className="bg-brand-dark border-white/10 h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="aspect-video bg-black/40 rounded-xl border border-white/5 overflow-hidden relative group">
                    {creativeData.image_url ? (
                      <img src={creativeData.image_url} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                        Prévia do Banner
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Posição (Slot) *</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-sm focus:border-primary/50"
                    value={creativeData.slot_id}
                    onChange={e => setCreativeData({...creativeData, slot_id: e.target.value})}
                  >
                    <option value="">Escolher Posição</option>
                    {slots?.map(slot => <option key={slot.id} value={slot.id}>{slot.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Link de Destino</Label>
                  <Input 
                    value={creativeData.target_url} 
                    onChange={e => setCreativeData({...creativeData, target_url: e.target.value})}
                    placeholder="https://..."
                    className="bg-brand-dark border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Input 
                    type="date"
                    value={formData.start_date} 
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    className="bg-brand-dark border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Input 
                    type="date"
                    value={formData.end_date} 
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                    className="bg-brand-dark border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-sm focus:border-primary/50"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold px-8" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Campanha'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard title="Campanhas Ativas" icon={Megaphone}>
          <div className="text-4xl font-black text-primary">
            {ads?.filter(a => a.status === 'active').length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Cliques Totais (Hoje)" icon={CheckCircle2}>
          <div className="text-4xl font-black text-blue-500">0</div>
        </AdminCard>
      </div>

      <div className="bg-brand-dark rounded-2xl border border-white/5 overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Campanha / Banner</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Posição</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Anunciante</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Período</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ads?.map(ad => (
                <tr key={ad.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-md overflow-hidden bg-black border border-white/10 shrink-0">
                        {ad.creatives?.[0]?.image_url ? (
                          <img src={ad.creatives[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Megaphone className="w-4 h-4 text-neutral-700" /></div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-200">{ad.name}</div>
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                          <ExternalLink className="w-2 h-2" />
                          {ad.creatives?.[0]?.target_url?.replace('https://', '') || 'Sem link'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-white/10 text-neutral-400 font-mono text-[10px]">
                      {ad.creatives?.[0]?.slot?.name || 'Não definida'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-300 text-sm">
                    {ad.advertiser?.name || '---'}
                  </td>
                  <td className="px-6 py-4 text-[10px] text-neutral-400 font-mono">
                    <div className="flex flex-col">
                      <span>INÍCIO: {ad.start_date ? format(new Date(ad.start_date), 'dd/MM/yyyy') : 'IMEDIATO'}</span>
                      <span>FIM: {ad.end_date ? format(new Date(ad.end_date), 'dd/MM/yyyy') : 'INDETERMINADO'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={ad.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
                      {ad.status === 'active' ? 'ATIVA' : 'INATIVA'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {ads?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-neutral-500">
                    Nenhuma campanha cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
