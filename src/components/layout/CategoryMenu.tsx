export function CategoryMenu() {
  const categories = [
    "Home", "Parauapebas", "Canaã dos Carajás", "Marabá", 
    "Curionópolis", "Eldorado", "Política", "Mineração", "Emprego", "Polícia", "Economia", "Agenda Regional"
  ];
  
  return (
    <nav className="border-b border-white/5 bg-brand-black shadow-sm overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.2em] overflow-x-auto py-3 md:py-4 scrollbar-hide no-scrollbar">
          {categories.map(cat => (
            <a key={cat} href="#" className="whitespace-nowrap hover:text-primary transition-all relative group py-1 shrink-0">
              {cat}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
