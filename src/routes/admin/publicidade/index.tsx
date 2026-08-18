import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Megaphone, Trash2, ExternalLink, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ENV } from '@/lib/env';
import { getLocalAds, saveLocalAd, deleteLocalAd, generateAdId, type LocalAd } from '@/lib/local-ads';

export const Route = createFileRoute('/admin/publicidade/')({
  component: PublicidadeList,
});

const SLOTS = [
  { value: 'topo', label: 'Banner Topo' },
  { value: 'lateral', label: 'Lateral (1:1)' },
  { value: 'rodape', label: 'Rodapé' },
  { value: 'entre-noticias', label: 'Entre Notícias' },
] as const;

function PublicidadeList() {
  const [ads, setAds] = useState<LocalAd[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    image_url: '',
    target_url: '',
    slot: 'topo' as LocalAd['slot'],
    status: 'active' as LocalAd['status'],
  });

  useEffect(() => {
    setAds(getLocalAds());
  }, []);

  const refresh = () => setAds(getLocalAds());

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx. 1,5 MB). Use um link externo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image_url: reader.result as string }));
      toast.success('Banner carregado');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.image_url) {
      toast.error('Preencha nome e imagem do banner');
      return;
    }
    setLoading(true);
    try {
      saveLocalAd({
        id: generateAdId(),
        name: form.name,
        image_url: form.image_url,
        target_url: form.target_url || '',
        slot: form.slot,
        status: form.status,
        created_at: new Date().toISOString(),
      });
      toast.success('Banner salvo (modo local)!');
      setIsModalOpen(false);
      setForm({ name: '', image_url: '', target_url: '', slot: 'topo', status: 'active' });
      refresh();
    } catch {
      toast.error('Erro ao salvar banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este banner?')) return;
    deleteLocalAd(id);
    toast.success('Banner excluído');
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Publicidade</h1>
          <p className="text-neutral-500">
            Gerencie banners do portal.
            {ENV.USE_LOCAL_ADMIN_MOCK && (
              <span className="ml-2 text-amber-600 text-sm">(modo local)</span>
            )}
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 h-11 px-5 rounded-xl font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-neutral-200 max-w-lg text-neutral-900">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Novo Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Banner Topo Agosto"
                  className="bg-white border-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem do Banner *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Label
                    htmlFor="ad-file"
                    className="flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-xl p-5 hover:bg-neutral-50 cursor-pointer gap-2"
                  >
                    <Upload className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-bold uppercase">Upload</span>
                    <Input id="ad-file" type="file" className="hidden" accept="image/*" onChange={handleFile} />
                  </Label>
                  <div className="aspect-video bg-neutral-100 rounded-xl border border-neutral-200 overflow-hidden flex items-center justify-center">
                    {form.image_url ? (
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-neutral-400 uppercase font-bold">Prévia</span>
                    )}
                  </div>
                </div>
                <Input
                  value={form.image_url.startsWith('data:') ? '' : form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="Ou cole o link da imagem (https://...)"
                  className="bg-white border-neutral-200 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>Posição</Label>
                <select
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-sm bg-white"
                  value={form.slot}
                  onChange={(e) => setForm({ ...form, slot: e.target.value as LocalAd['slot'] })}
                >
                  {SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Link de destino</Label>
                <Input
                  value={form.target_url}
                  onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white border-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-sm bg-white"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as LocalAd['status'] })}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Banner'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <div className="text-sm text-neutral-500 mb-1">Banners ativos</div>
          <div className="text-3xl font-black text-red-600">
            {ads.filter((a) => a.status === 'active').length}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <div className="text-sm text-neutral-500 mb-1">Total</div>
          <div className="text-3xl font-black text-neutral-800">{ads.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Banner</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Posição</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Status</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {ads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-neutral-400">
                  Nenhum banner cadastrado. Clique em "Novo Banner".
                </td>
              </tr>
            )}
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-neutral-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                      <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-800">{ad.name}</div>
                      {ad.target_url && (
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {ad.target_url.replace(/^https?:\/\//, '').slice(0, 40)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="outline" className="border-neutral-200 text-neutral-600 text-[10px]">
                    {SLOTS.find((s) => s.value === ad.slot)?.label || ad.slot}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge className={ad.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}>
                    {ad.status === 'active' ? 'ATIVA' : 'INATIVA'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(ad.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-400">
        Os banners ficam salvos no navegador (modo local). Depois que o Supabase estiver estável, migraremos para o banco.
      </p>
    </div>
  );
}
