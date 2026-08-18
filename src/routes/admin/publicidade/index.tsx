import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Plus, Trash2, ExternalLink, Upload, Pencil, Power, Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { ENV } from '@/lib/env';
import {
  getLocalAds, saveLocalAd, deleteLocalAd, generateAdId,
  type LocalAd, type AdSlot, type AdFormat, type AdPage,
} from '@/lib/local-ads';

export const Route = createFileRoute('/admin/publicidade/')({
  component: PublicidadeList,
});

const SLOTS: { value: AdSlot; label: string }[] = [
  { value: 'topo', label: 'Banner Topo' },
  { value: 'entre-noticias', label: 'Entre Notícias (central)' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'rodape', label: 'Rodapé' },
];

const FORMATS: { value: AdFormat; label: string }[] = [
  { value: 'full', label: 'Largura total (topo / central)' },
  { value: '1:1', label: '1:1 (quadrado)' },
  { value: '3:4', label: '3:4 (vertical)' },
];

const PAGES: { value: AdPage; label: string }[] = [
  { value: 'todas', label: 'Todas as páginas' },
  { value: 'home', label: 'Somente Home' },
  { value: 'noticia', label: 'Página de Notícia' },
  { value: 'categoria', label: 'Páginas de Categoria' },
];

const emptyForm = () => ({
  name: '',
  image_url: '',
  target_url: '',
  slot: 'topo' as AdSlot,
  format: 'full' as AdFormat,
  pages: ['todas'] as AdPage[],
  status: 'active' as 'active' | 'inactive',
  start_date: '',
  end_date: '',
  rotate: true,
});

