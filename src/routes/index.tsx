import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/layout/TopBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { NewsGrid } from "@/components/layout/NewsGrid";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Radio, ArrowRight, Play, AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews, fetchFeaturedPost, Post } from "@/lib/news";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Norte em Foco | Portal de Notícias do Sudeste do Pará",
    meta: [
      { name: "description", content: "A região em pauta. A notícia em movimento. Acompanhe as últimas notícias de Parauapebas, Canaã dos Carajás, Marabá e todo o Sudeste do Pará." },
      { property: "og:title", content: "Norte em Foco | Portal de Notícias" },
      { property: "og:description", content: "Informação com credibilidade sobre o Sudeste do Pará." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: Index,
});

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";

function Index() {
  const { 
    data: articles = [], 
    isLoading: isLoadingNews, 
    error: newsError 
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchNews,
  });

  const { 
    data: featuredArticle, 
    isLoading: isLoadingFeatured 
  } = useQuery({
    queryKey: ["featuredArticle"],
    queryFn: fetchFeaturedPost,
  });

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Recentemente";
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (e) {
      return "Recentemente";
    }
  };

  const mapToView = (post: Post) => ({
    title: post.title,
    cat: post.category?.name || "GERAL",
    img: post.image_url || IMAGE_PLACEHOLDER,
    location: post.city?.name || "Região",
    time: formatTime(post.published_at)
  });

  const displayFeatured = featuredArticle || articles[0];
  
  // Filtering articles to avoid duplicates
  const filteredArticles = articles.filter(a => a.id !== displayFeatured?.id);
  
  const latestNews = filteredArticles.slice(0, 3).map(mapToView);
  const secondaryNews = filteredArticles.slice(3, 7).map(mapToView);
  
  // Specific sections
  const politicsAndCities = articles.filter(a => 
    a.category?.slug === "politica" || a.category?.slug === "cidades"
  ).slice(0, 3).map(mapToView);


  if (newsError) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col">
        <TopBar />
        <MainHeader />
        <div className="container mx-auto px-6 py-20 flex justify-center">
          <Alert variant="destructive" className="max-w-2xl bg-red-950/20 border-red-900/50 text-red-200">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-bold uppercase tracking-widest italic">Erro de Conexão</AlertTitle>
            <AlertDescription className="text-sm font-medium">
              Não foi possível carregar as notícias. Por favor, verifique sua conexão ou tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black font-sans text-white">
      <TopBar />
      <MainHeader />
      <CategoryMenu />

      <main className="container mx-auto px-6 py-10">
        {/* Plantão / Urgente */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 bg-white/5 p-3 md:p-4 rounded-xl flex items-center gap-4 md:gap-6 overflow-hidden border-l-4 border-primary shadow-2xl backdrop-blur-md border border-white/5"
        >
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <span className="bg-primary text-white px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase flex items-center gap-1 md:gap-1.5 animate-pulse tracking-widest whitespace-nowrap">
              <Radio size={12} /> AO VIVO
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs md:text-sm font-bold truncate tracking-tight text-white/90">
              Plantão: Acompanhe as últimas atualizações da região em tempo real no Norte em Foco.
            </p>
          </div>
          <button className="shrink-0 text-white/60 hover:text-primary transition-colors font-black text-[9px] md:text-[10px] flex items-center gap-1.5 md:gap-2 uppercase tracking-widest cursor-pointer group">
            <span className="hidden xs:inline">VER AGORA</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Hero Section - Video Channel Style */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 mb-16 md:mb-24">
          {/* Main Hero Card */}
          <div className="lg:col-span-8 group cursor-pointer relative">
            {isLoadingFeatured || isLoadingNews ? (
              <Skeleton className="aspect-video w-full rounded-3xl bg-white/5" />
            ) : displayFeatured ? (
              <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl bg-white/5 border border-white/10">
                <img 
                  src={displayFeatured.image_url || IMAGE_PLACEHOLDER} 
                  alt={displayFeatured.title} 
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                      <Play size={32} fill="currentColor" className="ml-1" />
                   </div>
                </div>

                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    DESTAQUE
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    {displayFeatured.category?.name || "NOTÍCIA"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                  <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {displayFeatured.city?.name || "REGIÃO"}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/60">{formatTime(displayFeatured.published_at)}</span>
                  </div>
                  <h1 className="text-2xl md:text-5xl xl:text-6xl font-black mb-4 md:mb-6 leading-[0.95] text-white group-hover:text-primary transition-colors tracking-tighter drop-shadow-2xl">
                    {displayFeatured.title}
                  </h1>
                  <p className="text-sm md:text-lg text-white/70 max-w-2xl line-clamp-2 font-medium tracking-tight normal-case">
                    {displayArticleExcerpt(displayFeatured)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-3xl bg-white/5 flex items-center justify-center border border-dashed border-white/10">
                <span className="text-white/20 font-bold tracking-widest">Nenhum destaque disponível</span>
              </div>
            )}
          </div>

          {/* Secondary Headlines - Vertical List */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-2 flex items-center gap-2">
               <span className="w-8 h-[2px] bg-primary"></span> PRÓXIMAS NOTÍCIAS
            </h3>
            {isLoadingNews ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/5" />)
            ) : secondaryNews.length > 0 ? (
              secondaryNews.slice(0, 3).map((post, idx) => (
                <div key={idx} className="group cursor-pointer flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="w-28 md:w-36 aspect-video shrink-0 overflow-hidden rounded-xl relative bg-white/5">
                        <img src={post.img} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play size={16} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{post.cat}</span>
                        <h3 className="text-xs md:text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight text-white/90">
                            {post.title}
                        </h3>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1">{post.time}</span>
                    </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Aguardando novos conteúdos</span>
              </div>
            )}
          </div>
        </section>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-20">
                {isLoadingNews ? (
                   <div className="space-y-8">
                     <Skeleton className="h-8 w-64 bg-white/5" />
                     <div className="grid grid-cols-3 gap-8"><Skeleton className="h-48 rounded-2xl bg-white/5" /><Skeleton className="h-48 rounded-2xl bg-white/5" /><Skeleton className="h-48 rounded-2xl bg-white/5" /></div>
                   </div>
                ) : (
                  <>
                    {latestNews.length > 0 ? (
                      <NewsGrid title="Últimas da Região" items={latestNews} />
                    ) : (
                      <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4 opacity-20" />
                        <p className="text-white/20 font-black uppercase tracking-[0.2em]">Carregando editorial regional...</p>
                      </div>
                    )}
                    
                    {/* Horizontal Ad Slot */}
                    <div className="w-full h-32 md:h-48 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">Espaço Publicitário</span>
                    </div>

                    {politicsAndCities.length > 0 && (
                      <NewsGrid title="Cidades & Política" items={politicsAndCities} />
                    )}
                  </>
                )}
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

function displayArticleExcerpt(article: Post) {
  if (article.excerpt) return article.excerpt;
  if (article.content) return article.content.substring(0, 150) + "...";
  return "Confira os detalhes desta notícia exclusiva no portal Norte em Foco.";
}

