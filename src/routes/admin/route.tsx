import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router';
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
  Menu
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
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
    { label: 'Usuários', icon: UserCog, to: '/admin/usuarios' as const },
    { label: 'Configurações', icon: Settings, to: '/admin/configuracoes' as const },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 flex overflow-hidden">
      {/* Sidebar para Desktop */}
      <aside className={`hidden lg:flex flex-col border-r border-neutral-800 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center justify-between">
          {!isSidebarCollapsed && <h1 className="text-xl font-black text-red-600 tracking-tighter uppercase italic">Norte em Foco</h1>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hover:bg-neutral-800">
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              activeProps={{ className: 'bg-red-600/10 text-red-500 border-red-600/20' }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors border border-transparent"
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
        <header className="h-16 border-b border-neutral-800 bg-[#0f0f0f]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 lg:hidden">
          <h1 className="text-lg font-black text-red-600 uppercase italic">Norte em Foco</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
