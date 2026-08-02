import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";
import { Newspaper, TrendingUp, Radio, MapPin, ChevronRight, Search, Menu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const categories = ["Parauapebas", "Canaã dos Carajás", "Marabá", "Curionópolis", "Eldorado"];
  
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header Area */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between gap-4">
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
            
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-brand-black uppercase tracking-wider">
              {categories.map(cat => (
                <a key={cat} href="#" className="hover:text-primary transition-colors">{cat}</a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-foreground hover:text-primary transition-colors">
                <Search size={24} />
              </button>
              <button className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-black text-xs transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
                ASSINE JÁ
              </button>

            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {/* Urgent Alert Banner */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 bg-brand-black text-white p-5 rounded-2xl flex items-center justify-between gap-6 overflow-hidden border-l-8 border-primary shadow-xl shadow-brand-black/10"
        >
          <div className="flex items-center gap-4 shrink-0">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 animate-pulse tracking-widest">
              <Radio size={14} /> Ao Vivo
            </span>
            <span className="font-black text-sm md:text-base uppercase tracking-widest text-primary/90">Plantão:</span>
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <p className="text-sm md:text-lg font-bold truncate italic tracking-tight">
              Vale anuncia expansão histórica em Carajás com foco em sustentabilidade.
            </p>
          </div>
          <button className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all font-black text-xs flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
            ASSISTIR <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20"
        >
          <div className="lg:col-span-8 group cursor-pointer">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
              <img 
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop" 
                alt="Manchete Principal" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  URGENTE
                </span>
                <span className="bg-brand-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                  ECONOMIA
                </span>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-[1.05] text-brand-black group-hover:text-primary transition-colors tracking-tighter">
              Vale anuncia expansão histórica em Carajás com foco em sustentabilidade e novos empregos.
            </h2>

            <p className="text-lg text-muted-foreground mb-4 line-clamp-3">
              O projeto prevê a geração de mais de 5 mil postos de trabalho diretos na região e um investimento bilionário que deve impulsionar o PIB do Pará nos próximos anos. Confira os detalhes do plano estratégico.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-brand-black/60">
              <span className="flex items-center gap-1"><MapPin size={16} className="text-primary" /> Parauapebas, PA</span>
              <span>•</span>
              <span>HÁ 2 HORAS</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-black mb-6 uppercase tracking-tight">
                <TrendingUp size={24} className="text-primary" /> Mais Lidas
              </h3>
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <span className="text-4xl font-black text-primary/30 group-hover:text-primary transition-colors">0{i}</span>
                    <div>
                      <h4 className="font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                        Prefeitura de Canaã abre inscrições para concurso público com salários de até R$ 12 mil.
                      </h4>
                      <span className="text-xs font-bold text-muted-foreground uppercase">EDUCAÇÃO</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* News Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-border">
            <h3 className="text-3xl font-black uppercase tracking-tighter italic text-brand-black">Últimas Notícias</h3>
            <a href="#" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              VER TODAS <ChevronRight size={18} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Obras no novo aeroporto regional avançam e entrega é antecipada.",
                cat: "INFRAESTRUTURA",
                img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2070&auto=format&fit=crop",
                location: "Parauapebas",
                time: "Há 5 horas"
              },
              {
                title: "Festival Gastronômico de Marabá espera recorde de público este ano.",
                cat: "CULTURA",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
                location: "Marabá",
                time: "Há 3 horas"
              },
              {
                title: "Startups regionais ganham destaque em evento nacional de tecnologia.",
                cat: "TECNOLOGIA",
                img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
                location: "Canaã",
                time: "Há 8 horas"
              }
            ].map((post, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {post.cat}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors flex-1 line-clamp-3">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground pt-4 border-t border-border/50">
                    <span className="flex items-center gap-1 uppercase tracking-wider"><MapPin size={14} className="text-primary/70" /> {post.location}</span>
                    <span className="opacity-30">•</span>
                    <span className="uppercase tracking-wider">{post.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img 
                src={logoAsset.url} 
                alt="Orange News" 
                className="h-10 w-auto mb-6 brightness-0 invert"
              />
              <p className="text-white/60 max-w-sm mb-6 font-medium leading-relaxed">
                Orange News Carajás: O seu portal definitivo de notícias sobre o Sudeste do Pará. Informação com credibilidade, agilidade e compromisso regional.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer border border-white/5">
                    <span className="text-xs font-bold">IN</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase tracking-widest text-primary text-sm">Editorias</h5>
              <ul className="flex flex-col gap-4 text-white/60 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Política</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Economia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase tracking-widest text-primary text-sm">Institucional</h5>
              <ul className="flex flex-col gap-4 text-white/60 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Anuncie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <p>© 2026 Orange News Carajás. Todos os direitos reservados.</p>
            <p className="text-primary/80">A região em pauta. A notícia em movimento.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
