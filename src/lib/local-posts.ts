import type { Post } from "@/lib/news";
import { localPosts as seedPosts } from "@/lib/local-news";

const STORAGE_KEY = "norte-em-foco-admin-posts";

/**
 * Posts criados/editados pelo painel admin (localStorage).
 * Usado enquanto o Supabase não está com RLS/schema corretos.
 */
export function getStoredPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredPosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/** Todos os posts locais (seed + criados no admin) */
export function getAllLocalPosts(): Post[] {
  const stored = getStoredPosts();
  const storedIds = new Set(stored.map((p) => p.id));
  const uniqueSeed = seedPosts.filter((p) => !storedIds.has(p.id));
  return [...stored, ...uniqueSeed].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });
}

export function getLocalPostById(id: string): Post | null {
  return getAllLocalPosts().find((p) => p.id === id) || null;
}

export function getLocalPostBySlug(slug: string): Post | null {
  return getAllLocalPosts().find((p) => p.slug === slug) || null;
}

export function saveLocalPost(post: Post): Post {
  const stored = getStoredPosts();
  const index = stored.findIndex((p) => p.id === post.id);

  const now = new Date().toISOString();
  const toSave: Post = {
    ...post,
    updated_at: now,
    created_at: post.created_at || now,
  };

  if (index >= 0) {
    stored[index] = toSave;
  } else {
    stored.unshift(toSave);
  }

  saveStoredPosts(stored);
  return toSave;
}

export function deleteLocalPost(id: string): boolean {
  const stored = getStoredPosts();
  const next = stored.filter((p) => p.id !== id);
  if (next.length === stored.length) return false;
  saveStoredPosts(next);
  return true;
}

/** Gera um id simples e único para posts locais */
export function generateLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
