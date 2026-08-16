import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/configuracoes/')({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      // In a real app, this would query a settings table
      return {
        siteName: 'Norte em Foco',
        siteDescription: 'A região em pauta. A notícia em movimento.',
        maintenanceMode: false,
        allowComments: true,
      };
    },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-neutral-400">Gerencie as preferências globais do portal.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
          <h3 className="font-semibold text-red-500 uppercase text-xs tracking-widest">Geral</h3>
          
          <div className="space-y-2">
            <Label>Nome do Portal</Label>
            <Input defaultValue={settings?.siteName} className="bg-neutral-900" />
          </div>

          <div className="space-y-2">
            <Label>Descrição / Slogan</Label>
            <Input defaultValue={settings?.siteDescription} className="bg-neutral-900" />
          </div>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
          <h3 className="font-semibold text-red-500 uppercase text-xs tracking-widest">Segurança & Moderação</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Modo Manutenção</Label>
              <p className="text-sm text-neutral-500">Desativa o acesso público ao portal.</p>
            </div>
            <Switch checked={settings?.maintenanceMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Permitir Comentários</Label>
              <p className="text-sm text-neutral-500">Habilita a seção de comentários nas notícias.</p>
            </div>
            <Switch checked={settings?.allowComments} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => toast.success('Configurações salvas!')}>
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
