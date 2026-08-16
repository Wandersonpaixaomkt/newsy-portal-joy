import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type City = Database["public"]["Tables"]["cities"]["Row"];

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  category: Pick<Category, "name" | "slug"> | null;
  city: Pick<City, "name" | "slug"> | null;
};

// Error-safe response wrapper
export type QueryResponse<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export const fetchNews = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    throw new Error("Erro ao carregar notícias. Por favor, tente novamente mais tarde.");
  }

  return (data || []) as unknown as Post[];
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

  return data as unknown as Post;
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

  return data as unknown as Post;
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

  return (data || []) as unknown as Post[];
};

