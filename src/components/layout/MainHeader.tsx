import { Search, Menu, Phone, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-black/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button className="text-white hover:text-primary transition-colors p-2 -ml-2">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-none">
                Norte<span className="text-primary">em</span>Foco
              </span>
              <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase leading-none mt-1">
                Portal de Notícias
              </span>
            </div>
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-3 bg-white/5 rounded-full px-5 py-2.5 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-white/5">
            <Search className="text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar notícias..." 
              className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-white/20 text-white" 
            />
        </div>

        <div className="flex items-center gap-3">
          <button className="lg:hidden text-white hover:text-primary transition-colors p-2">
            <Search size={22} />
          </button>
          <div className="hidden md:flex items-center gap-2 mr-2">
             <Link to="/" className="text-white/40 hover:text-white transition-colors p-2">
                <User size={20} />
             </Link>
          </div>
          <button className="bg-primary text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-xs transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap tracking-wider">
            <Phone size={14} className="inline mr-2" /> <span className="hidden sm:inline">Envie sua Pauta</span><span className="sm:hidden">Pauta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
