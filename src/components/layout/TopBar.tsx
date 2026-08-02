import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function TopBar() {
  return (
    <div className="hidden md:block bg-brand-black text-white py-2 text-[10px] font-black uppercase tracking-[0.2em]">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <span>{format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">LOGIN</a>
          <a href="#" className="hover:text-primary transition-colors">CONTATO</a>
          <a href="#" className="hover:text-primary transition-colors">ANUNCIE</a>
        </div>
      </div>
    </div>
  );
}
