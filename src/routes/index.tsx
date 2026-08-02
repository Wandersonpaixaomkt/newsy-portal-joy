import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/layout/TopBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { NewsGrid } from "@/components/layout/NewsGrid";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Radio, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const latestNews = [
    {
      title: "Canaã dos Carajás anuncia festival de gastronomia com atrações nacionais.",
      cat: "CULTURA",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
      location: "Canaã",
      time: "Há 2 horas"
    },
    {
      title: "Mineração: Novas tecnologias aumentam eficiência e segurança na Serra Sul.",
      cat: "MINERAÇÃO",
      img: "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=2070&auto=format&fit=crop",
      location: "Canaã",
      time: "Há 4 horas"
    },
    {
      title: "Parauapebas registra saldo positivo na geração de empregos no último trimestre.",
      cat: "ECONOMIA",
      img: "https://images.unsplash.com/photo-1521791136366-39853759d2fe?q=80&w=2070&auto=format&fit=crop",
      location: "Parauapebas",
      time: "Há 6 horas"
    }
  ];

  const secondaryNews = [
      {
        title: "Obras de saneamento avançam em bairros periféricos de Parauapebas.",
        cat: "CIDADES",
        img: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop",
        location: "Parauapebas",
        time: "Há 1 dia"
      },
      {
        title: "Polícia Militar intensifica rondas comerciais no centro de Marabá.",
        cat: "SEGURANÇA",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop",
        location: "Marabá",
        time: "Há 8 horas"
      },
      {
        title: "Curionópolis recebe novos equipamentos de saúde para o hospital municipal.",
        cat: "SAÚDE",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop",
        location: "Curionópolis",
        time: "Há 3 horas"
      }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopBar />
      <MainHeader />
      <CategoryMenu />

      <main className="container mx-auto px-6 py-10">
        {/* Plantão / Urgente */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-brand-black text-white p-4 rounded-xl flex items-center gap-6 overflow-hidden border-l-4 border-primary shadow-lg"
        >
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 animate-pulse tracking-widest">
              <Radio size={12} /> AO VIVO
            </span>
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <p className="text-sm font-bold truncate tracking-tight uppercase italic text-primary">
              Plantão: Vale anuncia expansão histórica em Carajás.
            </p>
          </div>
          <button className="shrink-0 text-white hover:text-primary transition-colors font-black text-[10px] flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
            LER MAIS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Hero Section - Classic Journalism Style */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Main Headline */}
          <div className="lg:col-span-8 group cursor-pointer">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop" 
                alt="Manchete Principal" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  DESTAQUE
                </span>
                <span className="bg-brand-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  ECONOMIA
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> PARAUAPEBAS</span>
              <span>•</span>
              <span className="text-muted-foreground">HÁ 2 HORAS</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1] text-brand-black group-hover:text-primary transition-colors tracking-tighter uppercase italic">
              Vale anuncia expansão histórica em Carajás com foco em sustentabilidade.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 line-clamp-3 leading-relaxed font-medium">
              O projeto estratégico prevê a geração de mais de 5 mil postos de trabalho diretos na região do sudeste paraense e um investimento bilionário que deve impulsionar o PIB estadual nos próximos anos.
            </p>
          </div>

          {/* Secondary Headlines Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
            {secondaryNews.slice(0, 2).map((post, idx) => (
                <div key={idx} className="group cursor-pointer border-b border-border/50 lg:border-border pb-6 last:border-0 sm:border-b-0 lg:border-b">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl mb-4 relative shadow-md">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 left-3">
                            <span className="bg-brand-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">{post.cat}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-2">
                        <span>{post.location}</span>
                        <span className="text-primary">•</span>
                        <span>{post.time}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-none">
                        {post.title}
                    </h3>
                </div>
            ))}
          </div>
        </section>

        {/* Home Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-20">
                {/* Regional News Block */}
                <NewsGrid title="Notícias da Região" items={latestNews} />
                
                {/* Another Category Block */}
                <section>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-brand-black">
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-brand-black">Política & Mineração</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {secondaryNews.map((post, idx) => (
                            <div key={idx} className="flex gap-4 group cursor-pointer p-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50">
                                <div className="w-24 md:w-32 h-20 md:h-24 shrink-0 rounded-lg overflow-hidden shadow-sm">
                                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{post.cat}</span>
                                    <h4 className="text-xs md:text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase">
                                        {post.title}
                                    </h4>
                                    <span className="text-[8px] font-black text-muted-foreground/60 uppercase mt-2 block">{post.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
                <Sidebar />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
