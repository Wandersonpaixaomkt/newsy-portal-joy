import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

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

export function Footer() {
  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "#", color: "hover:text-primary" },
    { name: "Instagram", icon: InstagramIcon, href: "#", color: "hover:text-primary" },
    { name: "X", icon: XIcon, href: "#", color: "hover:text-primary" },
    { name: "YouTube", icon: YoutubeIcon, href: "#", color: "hover:text-primary" }
  ];

  return (
    <footer className="bg-brand-dark text-white pt-20 border-t-4 border-primary mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex flex-col mb-8">
              <span className="text-3xl font-black tracking-tighter text-white leading-none">
                Norte<span className="text-primary">em</span>Foco
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase leading-none mt-2">
                Portal de Notícias
              </span>
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed mb-8 max-w-sm">
              Informação com credibilidade sobre o Sudeste do Pará. A região em pauta. A notícia em movimento.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  className={`text-white/40 transition-all duration-300 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 lg:col-span-3">
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">Institucional</h5>
            <ul className="flex flex-col gap-4 text-white/40 font-bold text-[11px] uppercase tracking-widest">
              <li><Link to="/" className="hover:text-primary transition-colors">Expediente</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Anuncie</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">Contato & Endereço</h5>
            <ul className="flex flex-col gap-5 text-white/40 font-bold text-[11px] uppercase tracking-widest">
              <li className="flex items-start gap-3"><MapPin size={16} className="text-primary shrink-0" /> <div>Parauapebas, Pará - Brasil<br/>CNPJ: 00.000.000/0000-00</div></li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-primary" /> (94) 99999-9999</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-primary" /> contato@norteemfoco.com.br</li>
            </ul>
          </div>
        </div>
        
        <div className="py-8 border-t border-white/10 text-center md:text-left">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            © 2026 Norte em Foco. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
