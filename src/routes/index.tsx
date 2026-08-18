import { createFileRoute, Link } from "@tanstack/react-router";
import { MainHeader } from "@/components/layout/MainHeader";
import { NewsGrid } from "@/components/layout/NewsGrid";
import { Footer } from "@/components/layout/Footer";
import { Plus, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews, fetchFeaturedPost, Post } from "@/lib/news";
import { RotatingAd } from "@/components/ads/RotatingAd";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Norte em Foco | A região em pauta. A notícia em movimento.",
    meta: [
      { name: "description", content: "Portal de notícias do Sudeste do Pará. Parauapebas, Canaã, Marabá e região." },
      { property: "og:title", content: "Norte em Foco" },
      { property: "og:type", content: "website" }
    ]
  }),
  component: Index,
});

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";

function Index() {
  const { data: articles = [] } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchNews,
  });

  const { data: featuredArticle } = useQuery({
    queryKey: ["featuredArticle"],
    queryFn: fetchFeaturedPost,
  });

  const mapToView = (post: Post) => ({
    id: post.id,
    slug: post.slug || post.id,
    title: post.title,
    cat: post.category?.name || "GERAL",
    img: post.image_url || IMAGE_PLACEHOLDER,
  });

  const displayFeatured = featuredArticle || articles[0];
  const remaining = articles.filter((a) => a.id !== displayFeatured?.id);

  const secondaryGrid = remaining.slice(0, 4).map(mapToView);

  const regionNews = articles
    .filter((a) => a.city?.slug === "parauapebas" || a.city?.slug === "canaa-dos-carajas")
    .slice(0, 4)
    .map(mapToView);
  const politicsNews = articles
    .filter((a) => a.category?.slug === "politica")
    .slice(0, 4)
    .map(mapToView);
  const brazilNews = articles
    .filter((a) => a.category?.slug === "brasil" || a.category?.slug === "nacional")
    .slice(0, 4)
    .map(mapToView);

  const policeNews = articles
    .filter((a) => a.category?.slug === "policia")
    .slice(0, 4)
    .map(mapToView);
  const sportsNews = articles
    .filter((a) => a.category?.slug === "esportes")
    .slice(0, 4)
    .map(mapToView);

  const AdPlaceholder = ({ label, height }: { label: string; height: number }) => (
    <div
      className="w-full mx-auto bg-gray-100 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden my-12"
      style={{ height }}
    >
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark">
      <MainHeader />

      <main className="container mx-auto px-6">
        {/* Banner Topo com rotação */}
        <div className="my-12">
          <RotatingAd
            slot="topo"
            format="full"
            page="home"
            maxWidth={1500}
            className="mx-auto rounded-lg border border-neutral-100"
            placeholder={<AdPlaceholder label="Publicidade Banner Topo" height={230} />}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
              {displayFeatured && (
                <>
                  <Link
                    to="/noticia/$slug"
                    params={{ slug: displayFeatured.slug || displayFeatured.id }}
                    className="group relative overflow-hidden rounded-2xl aspect-[16/10] shadow-xl"
                  >
                    <img
                      src={displayFeatured.image_url || IMAGE_PLACEHOLDER}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={displayFeatured.title}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={64} fill="white" className="text-white" />
                    </div>
                  </Link>

                  <div className="flex flex-col justify-center">
                    <span className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit mb-4">
                      {displayFeatured.category?.name || "DESTAQUE"}
                    </span>
                    <Link
                      to="/noticia/$slug"
                      params={{
                        slug: displayFeatured.slug || displayFeatured.id,
                      }}
                    >
                      <h1 className="text-3xl md:text-5xl font-black mb-8 leading-[1.1] hover:text-primary transition-colors tracking-tight">
                        {displayFeatured.title}
                      </h1>
                    </Link>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                        Veja também
                      </h3>
                      <ul className="space-y-4">
                        {remaining.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="group">
                            <Link
                              to="/noticia/$slug"
                              params={{ slug: item.slug || item.id }}
                              className="flex items-start gap-3 text-base md:text-lg font-bold leading-tight group-hover:text-primary transition-colors"
                            >
                              <Plus size={20} className="text-primary mt-1 shrink-0" />
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </section>

            <NewsGrid items={secondaryGrid} />

            {/* Banner central / entre notícias */}
            <div className="my-12">
              <RotatingAd
                slot="entre-noticias"
                format="full"
                page="home"
                maxWidth={2560}
                className="mx-auto rounded-lg border border-neutral-100"
                placeholder={<AdPlaceholder label="Publicidade Banner Central" height={200} />}
              />
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <EditorialBlock title="Região" news={regionNews} />
              <EditorialBlock title="Política" news={politicsNews} />
              <EditorialBlock title="Brasil" news={brazilNews} />
            </section>
          </div>

          {/* Lateral: 1:1 e 3:4 com rotação independente */}
          <div className="hidden lg:flex flex-col gap-8 w-[300px] shrink-0 sticky top-24 h-fit">
            <RotatingAd
              slot="lateral"
              format="1:1"
              page="home"
              aspectClass="aspect-square"
              className="w-full rounded-xl border border-gray-100 shadow-sm"
              placeholder={
                <div className="w-full aspect-square bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Publicidade 1:1
                  </span>
                </div>
              }
            />
            <RotatingAd
              slot="lateral"
              format="3:4"
              page="home"
              aspectClass="aspect-[3/4]"
              className="w-full rounded-xl border border-gray-100 shadow-sm"
              placeholder={
                <div className="w-full aspect-[3/4] bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Publicidade 3:4
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </main>

      <div className="bg-brand-dark py-16 mb-16">
        <div className="container mx-auto px-6">
          <NewsGrid title="Plantão Policial" items={policeNews} dark={true} />
        </div>
      </div>

      <main className="container mx-auto px-6">
        <NewsGrid title="Esportes" items={sportsNews} />
        <div className="w-full h-1 bg-primary mb-16"></div>
      </main>

      <Footer />
    </div>
  );
}

function EditorialBlock({ title, news }: { title: string; news: any[] }) {
  if (news.length === 0) return null;
  const main = news[0];
  const list = news.slice(1, 4);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-8 bg-primary"></span>
        <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
      </div>

      <Link
        to="/noticia/$slug"
        params={{ slug: main.slug || main.id }}
        className="group mb-6"
      >
        <div className="aspect-video rounded-xl overflow-hidden mb-4 shadow-md">
          <img
            src={main.img}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={main.title}
          />
        </div>
        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">
          {main.cat}
        </span>
        <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {main.title}
        </h4>
      </Link>

      <ul className="space-y-4 border-t border-gray-100 pt-6">
        {list.map((item, idx) => (
          <li key={idx} className="group">
            <Link
              to="/noticia/$slug"
              params={{ slug: item.slug || item.id }}
              className="flex items-start gap-2 text-sm font-bold leading-tight group-hover:text-primary transition-colors"
            >
              <Plus size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
