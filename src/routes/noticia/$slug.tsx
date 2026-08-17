import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "@/lib/news";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

export const Route = createFileRoute("/noticia/$slug")({
  component: PostPage,
});

function PostPage() {
  const { slug } = useParams({ from: "/noticia/$slug" });
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug),
  });

  // Analytics and Protection
  useEffect(() => {
    if (!article) return;

    analytics.trackPageView(article.id);
    
    // Tracking scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Prevent division by zero
      if (docHeight <= winHeight) return;
      
      const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Track at 25, 50, 75, 100
        if (maxScroll >= 25 && maxScroll % 25 === 0) {
           analytics.trackScroll(maxScroll, article.id);
        }
      }
    };

    // Protection against copying
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 100) {
         analytics.trackCopyAttempt(article.id);
         e.preventDefault();
         const text = selection.toString() + "\n\nLeia mais em Norte em Foco: " + window.location.href;
         if (e.clipboardData) {
            e.clipboardData.setData('text/plain', text);
         }
      }
    };


    window.addEventListener('scroll', handleScroll);
    document.addEventListener('copy', handleCopy);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('copy', handleCopy);
    };
  }, [article]);

  if (isLoading) return <div className="min-h-screen bg-brand-black p-10"><Skeleton className="h-96 w-full" /></div>;
  if (error || !article) return <div className="min-h-screen bg-brand-black p-10 text-white text-center">Notícia não encontrada.</div>;

  return (
    <div className="min-h-screen bg-brand-black font-sans text-white">
      <TopBar />
      <MainHeader />
      
      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-bold">
          <ArrowLeft size={18} /> Voltar ao Início
        </Link>
        
        <article className="space-y-6">
          <div className="flex gap-2">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {article.category?.name || "Geral"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">{article.title}</h1>
          <p className="text-xl text-white/70 font-medium tracking-tight">{article.excerpt}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 border-y border-white/10 py-6">
             <span className="flex items-center gap-2"><MapPin size={16} /> {article.city?.name || "Sudeste do Pará"}</span>
             <span className="flex items-center gap-2"><Calendar size={16} /> {format(new Date(article.published_at || new Date()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
             <span className="flex items-center gap-2"><Clock size={16} /> {article.author?.name || "Redação"}</span>
          </div>

          <img 
            src={article.image_url || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop"} 
            alt={article.title}
            className="w-full rounded-3xl object-cover aspect-video"
          />

          <div ref={contentRef} className="prose prose-invert prose-lg max-w-none text-white/90">
             {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
             ) : (
                <div className="p-10 border border-dashed border-white/20 rounded-3xl bg-white/5">
                   <p className="text-white/60 text-center italic">Conteúdo demonstrativo. A reportagem completa será publicada em breve.</p>
                </div>
             )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