function PublicidadeList() {
  const [ads, setAds] = useState<LocalAd[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const refresh = () => setAds(getLocalAds());

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (ad: LocalAd) => {
    setEditingId(ad.id);
    setForm({
      name: ad.name,
      image_url: ad.image_url,
      target_url: ad.target_url || '',
      slot: ad.slot,
      format: ad.format || 'full',
      pages: ad.pages?.length ? ad.pages : ['todas'],
      status: ad.status,
      start_date: ad.start_date ? ad.start_date.slice(0, 10) : '',
      end_date: ad.end_date ? ad.end_date.slice(0, 10) : '',
      rotate: ad.rotate !== false,
    });
    setIsModalOpen(true);
  };

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

  const togglePage = (page: AdPage) => {
    setForm((prev) => {
      if (page === 'todas') {
        return { ...prev, pages: ['todas'] };
      }
      let pages = prev.pages.filter((p) => p !== 'todas');
      if (pages.includes(page)) {
        pages = pages.filter((p) => p !== page);
      } else {
        pages = [...pages, page];
      }
      if (pages.length === 0) pages = ['todas'];
      return { ...prev, pages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.image_url) {
      toast.error('Preencha nome e imagem do banner');
      return;
    }
    // lateral precisa de formato 1:1 ou 3:4
    const format =
      form.slot === 'lateral'
        ? form.format === 'full'
          ? '1:1'
          : form.format
        : form.slot === 'topo' || form.slot === 'entre-noticias'
          ? 'full'
          : form.format;

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const existing = editingId ? ads.find((a) => a.id === editingId) : null;

      saveLocalAd({
        id: editingId || generateAdId(),
        name: form.name,
        image_url: form.image_url,
        target_url: form.target_url || '',
        slot: form.slot,
        format,
        pages: form.pages,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        rotate: form.rotate,
        created_at: existing?.created_at || now,
        updated_at: now,
      });

      toast.success(editingId ? 'Banner atualizado!' : 'Banner criado!');
      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm());
      refresh();
    } catch {
      toast.error('Erro ao salvar banner');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (ad: LocalAd) => {
    saveLocalAd({
      ...ad,
      status: ad.status === 'active' ? 'inactive' : 'active',
    });
    toast.success(ad.status === 'active' ? 'Banner desativado' : 'Banner ativado');
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este banner?')) return;
    deleteLocalAd(id);
    toast.success('Banner excluído');
    refresh();
  };

  const slotLabel = (s: AdSlot) => SLOTS.find((x) => x.value === s)?.label || s;
  const formatLabel = (f: AdFormat) => FORMATS.find((x) => x.value === f)?.label || f;

  const countBySlotFormat = (slot: AdSlot, format: AdFormat) =>
    ads.filter((a) => a.slot === slot && a.format === format && a.status === 'active').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Publicidade</h1>
          <p className="text-neutral-500">
            Gerencie banners, agendamento e rotação.
            {ENV.USE_LOCAL_ADMIN_MOCK && (
              <span className="ml-2 text-amber-600 text-sm">(modo local)</span>
            )}
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(o) => { setIsModalOpen(o); if (!o) setEditingId(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 h-11 px-5 rounded-xl font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-neutral-200 max-w-lg text-neutral-900 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingId ? 'Editar Banner' : 'Novo Banner'}
              </DialogTitle>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Posição *</Label>
                  <select
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-sm bg-white"
                    value={form.slot}
                    onChange={(e) => {
                      const slot = e.target.value as AdSlot;
                      setForm({
                        ...form,
                        slot,
                        format: slot === 'lateral' ? (form.format === 'full' ? '1:1' : form.format) : 'full',
                      });
                    }}
                  >
                    {SLOTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Formato</Label>
                  <select
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-sm bg-white"
                    value={form.slot === 'lateral' ? (form.format === 'full' ? '1:1' : form.format) : 'full'}
                    onChange={(e) => setForm({ ...form, format: e.target.value as AdFormat })}
                    disabled={form.slot !== 'lateral'}
                  >
                    {form.slot === 'lateral' ? (
                      <>
                        <option value="1:1">1:1 (quadrado)</option>
                        <option value="3:4">3:4 (vertical)</option>
                      </>
                    ) : (
                      <option value="full">Largura total</option>
                    )}
                  </select>
                </div>
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
                <Label className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Período no ar</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase">Início</span>
                    <Input
                      type="date"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className="bg-white border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase">Fim</span>
                    <Input
                      type="date"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className="bg-white border-neutral-200 text-sm"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">Deixe em branco para sem data limite.</p>
              </div>

              <div className="space-y-2">
                <Label>Páginas onde aparece</Label>
                <div className="flex flex-wrap gap-2">
                  {PAGES.map((p) => {
                    const active = form.pages.includes(p.value);
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => togglePage(p.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div>
                  <Label className="text-neutral-800">Participar da rotação</Label>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Se houver mais de um anúncio no mesmo local, alternam automaticamente (até 4 na tela; se tiver mais, todos se revezam com tempo igual).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.rotate}
                  onChange={(e) => setForm({ ...form, rotate: e.target.checked })}
                  className="w-5 h-5 rounded border-neutral-300 text-red-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-sm bg-white"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold" disabled={loading}>
                  {loading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar Banner'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo de slots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <div className="text-xs text-neutral-500 mb-1">Ativos</div>
          <div className="text-2xl font-black text-red-600">{ads.filter((a) => a.status === 'active').length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <div className="text-xs text-neutral-500 mb-1">Lateral 1:1 ativos</div>
          <div className="text-2xl font-black text-neutral-800">{countBySlotFormat('lateral', '1:1')}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <div className="text-xs text-neutral-500 mb-1">Lateral 3:4 ativos</div>
          <div className="text-2xl font-black text-neutral-800">{countBySlotFormat('lateral', '3:4')}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <div className="text-xs text-neutral-500 mb-1">Total</div>
          <div className="text-2xl font-black text-neutral-800">{ads.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Banner</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Posição / Formato</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Período</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500">Status</th>
              <th className="px-5 py-3 text-xs font-bold uppercase text-neutral-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {ads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-neutral-400">
                  Nenhum banner. Clique em "Novo Banner".
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
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2 flex-wrap">
                        {ad.rotate !== false && <span className="text-blue-600">rotação</span>}
                        {ad.pages?.includes('todas') ? 'todas as páginas' : ad.pages?.join(', ')}
                        {ad.target_url && (
                          <span className="flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3" />
                            {ad.target_url.replace(/^https?:\/\//, '').slice(0, 24)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-neutral-700">{slotLabel(ad.slot)}</div>
                  <div className="text-[11px] text-neutral-400">{formatLabel(ad.format || 'full')}</div>
                </td>
                <td className="px-5 py-4 text-[11px] text-neutral-500 font-mono">
                  {ad.start_date || ad.end_date ? (
                    <>
                      <div>{ad.start_date ? ad.start_date.slice(0, 10) : '—'}</div>
                      <div>até {ad.end_date ? ad.end_date.slice(0, 10) : '∞'}</div>
                    </>
                  ) : (
                    'Sem limite'
                  )}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    className={
                      ad.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }
                  >
                    {ad.status === 'active' ? 'ATIVA' : 'INATIVA'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-500 hover:text-neutral-800"
                      title="Editar"
                      onClick={() => openEdit(ad)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        ad.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-neutral-400 hover:bg-neutral-100'
                      }`}
                      title={ad.status === 'active' ? 'Desativar' : 'Ativar'}
                      onClick={() => handleToggleStatus(ad)}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      title="Excluir"
                      onClick={() => handleDelete(ad.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-neutral-400 space-y-1">
        <p>• Até <strong>4 banners</strong> do mesmo formato (ex.: 4× 1:1 ou 4× 3:4) alternam na tela.</p>
        <p>• Se houver mais de 4 no mesmo local/formato, todos se revezam com o mesmo tempo de exposição.</p>
        <p>• Rotação a cada ~6 segundos. Dados salvos no navegador (modo local).</p>
      </div>
    </div>
  );
}
