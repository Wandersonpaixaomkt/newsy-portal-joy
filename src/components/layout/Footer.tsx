import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
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
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-white/10 text-[10px] font-black uppercase hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">FB</a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-white/10 text-[10px] font-black uppercase hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">IG</a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-white/10 text-[10px] font-black uppercase hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">TW</a>
            </div>
          </div>
          
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Cidades</h5>
            <ul className="flex flex-col gap-3 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li><Link to={"/noticias/parauapebas" as any} className="hover:text-white transition-colors">Parauapebas</Link></li>
              <li><Link to={"/noticias/canaa-dos-carajas" as any} className="hover:text-white transition-colors">Canaã dos Carajás</Link></li>
              <li><Link to={"/noticias/maraba" as any} className="hover:text-white transition-colors">Marabá</Link></li>
              <li><Link to={"/noticias/curionopolis" as any} className="hover:text-white transition-colors">Curionópolis</Link></li>
              <li><Link to={"/noticias/eldorado" as any} className="hover:text-white transition-colors">Eldorado</Link></li>
              <li><Link to={"/noticias/belem" as any} className="hover:text-white transition-colors">Belém / Pará</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Editorias</h5>
            <ul className="flex flex-col gap-3 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li><Link to={"/noticias/politica" as any} className="hover:text-white transition-colors">Política</Link></li>
              <li><Link to={"/noticias/mineracao" as any} className="hover:text-white transition-colors">Mineração</Link></li>
              <li><Link to={"/noticias/policia" as any} className="hover:text-white transition-colors">Polícia</Link></li>
              <li><Link to={"/noticias/emprego" as any} className="hover:text-white transition-colors">Emprego</Link></li>
              <li><Link to={"/noticias/utilidade-publica" as any} className="hover:text-white transition-colors">Utilidade Pública</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Contato</h5>
            <ul className="flex flex-col gap-4 text-white/40 font-bold text-xs uppercase tracking-widest">
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> (94) 99999-9999</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> contato@norteemfoco.com.br</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Parauapebas - PA</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <p>© 2026 Norte em Foco. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
            <a href="#" className="hover:text-white transition-colors">Anuncie</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
