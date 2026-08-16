import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Plus, User, Mail, Shield } from 'lucide-react';

export const Route = createFileRoute('/admin/usuarios/')({
  component: UsuariosList,
});

function UsuariosList() {
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-neutral-400">Gerencie a equipe e permissões.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios?.map((user) => (
          <div key={user.id} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 flex items-start gap-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-red-500">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name || ''} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{user.full_name || 'Usuário Sem Nome'}</h3>
              <div className="flex items-center text-xs text-neutral-400 mt-1 gap-2">
                <Shield className="w-3 h-3" />
                <span className="uppercase">{user.role}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="bg-neutral-900 border-neutral-700 text-xs">
                  Editar Perfil
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
