import { Mail, TrendingUp } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-8 md:gap-10">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-sm">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Newsletter
        </h4>
        <p className="text-xs text-white/40 mb-4 font-medium">Receba as principais notícias do Norte no seu e-mail.</p>
        <div className="flex flex-col gap-2">
            <input type="email" placeholder="Seu e-mail" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary text-white" />
            <button className="w-full bg-primary text-white rounded-xl py-2 text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-colors cursor-pointer">Inscrever</button>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-sm">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Siga-nos
        </h4>
        <div className="grid grid-cols-4 gap-2">
            <a href="#" className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary text-white transition-all text-[10px] font-black uppercase">IG</a>
            <a href="#" className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary text-white transition-all text-[10px] font-black uppercase">FB</a>
            <a href="#" className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary text-white transition-all text-[10px] font-black uppercase">TW</a>
            <a href="#" className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary text-white transition-all text-[10px] font-black uppercase">YT</a>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-sm overflow-hidden relative group">
        <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Publicidade
        </h4>
        <div className="aspect-[3/4] bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/10">
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
                    <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-white/80 tracking-tight">
                        Vale anuncia novos investimentos para o projeto S11D em Canaã.
                    </p>
                </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
