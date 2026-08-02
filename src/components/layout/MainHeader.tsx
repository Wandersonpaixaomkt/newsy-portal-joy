import logoAsset from "@/assets/logo.png.asset.json";
import { Search, Menu, Phone } from "lucide-react";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-foreground hover:text-primary transition-colors p-2 -ml-2">
            <Menu size={24} />
          </button>
          <img 
            src={logoAsset.url} 
            alt="Orange News Carajás" 
            className="h-8 md:h-12 w-auto object-contain"
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-3 bg-muted/50 rounded-full px-5 py-2.5 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="O que você procura hoje?" 
              className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-muted-foreground/60" 
            />
        </div>

        <div className="flex items-center gap-2">
          <button className="lg:hidden text-foreground hover:text-primary transition-colors p-2">
            <Search size={22} />
          </button>
          <button className="bg-primary text-primary-foreground px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-xs transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap">
            <Phone size={14} className="inline mr-2" /> <span className="hidden sm:inline">ENVIE SUA PAUTA</span><span className="sm:hidden">PAUTA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
