import { Search, Menu, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Ícones personalizados SVG para redes sociais
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function MainHeader() {
  const categories = [
    { name: "Últimas notícias", slug: "" },
    { name: "Parauapebas", slug: "parauapebas" },
    { name: "Canaã dos Carajás", slug: "canaa-dos-carajas" },
    { name: "Curionópolis", slug: "curionopolis" },
    { name: "Marabá", slug: "maraba" },
    { name: "Pará", slug: "para" },
    { name: "Política", slug: "politica" },
    { name: "Esportes", slug: "esportes" },
    { name: "Brasil", slug: "brasil" },
    { name: "Tech & Business", slug: "tech-business" }
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
            <a href="#" className="hover:text-primary transition-colors"><InstagramIcon /></a>
            <a href="#" className="hover:text-primary transition-colors"><FacebookIcon /></a>
            <a href="#" className="hover:text-primary transition-colors"><YoutubeIcon /></a>
            <a href="#" className="hover:text-primary transition-colors"><XIcon /></a>
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
