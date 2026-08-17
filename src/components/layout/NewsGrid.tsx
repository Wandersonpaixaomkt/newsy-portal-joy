import { MapPin, ChevronRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface NewsItem {
  id?: string;
  slug?: string;
  title: string;
  cat: string;
  img: string;
  location?: string;
  time?: string;
}

export function NewsGrid({ title, items, columns = 4, dark = false }: { title?: string, items: NewsItem[], columns?: number, dark?: boolean }) {
  if (items.length === 0) return null;

  return (
    <section className={dark ? "bg-brand-dark py-12 -mx-6 px-6" : "py-8"}>
      {title && (
        <div className={`flex items-center justify-between mb-8 pb-3 border-b-2 ${dark ? "border-white/10" : "border-brand-dark/10"}`}>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary"></span>
            <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-brand-dark"}`}>
              {title}
            </h3>
          </div>
          <Link to="/" className="text-[10px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-widest flex items-center gap-1">
            Ver Mais <ChevronRight size={14} />
          </Link>
        </div>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {items.map((post, idx) => (
          <Link
            key={idx} 
            to="/noticia/$slug"
            params={{ slug: post.slug || post.id || "" }}
            className="group flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden relative rounded-xl bg-white/5 mb-3">
              <img 
                src={post.img} 
                alt={post.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={32} fill="white" className="text-white" />
              </div>
            </div>
            
            <div className="w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left mb-2"></div>
            
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">
              {post.cat}
            </span>
            
            <h4 className={`text-sm md:text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3 ${dark ? "text-white" : "text-brand-dark"}`}>
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
