import { supabase } from "@/integrations/supabase/client";

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  category?: { name: string; slug: string } | null;
  status: 'draft' | 'published' | 'scheduled' | 'review';
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: { full_name: string } | null;
  source?: { name: string; url: string } | null;
};

export const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name)
    `)
    .eq('status', 'published')
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    throw new Error(error.message);
  }

  return data as any as Article[];
};

export const fetchFeaturedArticle = async (): Promise<Article | null> => {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name)
    `)
    .eq('status', 'published')
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching featured article:", error);
    throw new Error(error.message);
  }

  return data as any as Article;
};
