"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validation";

export interface ActionResult {
  ok: boolean;
  message?: string;
}

export async function updateSettings(input: unknown): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Champs invalides.",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Non authentifié." };

  const { error } = await supabase
    .from("settings")
    .update({ ...parsed.data, id: "main" })
    .eq("id", "main");
  if (error) return { ok: false, message: "Échec de l'enregistrement." };

  // Settings affect both the storefront and the dashboard.
  revalidatePath("/", "layout");
  return { ok: true };
}
