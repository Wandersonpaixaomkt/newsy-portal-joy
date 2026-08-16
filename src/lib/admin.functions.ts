import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getAdminProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching admin profile:", error);
      return null;
    }

    return data;
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Unauthorized");

    // Using existing posts table for now
    const { count: publishedCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null);

    const { count: draftCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .is("published_at", null);

    const { count: categoriesCount } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    const { count: authorsCount } = await supabase
      .from("authors")
      .select("*", { count: "exact", head: true });

    return {
      published: publishedCount || 0,
      drafts: draftCount || 0,
      categories: categoriesCount || 0,
      authors: authorsCount || 0,
    };
  });
