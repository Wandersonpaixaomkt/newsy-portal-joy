import { Search, Menu, Instagram, Facebook, Youtube, X, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function MainHeader() {
  const categories = [
    { name: "Últimas notícias", slug: "" },
    { name: "Parauapebas", slug: "parauapebas" },
    { name: "Canaã dos Carajás", slug: "canaa-dos-carajas" },
    { name: "Curionópolis", slug: "curionopolis" },
    { name: "Eldorado do Carajás", slug: "eldorado" },
    { name: "Marabá", slug: "maraba" },
    { name: "Pará", slug: "para" },
    { name: "Política", slug: "politica" },
    { name: "Esportes", slug: "esportes" },
    { name: "Polícia", slug: "policia" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-dark shadow-2xl">
      {/* Top Main Row */}
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-primary transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5" aria-label="Menu">
            <Menu size={24} />
          </button>
          <button className="text-white hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="Search">
            <Search size={24} />
          </button>
        </div>

        <Link to="/" className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-none">
            Norte<span className="text-primary">em</span>Foco
          </span>
          <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase leading-none mt-1">
            Portal de Notícias
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-white/60 mr-4">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><X size={16} /></a>
          </div>
          <button className="bg-primary text-white px-4 md:px-6 py-2 rounded-full font-black text-[10px] md:text-xs transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap tracking-wider">
            <Send size={14} className="inline mr-2" /> <span className="hidden sm:inline">Envie sua Pauta</span><span className="sm:hidden">Pauta</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-row */}
      <nav className="bg-brand-dark/50 backdrop-blur-sm border-b border-white/5 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.2em] overflow-x-auto py-3 no-scrollbar">
            {categories.map(cat => (
              <Link 
                key={cat.slug} 
                to={cat.slug === "" ? "/" : (cat.slug as any)}
                className="whitespace-nowrap hover:text-primary transition-all relative group py-1 shrink-0"
              >
                {cat.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

