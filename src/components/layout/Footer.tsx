import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Ícones personalizados SVG para redes sociais para garantir compatibilidade e leveza
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

export function Footer() {
  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com/norteemfoco", color: "hover:bg-blue-600" },
    { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com/norteemfoco", color: "hover:bg-pink-600" },
    { name: "X", icon: XIcon, href: "https://x.com/norteemfoco", color: "hover:bg-zinc-800" },
    { name: "YouTube", icon: YoutubeIcon, href: "https://youtube.com/@norteemfoco", color: "hover:bg-red-600" }
  ];

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 border-t border-white/5 mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-6">
              <span className="text-2xl font-black tracking-tighter text-white leading-none">
                Norte<span className="text-primary">em</span>Foco
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-white/40 uppercase leading-none mt-1">
                Portal de Notícias
              </span>
            </div>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-6">
              A região em pauta. A notícia em movimento. O portal de notícias que mais cresce no norte do Brasil.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 border border-white/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Cidades</h5>
            <ul className="flex flex-col gap-3 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li><Link to="/" className="hover:text-white transition-colors">Parauapebas</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Canaã dos Carajás</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Marabá</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Curionópolis</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Eldorado</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Belém / Pará</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Editorias</h5>
            <ul className="flex flex-col gap-3 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li><Link to="/" className="hover:text-white transition-colors">Política</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Mineração</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Polícia</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Emprego</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Utilidade Pública</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Contato</h5>
            <ul className="flex flex-col gap-4 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li className="flex items-center gap-2"><Send size={14} className="text-primary" /> (94) 99999-9999</li>
              <li className="flex items-center gap-2"><Send size={14} className="text-primary" /> contato@norteemfoco.com.br</li>
              <li className="flex items-center gap-2"><Send size={14} className="text-primary" /> Parauapebas - PA</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <p>© 2026 Norte em Foco. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Sobre</Link>
            <Link to="/" className="hover:text-white transition-colors">Anuncie</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
