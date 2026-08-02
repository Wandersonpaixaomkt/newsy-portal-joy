import { MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  title: string;
  cat: string;
  img: string;
  location: string;
  time: string;
}

export function NewsGrid({ title, items }: { title?: string, items: NewsItem[] }) {
  return (
    <section>
      {title && (
        <div className="flex items-center justify-between mb-6 md:mb-10 pb-4 border-b border-border">
          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-brand-black">{title}</h3>
          <a href="#" className="text-[10px] font-black text-primary hover:text-brand-black transition-colors flex items-center gap-1 uppercase tracking-widest group">
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
            className="group cursor-pointer flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden relative rounded-2xl mb-4">
              <img 
                src={post.img} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {post.cat}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {post.location}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                </div>
              <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
                {post.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
