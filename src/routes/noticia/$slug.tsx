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
import { ShareButtons } from "@/components/layout/ShareButtons";
import { useEffect, useRef, useState } from "react";
import { analytics } from "@/lib/analytics";
import { ENV } from "@/lib/env";
import { toast as sonnerToast } from "sonner";

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
      if (!ENV.PROTECTION_ENABLED) return;
      
      const selection = window.getSelection();
      if (selection && selection.toString().length > 10) {
          analytics.trackCopyAttempt(article.id);
          
          const title = article.title;
          const canonical = window.location.origin + "/noticia/" + article.slug;
          const protectionText = `Norte em Foco — ${title}\nLeia em: ${canonical}`;
          
          e.preventDefault();
          if (e.clipboardData) {
             e.clipboardData.setData('text/plain', protectionText);
          }
          
          sonnerToast.info("Link da matéria copiado", {
            description: "A autoria foi preservada no conteúdo copiado.",
            duration: 2000,
          });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!ENV.PROTECTION_ENABLED) return;
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        analytics.trackInteraction('img_context_menu', article.id);
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (!ENV.PROTECTION_ENABLED) return;
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        analytics.trackInteraction('img_drag_attempt', article.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [article]);

  if (isLoading) return <div className="min-h-screen bg-neutral-50 p-10"><Skeleton className="h-96 w-full" /></div>;
  if (error || !article) return <div className="min-h-screen bg-neutral-50 p-10 text-brand-dark text-center">Notícia não encontrada.</div>;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-brand-dark">
      <TopBar />
      <MainHeader />
      
      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-brand-dark transition-colors mb-8 font-bold">
          <ArrowLeft size={18} /> Voltar ao Início
        </Link>
        
        <article className="space-y-6">
          <div className="flex gap-2">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {article.category?.name || "Geral"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">{article.title}</h1>
          <p className="text-xl text-brand-dark/70 font-medium tracking-tight">{article.excerpt}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-brand-dark/50 border-y border-neutral-200 py-6">
             <span className="flex items-center gap-2"><MapPin size={16} /> {article.city?.name || "Sudeste do Pará"}</span>
             <span className="flex items-center gap-2"><Calendar size={16} /> {format(new Date(article.published_at || new Date()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
             <span className="flex items-center gap-2"><Clock size={16} /> {article.author?.name || "Redação"}</span>
          </div>

          <div className="relative group overflow-hidden rounded-3xl aspect-video">
            <img 
              src={article.image_url || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop"} 
              alt={article.title}
              draggable="false"
              className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
              style={{ WebkitTouchCallout: 'none' }}
            />
            {ENV.IMAGE_WATERMARK_ENABLED && (
              <div className="absolute bottom-4 right-4 bg-brand-dark/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none select-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Norte em Foco</span>
              </div>
            )}
          </div>

          <ShareButtons url={window.location.href} title={article.title} />

          <div ref={contentRef} className="prose prose-neutral prose-lg max-w-none text-brand-dark/90">
             {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
             ) : (
                <div className="p-10 border border-dashed border-neutral-200 rounded-3xl bg-neutral-100/50">
                   <p className="text-brand-dark/60 text-center italic">Conteúdo demonstrativo. A reportagem completa será publicada em breve.</p>
                </div>
             )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
