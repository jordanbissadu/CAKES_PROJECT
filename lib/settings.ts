import { createClient } from "@/lib/supabase/server";

export interface Settings {
  phone_pretty: string;
  phone_tel: string;
  tiktok: string;
  email: string;
  address: string;
  hours: string;
  currency: string;
  hero_title: string; // may contain newlines
  hero_accent: string;
  hero_subtitle: string;
  order_intro: string;
  footer_tagline: string;
}

/** Defaults — identical to the current storefront copy. */
export const DEFAULT_SETTINGS: Settings = {
  phone_pretty: "+228 96 628 864",
  phone_tel: "+22896628864",
  tiktok: "IDI'S CAKE",
  email: "",
  address: "",
  hours: "Commandes à passer à l'avance",
  currency: "F",
  hero_title: "Des douceurs\nfaites main,",
  hero_accent: "rien que pour toi.",
  hero_subtitle:
    "Gâteaux, tartes et petites merveilles préparés chaque jour avec des ingrédients choisis et beaucoup de cœur, à IDI's Cakes.",
  order_intro:
    "Dis-nous ce dont tu rêves — le nom à écrire, le goût, la crème — et pour quand. On te répond vite avec un devis tout doux.",
  footer_tagline: "La pâtisserie faite avec le cœur",
};

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Site settings merged over defaults. Never throws — falls back to defaults. */
export async function getSettings(): Promise<Settings> {
  if (!isConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    // Merge so missing/empty columns keep sensible defaults.
    const merged: Settings = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
      const v = (data as Record<string, unknown>)[key];
      if (typeof v === "string" && v.length > 0) merged[key] = v;
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
