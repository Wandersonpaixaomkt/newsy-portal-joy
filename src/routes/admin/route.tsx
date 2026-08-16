import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/admin/login' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      <aside className="w-64 border-r border-neutral-800 p-4">
        <h2 className="text-xl font-bold text-red-600 mb-8">Norte em Foco</h2>
        <nav className="space-y-2">
          {/* Sidebar items */}
          <a href="/admin" className="block p-2 hover:bg-neutral-800 rounded">Dashboard</a>
          <a href="/admin/noticias" className="block p-2 hover:bg-neutral-800 rounded">Notícias</a>
          <a href="/admin/categorias" className="block p-2 hover:bg-neutral-800 rounded">Categorias</a>
          <a href="/admin/tags" className="block p-2 hover:bg-neutral-800 rounded">Tags</a>
          <a href="/admin/autores" className="block p-2 hover:bg-neutral-800 rounded">Autores</a>
          <a href="/admin/publicidade" className="block p-2 hover:bg-neutral-800 rounded">Publicidade</a>
          <a href="/" className="block p-2 hover:bg-neutral-800 rounded text-neutral-400 mt-8 border-t border-neutral-800 pt-4">Ver Site</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
