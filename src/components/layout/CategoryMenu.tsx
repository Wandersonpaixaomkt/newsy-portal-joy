import { Link } from "@tanstack/react-router";

export function CategoryMenu() {
  const categories = [
    { name: "Home", slug: "" },
    { name: "Parauapebas", slug: "parauapebas" },
    { name: "Canaã dos Carajás", slug: "canaa-dos-carajas" },
    { name: "Marabá", slug: "maraba" },
    { name: "Curionópolis", slug: "curionopolis" },
    { name: "Eldorado", slug: "eldorado" },
    { name: "Política", slug: "politica" },
    { name: "Mineração", slug: "mineracao" },
    { name: "Emprego", slug: "emprego" },
    { name: "Polícia", slug: "policia" },
    { name: "Economia", slug: "economia" },
    { name: "Agenda Regional", slug: "agenda-regional" }
  ];
  
  return (
    <nav className="border-b border-white/5 bg-brand-black shadow-sm overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.2em] overflow-x-auto py-3 md:py-4 scrollbar-hide no-scrollbar">
          {categories.map(cat => (
            <Link 
              key={cat.slug} 
              to={cat.slug === "" ? "/" : `/noticias/${cat.slug}`}
              className="whitespace-nowrap hover:text-primary transition-all relative group py-2 shrink-0 px-2 rounded-md hover:bg-white/5"
            >
              {cat.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
