import { Search, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-10">
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Newsletter
        </h4>
        <p className="text-xs text-muted-foreground mb-4">Receba as principais notícias de Carajás no seu e-mail.</p>
        <div className="flex flex-col gap-2">
            <input type="email" placeholder="Seu e-mail" className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
            <button className="w-full bg-brand-black text-white rounded-xl py-2 text-xs font-black uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer">Inscrever</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Siga-nos
        </h4>
        <div className="grid grid-cols-4 gap-2">
            <a href="#" className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase">IG</a>
            <a href="#" className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase">FB</a>
            <a href="#" className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase">TW</a>
            <a href="#" className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase">YT</a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Publicidade
        </h4>
        <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Anuncie Aqui</span>
        </div>
      </div>

      <div>
        <h4 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Mais Lidas
        </h4>
        <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                    <span className="text-3xl font-black text-gray-100 group-hover:text-primary/20 transition-colors">0{i}</span>
                    <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                        Vale anuncia novos investimentos para o projeto S11D em Canaã.
                    </p>
                </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
