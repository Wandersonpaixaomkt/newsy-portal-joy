import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Megaphone, Calendar, Tag, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminCard } from '@/components/admin/AdminCard';

export const Route = createFileRoute('/admin/publicidade/')({
  component: PublicidadeList,
});

function PublicidadeList() {
  const { data: ads, refetch } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select(`
          *,
          advertiser:advertisers(name),
          creatives:ad_creatives(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publicidade</h1>
          <p className="text-neutral-400">Gerencie campanhas e anúncios.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard title="Ativas" icon={Megaphone}>
          <div className="text-3xl font-black text-primary">
            {ads?.filter(a => a.status === 'active').length || 0}
          </div>
        </AdminCard>
        {/* Ad stats cards could go here */}
      </div>

      <div className="bg-brand-dark rounded-2xl border border-white/5 overflow-hidden shadow-premium">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Campanha</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Anunciante</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Período</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ads?.map(ad => (
              <tr key={ad.id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="font-medium">{ad.name}</div>
                  <div className="text-xs text-neutral-500">{ad.creatives?.length || 0} criativos</div>
                </td>
                <td className="px-6 py-4 text-neutral-300">
                  {ad.advertiser?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : '-'} a {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={ad.status === 'active' ? 'default' : 'secondary'} className={ad.status === 'active' ? 'bg-primary' : 'bg-white/5 text-neutral-400 border-transparent'}>
                    {ad.status === 'active' ? 'Ativa' : 'Pausada'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
