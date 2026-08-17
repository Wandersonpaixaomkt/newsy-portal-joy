import { TrendingUp } from "lucide-react";

// Ícones personalizados SVG para redes sociais
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Sidebar() {
  const socialLinks = [
    { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com/norteemfoco", color: "hover:bg-pink-600" },
    { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com/norteemfoco", color: "hover:bg-blue-600" },
    { name: "X", icon: XIcon, href: "https://x.com/norteemfoco", color: "hover:bg-zinc-800" },
    { name: "YouTube", icon: YoutubeIcon, href: "https://youtube.com/@norteemfoco", color: "hover:bg-red-600" }
  ];

  return (
    <aside className="flex flex-col gap-8 md:gap-10">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl hover:bg-white/10 transition-all duration-500">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Newsletter
        </h4>
        <p className="text-xs text-white/40 mb-4 font-medium">Receba as principais notícias do Norte no seu e-mail.</p>
        <div className="flex flex-col gap-2">
            <input type="email" placeholder="Seu e-mail" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder:text-white/20" />
            <button className="w-full bg-primary text-white rounded-2xl py-3 text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-primary/20">Inscrever</button>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl hover:bg-white/10 transition-all duration-500">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Siga-nos
        </h4>
        <div className="grid grid-cols-4 gap-2">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 ${social.color}`}
              >
                <social.icon size={18} />
              </a>
            ))}
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative group hover:bg-white/10 transition-all duration-500">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Publicidade
        </h4>
        <div className="aspect-[3/4] bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Anuncie Aqui</span>
        </div>
      </div>

      <div>
        <h4 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> MAIS LIDAS
        </h4>
        <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-3xl font-black text-primary/20 group-hover:text-primary transition-colors leading-none">0{i}</span>
                    <p className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 text-white/80 tracking-tight normal-case">
                        Vale anuncia novos investimentos para o projeto S11D em Canaã.
                    </p>
                </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
