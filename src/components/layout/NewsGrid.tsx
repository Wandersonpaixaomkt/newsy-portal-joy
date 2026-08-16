import { MapPin, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  title: string;
  cat: string;
  img: string;
  location: string;
  time: string;
}

export function NewsGrid({ title, items }: { title?: string, items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      {title && (
        <div className="flex items-center justify-between mb-6 md:mb-10 pb-4 border-b border-white/10">
          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-white">{title}</h3>
          <a href="#" className="text-[10px] font-black text-primary hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest group">
            Ver Tudo <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((post, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group cursor-pointer flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden relative bg-white/5">
              <img 
                src={post.img} 
                alt={post.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play size={20} fill="currentColor" />
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
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {post.location}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                </div>
              <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase italic text-white tracking-tight normal-case">
                {post.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
