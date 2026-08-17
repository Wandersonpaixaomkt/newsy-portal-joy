import { supabase } from "@/integrations/supabase/client";
/**
 * Mapeia post do banco para o modelo da UI do Norte em Foco
 */
const mapPostData = (data) => {
    return (data || []).map(post => ({
        ...post,
        category: post.category || null,
        city: post.city || null,
        author: post.author || null,
        image_url: post.image_url || null
    }));
};
export const fetchNews = async () => {
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
export const fetchFeaturedPost = async () => {
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
export const fetchUrgentPost = async () => {
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
export const fetchNewsByCategory = async (categorySlug) => {
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
export const fetchPostBySlug = async (slug) => {
    const { data, error } = await supabase
        .from("posts")
        .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug),
      author:authors(name, slug)
    `)
        .eq("slug", slug)
        .maybeSingle();
    if (error) {
        console.error(`Error fetching post by slug \${slug}:`, error);
        throw new Error("Erro ao carregar notícia.");
    }
    return data ? (mapPostData([data])[0] || null) : null;
};
export const fetchRelatedPosts = async (postId, categoryId) => {
    const { data, error } = await supabase
        .from("posts")
        .select(`
      *,
      category:categories(name, slug),
      city:cities(name, slug),
      author:authors(name, slug)
    `)
        .eq("category_id", categoryId)
        .neq("id", postId)
        .order("published_at", { ascending: false })
        .limit(3);
    if (error) {
        console.error("Error fetching related posts:", error);
        return [];
    }
    return mapPostData(data);
};
