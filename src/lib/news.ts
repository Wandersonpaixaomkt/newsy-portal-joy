import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { localPosts } from "@/lib/local-news";

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

type RemotePost = Database["public"]["Tables"]["posts"]["Row"] & {
  category?: Pick<Category, "name" | "slug"> | null;
  city?: Pick<City, "name" | "slug"> | null;
  author?: Pick<Author, "name" | "slug"> | null;
};

/**
 * Mapeia post do banco para o modelo da UI do Norte em Foco
 */
const mapPostData = (data: RemotePost[] | null): Post[] => {
  return (data || []).map((post) => ({
    ...post,
    category: post.category || null,
    city: post.city || null,
    author: post.author || null,
    image_url: post.image_url || null,
  })) as Post[];
};

const sortByPublishedAt = (posts: Post[]): Post[] => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });
};

const mergeWithLocalPosts = (remotePosts: Post[]): Post[] => {
  const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
  const uniqueLocalPosts = localPosts.filter((post) => !remoteSlugs.has(post.slug));
  return sortByPublishedAt([...remotePosts, ...uniqueLocalPosts]);
};

export const fetchNews = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `,
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return sortByPublishedAt(localPosts);
  }

  return mergeWithLocalPosts(mapPostData(data));
};

export const fetchFeaturedPost = async (): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `,
    )
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching featured post:", error);
    return sortByPublishedAt(localPosts.filter((post) => post.is_featured))[0] || null;
  }

  return (
    mergeWithLocalPosts(data ? mapPostData([data]) : []).find((post) => post.is_featured) || null
  );
};

export const fetchUrgentPost = async (): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `,
    )
    .eq("is_urgent", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching urgent post:", error);
    return sortByPublishedAt(localPosts.filter((post) => post.is_urgent))[0] || null;
  }

  return (
    mergeWithLocalPosts(data ? mapPostData([data]) : []).find((post) => post.is_urgent) || null
  );
};

export const fetchNewsByCategory = async (categorySlug: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories!inner(name, slug),
      city:cities(name, slug)
    `,
    )
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`Error fetching news for category ${categorySlug}:`, error);
    return sortByPublishedAt(localPosts.filter((post) => post.category?.slug === categorySlug));
  }

  const filteredLocalPosts = localPosts.filter((post) => post.category?.slug === categorySlug);
  const remotePosts = mapPostData(data);
  const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
  return sortByPublishedAt([
    ...remotePosts,
    ...filteredLocalPosts.filter((post) => !remoteSlugs.has(post.slug)),
  ]);
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching post by slug \${slug}:`, error);
    return localPosts.find((post) => post.slug === slug) || null;
  }

  return data
    ? mapPostData([data])[0] || null
    : localPosts.find((post) => post.slug === slug) || null;
};

export const fetchRelatedPosts = async (postId: string, categoryId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(name, slug),
      city:cities(name, slug)
    `,
    )
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
