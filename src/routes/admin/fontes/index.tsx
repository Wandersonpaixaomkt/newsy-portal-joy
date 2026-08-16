import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { ExternalLink, Trash2, Edit } from 'lucide-react';

export const Route = createFileRoute('/admin/fontes/')({
  component: FontesList,
});

function FontesList() {
  const { data: feeds } = useQuery({
    queryKey: ['admin-feeds'],
    queryFn: async () => {
      // Tabela posts usada como proxy para fontes externas por enquanto
      const { data, error } = await supabase.from('posts').select('*').limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fontes Externas</h1>
          <p className="text-neutral-400">Gerencie integração com feeds RSS e parceiros.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Nova Fonte</Button>
      </div>

      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-8 text-center">
        <ExternalLink className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
        <h3 className="text-xl font-bold text-neutral-300">Integração RSS/Atom</h3>
        <p className="text-neutral-500 max-w-md mx-auto mt-2">
          Configure raspagem automática de notícias de portais parceiros e agências de notícias.
        </p>
        <Button variant="outline" className="mt-6 border-neutral-700">Explorar Documentação</Button>
      </div>
    </div>
  );
}
