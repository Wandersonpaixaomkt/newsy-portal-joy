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
export type Author = Database["public"]["Tables"]["authors"]["Row"];

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  category: Pick<Category, "name" | "slug"> | null;
  city: Pick<City, "name" | "slug"> | null;
  author: Pick<Author, "name" | "slug"> | null;
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
    category: post.category || null,
    city: post.city || null,
    author: post.author || null,
    image_url: post.image_url || null
  })) as Post[];
};

export const fetchNews = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug),
      author:authors(name, slug)
    `)
    .order("published_at", { ascending: false });

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
      city:cities(name, slug),
      author:authors(name, slug)
    `)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching featured post:", error);
    throw new Error("Erro ao carregar destaque.");
  }

  return data ? (mapPostData([data])[0] || null) : null;
};

export const fetchUrgentPost = async (): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug),
      author:authors(name, slug)
    `)
    .eq("is_urgent", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching urgent post:", error);
    throw new Error("Erro ao carregar plantão.");
  }

  return data ? (mapPostData([data])[0] || null) : null;
};

export const fetchNewsByCategory = async (categorySlug: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories!inner(name, slug),
      city:cities(name, slug),
      author:authors(name, slug)
    `)
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`Error fetching news for category ${categorySlug}:`, error);
    throw new Error("Erro ao carregar notícias da categoria.");
  }

  return mapPostData(data);
};
