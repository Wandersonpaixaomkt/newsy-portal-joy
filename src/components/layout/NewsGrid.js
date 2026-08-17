import { MapPin, ChevronRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
export function NewsGrid({ title, items }) {
    if (items.length === 0)
        return null;
    return (<section>
      {title && (<div className="flex items-center justify-between mb-6 md:mb-10 pb-4 border-b border-white/10">
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">{title}</h3>
          <Link to="/" className="text-[10px] font-black text-primary hover:text-white transition-all duration-300 flex items-center gap-2 uppercase tracking-[0.2em] group/all px-4 py-2 rounded-full hover:bg-white/5">
            Ver Tudo <ChevronRight size={16} className="group-hover/all:translate-x-1 transition-transform"/>
          </Link>
        </div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((post, idx) => (<Link key={idx} to="/noticia/$slug" params={{ slug: post.slug || post.id || "" }} className="group cursor-pointer flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all duration-500 hover:shadow-premium shadow-2xl">
            <div className="aspect-video overflow-hidden relative bg-white/5">
              <img src={post.img} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => {
                const target = e.target;
                target.src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";
            }}/>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-xl">
                    <Play size={20} fill="currentColor"/>
                 </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  {post.cat}
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-primary"/> {post.location}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                </div>
              <h4 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 text-white/90 tracking-tight normal-case">
                {post.title}
              </h4>
            </div>
          </Link>))}
      </div>
    </section>);
}
