import { createFileRoute, Outlet, Link, useNavigate, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tag, 
  Users, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Megaphone, 
  BarChart3, 
  UserCog, 
  Settings, 
  LogOut,
  ExternalLink,
  ChevronLeft,
  Menu,
  AlertTriangle,
  Search
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ENV } from '@/lib/env';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (!ENV.ADMIN_AUTH_ENABLED) {
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && location.pathname !== '/admin/login') {
      throw redirect({
        to: '/admin/login',
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada');
    navigate({ to: '/admin/login' });
  };

  const navItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/admin' as const },
    { label: 'Notícias', icon: FileText, to: '/admin/noticias' as const },
    { label: 'Categorias', icon: FolderTree, to: '/admin/categorias' as const },
    { label: 'Tags', icon: Tag, to: '/admin/tags' as const },
    { label: 'Autores', icon: Users, to: '/admin/autores' as const },
    { label: 'Biblioteca de Mídia', icon: ImageIcon, to: '/admin/midias' as const },
    { label: 'Fontes', icon: LinkIcon, to: '/admin/fontes' as const },
    { label: 'Publicidade', icon: Megaphone, to: '/admin/publicidade' as const },
    { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' as const },
    { label: 'SEO', icon: Search, to: '/admin/seo' as const },
    { label: 'Usuários', icon: UserCog, to: '/admin/usuarios' as const },

    { label: 'Configurações', icon: Settings, to: '/admin/configuracoes' as const },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-neutral-200 flex overflow-hidden">
      {/* Sidebar para Desktop */}
      <aside className={`hidden lg:flex flex-col border-r border-white/5 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center justify-between">
          {!isSidebarCollapsed && <h1 className="text-xl font-black text-primary tracking-tighter uppercase italic">Norte em Foco</h1>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hover:bg-white/5">
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              activeProps={{ className: 'bg-primary/10 text-primary border-primary/20' }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-1">
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 text-sm">
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Visualizar Portal</span>}
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-950/20 transition-colors text-red-500 text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
          {!ENV.ADMIN_AUTH_ENABLED ? (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-yellow-500 text-[10px] uppercase tracking-widest font-bold">
              <AlertTriangle size={14} /> <span>Atenção: Painel em modo aberto (Sem Login)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-green-500 text-[10px] uppercase tracking-widest font-bold">
              <span>Autenticação Ativa</span>
            </div>
          )}
          <h1 className="hidden lg:block text-lg font-black text-primary uppercase italic">Norte em Foco</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
