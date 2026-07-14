import { createClient } from "@/lib/supabase/server";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "gateaux" | "divers";
  description: string | null;
  base_price: number | null;
  price_label: string | null;
  badge: string | null;
  flavors: string[] | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

/** kebab-case slug from a product name. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Fallback catalogue mirroring supabase/seed.sql, used when Supabase is not
 * configured yet (local dev / first build) so the storefront always renders.
 */
const PRODUCT_COLS =
  "id,name,slug,category,description,base_price,price_label,badge,flavors,image_url,is_active,sort_order";

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Active products, ordered (public). Returns [] if Supabase is unavailable. */
export async function getProducts(): Promise<Product[]> {
  if (!isConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

/** All products incl. inactive (dashboard catalogue, authenticated). */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLS)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}
