export function CategoryMenu() {
  const categories = [
    "Home", "Últimas Notícias", "Parauapebas", "Canaã dos Carajás", "Marabá", 
    "Curionópolis", "Eldorado", "Política", "Mineração", "Economia", "Polícia", "Vídeos"
  ];
  
  return (
    <nav className="border-b border-border bg-white shadow-sm">
      <div className="container mx-auto px-6 flex items-center gap-8 text-[11px] font-black text-brand-black uppercase tracking-[0.2em] overflow-x-auto py-4">
        {categories.map(cat => (
          <a key={cat} href="#" className="whitespace-nowrap hover:text-primary transition-all relative group py-1">
            {cat}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </a>
        ))}
      </div>
    </nav>
  );
}
