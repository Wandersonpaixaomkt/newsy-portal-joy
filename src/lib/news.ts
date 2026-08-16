import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: { name: string; slug: string } | null;
  city: { name: string; slug: string } | null;
  is_urgent: boolean;
  is_featured: boolean;
  published_at: string;
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
    throw new Error(error.message);
  }

  return data as any as Post[];
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
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching featured post:", error);
    throw new Error(error.message);
  }

  return data as any as Post;
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
    throw new Error(error.message);
  }

  return data as any as Post;
};
