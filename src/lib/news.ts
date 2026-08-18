import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { getAllLocalPosts, getLocalPostBySlug } from "@/lib/local-posts";

// Tipagens baseadas no schema esperado para Norte em Foco
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
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });
};

const mergeWithLocalPosts = (remotePosts: Post[]): Post[] => {
  const local = getAllLocalPosts();
  const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
  const uniqueLocal = local.filter((post) => !remoteSlugs.has(post.slug));
  return sortByPublishedAt([...remotePosts, ...uniqueLocal]);
};

export const fetchNews = async (): Promise<Post[]> => {
  try {
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
      return getAllLocalPosts();
    }

    return mergeWithLocalPosts(mapPostData(data));
  } catch (e) {
    console.error("fetchNews failed:", e);
    return getAllLocalPosts();
  }
};

export const fetchFeaturedPost = async (): Promise<Post | null> => {
  try {
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
      return getAllLocalPosts().find((p) => p.is_featured) || null;
    }

    return (
      mergeWithLocalPosts(data ? mapPostData([data]) : []).find((post) => post.is_featured) || null
    );
  } catch {
    return getAllLocalPosts().find((p) => p.is_featured) || null;
  }
};

export const fetchUrgentPost = async (): Promise<Post | null> => {
  try {
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
      return getAllLocalPosts().find((p) => p.is_urgent) || null;
    }

    return (
      mergeWithLocalPosts(data ? mapPostData([data]) : []).find((post) => post.is_urgent) || null
    );
  } catch {
    return getAllLocalPosts().find((p) => p.is_urgent) || null;
  }
};

export const fetchNewsByCategory = async (categorySlug: string): Promise<Post[]> => {
  try {
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
      return getAllLocalPosts().filter((post) => post.category?.slug === categorySlug);
    }

    const remotePosts = mapPostData(data);
    const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
    const filteredLocal = getAllLocalPosts().filter(
      (post) => post.category?.slug === categorySlug && !remoteSlugs.has(post.slug),
    );
    return sortByPublishedAt([...remotePosts, ...filteredLocal]);
  } catch {
    return getAllLocalPosts().filter((post) => post.category?.slug === categorySlug);
  }
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
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
      console.error(`Error fetching post by slug ${slug}:`, error);
      return getLocalPostBySlug(slug);
    }

    return data ? mapPostData([data])[0] || null : getLocalPostBySlug(slug);
  } catch {
    return getLocalPostBySlug(slug);
  }
};

export const fetchRelatedPosts = async (postId: string, categoryId: string): Promise<Post[]> => {
  try {
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
      return getAllLocalPosts()
        .filter((p) => p.category_id === categoryId && p.id !== postId)
        .slice(0, 3);
    }

    return mapPostData(data);
  } catch {
    return getAllLocalPosts()
      .filter((p) => p.category_id === categoryId && p.id !== postId)
      .slice(0, 3);
  }
};
