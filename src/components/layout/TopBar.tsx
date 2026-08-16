import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function TopBar() {
  return (
    <div className="hidden md:block bg-brand-dark text-white/40 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] border-b border-white/5">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <div className="flex gap-8">
          <Link to="/admin/login" className="hover:text-primary transition-all duration-300">LOGIN</Link>
          <a href="#" className="hover:text-primary transition-all duration-300">CONTATO</a>
          <a href="#" className="hover:text-primary transition-all duration-300">ANUNCIE</a>
        </div>
      </div>
    </div>
  );
}
