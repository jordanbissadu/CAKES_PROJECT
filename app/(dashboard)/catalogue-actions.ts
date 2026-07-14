"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/products";
import { productSchema, type ProductInput } from "@/lib/validation";

export interface ActionResult {
  ok: boolean;
  message?: string;
}

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  return supabase;
}

function toRow(input: ProductInput) {
  const flavors = (input.flavors ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  return {
    name: input.name,
    category: input.category,
    price_label: input.price_label || null,
    base_price:
      input.base_price === "" || input.base_price == null
        ? null
        : Number(input.base_price),
    badge: input.badge || null,
    description: input.description || null,
    flavors: flavors.length ? flavors : null,
    image_url: input.image_url || null,
    is_active: input.is_active ?? true,
    sort_order:
      input.sort_order === "" || input.sort_order == null
        ? 0
        : Number(input.sort_order),
  };
}

export async function createProduct(input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await requireUser();
  const row = toRow(parsed.data);
  const slug = `${slugify(row.name)}-${Date.now().toString(36)}`;
  const { error } = await supabase.from("products").insert({ ...row, slug });
  if (error) return { ok: false, message: "Échec de la création." };

  revalidatePath("/dashboard/gateaux");
  return { ok: true };
}

export async function updateProduct(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const supabase = await requireUser();
  const { error } = await supabase
    .from("products")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, message: "Échec de la mise à jour." };

  revalidatePath("/dashboard/gateaux");
  return { ok: true };
}

export async function toggleProduct(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { ok: false, message: "Échec." };

  revalidatePath("/dashboard/gateaux");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await requireUser();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: "Échec de la suppression." };

  revalidatePath("/dashboard/gateaux");
  return { ok: true };
}
