import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Tipagens baseadas no schema esperado para Norte em Foco
// Nota: O schema atual no banco contém 'posts', 'categories', 'cities'.
// O projeto oficial esperado deve conter 'articles', 'authors', 'tags', etc.
// Como o Project Ref jlhbgriiyfijxqyhrgkm não possui essas tabelas,
// mantemos o mapeamento para as tabelas existentes até que a migração/conexão seja corrigida
// para o Project Ref ggchlyiiabfifrngnjah mencionado pelo usuário.

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type City = Database["public"]["Tables"]["cities"]["Row"];

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  category: Pick<Category, "name" | "slug"> | null;
  city: Pick<City, "name" | "slug"> | null;
  // Campos extras para compatibilidade futura com 'articles'
  author?: { name: string } | null;
  tags?: string[];
};

export type QueryResponse<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

/**
 * Mapeia post do banco para o modelo da UI do Norte em Foco
 */
const mapPostData = (data: any[] | null): Post[] => {
  return (data || []).map(post => ({
    ...post,
    // Garante que o fallback de imagem funcione corretamente se não houver news-media configurado
    image_url: post.image_url || null
  })) as Post[];
};

export const fetchNews = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `)
    .eq('is_published', true) // Filtra apenas publicados (se a coluna existir, caso contrário falha silenciosamente ou ignoramos)
    .order("published_at", { ascending: false });

  // Se 'is_published' falhar por não existir no schema atual, tentamos sem ele
  if (error && error.message.includes("column \"is_published\" does not exist")) {
    const { data: retryData, error: retryError } = await supabase
      .from("posts")
      .select(`
        *,
        category:categories(name, slug),
        city:cities(name, slug)
      `)
      .order("published_at", { ascending: false });

    if (retryError) throw new Error("Erro ao carregar notícias.");
    return mapPostData(retryData);
  }

  if (error) {
    console.error("Error fetching news:", error);
    throw new Error("Erro ao carregar notícias.");
  }

  return mapPostData(data);
};

export const fetchFeaturedPost = async (): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching featured post:", error);
    throw new Error("Erro ao carregar destaque.");
  }

  return data ? (mapPostData([data])[0]) : null;
};

export const fetchUrgentPost = async (): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `)
    .eq("is_urgent", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching urgent post:", error);
    throw new Error("Erro ao carregar plantão.");
  }

  return data ? (mapPostData([data])[0]) : null;
};

export const fetchNewsByCategory = async (categorySlug: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories!inner(name, slug),
      city:cities(name, slug)
    `)
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`Error fetching news for category ${categorySlug}:`, error);
    throw new Error("Erro ao carregar notícias da categoria.");
  }

  return mapPostData(data);
};
