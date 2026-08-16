import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/autores/')({
  component: AutoresList,
});

function AutoresList() {
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newBio, setNewBio] = useState('');

  const { data: autores, refetch } = useQuery({
    queryKey: ['admin-autores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('authors').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('authors').insert([{ 
        name: newName, 
        slug: newSlug,
        bio: newBio
      }]);
      if (error) throw error;
      toast.success('Autor adicionado!');
      setNewName('');
      setNewSlug('');
      setNewBio('');
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Autores</h1>
        <p className="text-neutral-400">Gerencie os colunistas e redatores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
            <h3 className="font-semibold mb-2 text-red-500 uppercase text-xs tracking-widest">Novo Autor</h3>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input 
                value={newName} 
                onChange={e => {
                  setNewName(e.target.value);
                  setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                className="bg-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={newSlug} onChange={e => setNewSlug(e.target.value)} className="bg-neutral-900" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input value={newBio} onChange={e => setNewBio(e.target.value)} className="bg-neutral-900" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Adicionar Autor</Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-900 border-b border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Nome</th>
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Slug</th>
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {autores?.map(autor => (
                  <tr key={autor.id}>
                    <td className="px-6 py-4 font-medium">{autor.name}</td>
                    <td className="px-6 py-4 text-neutral-400">{autor.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">Editar</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Desativar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
