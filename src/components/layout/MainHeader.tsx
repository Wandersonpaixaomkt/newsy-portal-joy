import logoAsset from "@/assets/logo.png.asset.json";
import { Search, Menu, Phone } from "lucide-react";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="lg:hidden text-foreground hover:text-primary transition-colors">
            <Menu size={28} />
          </button>
          <img 
            src={logoAsset.url} 
            alt="Orange News Carajás" 
            className="h-12 w-auto object-contain"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2 w-96">
            <Search className="text-gray-400" size={18} />
            <input type="text" placeholder="Buscar notícias..." className="bg-transparent w-full text-sm font-medium outline-none" />
        </div>

        <button className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-black text-xs transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
          <Phone size={16} /> ENVIE SUA PAUTA
        </button>
      </div>
    </header>
  );
}
