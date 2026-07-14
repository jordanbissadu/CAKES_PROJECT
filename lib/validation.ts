import { z } from "zod";

const optionalStr = z.string().trim().max(500).optional().or(z.literal(""));

/** Public order-request form (storefront). Kept permissive but safe. */
export const orderRequestSchema = z.object({
  customer_name: z.string().trim().min(2, "Indique ton nom.").max(120),
  customer_phone: z
    .string()
    .trim()
    .min(6, "Indique un numéro de téléphone.")
    .max(40),
  order_type: z.string().trim().min(1, "Choisis un type de gâteau.").max(160),
  fulfillment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
    .optional()
    .or(z.literal("")),
  cake_message: optionalStr,
  sucre: optionalStr,
  creme: optionalStr,
  details: z.string().trim().max(1500).optional().or(z.literal("")),
  model_ref: optionalStr,
  model_name: optionalStr,
  // Honeypot — must stay empty (anti-spam).
  company: z.string().max(0).optional(),
});

export type OrderRequestInput = z.infer<typeof orderRequestSchema>;

/** Manual order creation from the dashboard "Nouvelle commande" modal. */
export const newOrderSchema = z.object({
  customer_name: z.string().trim().min(2, "Nom du client requis.").max(120),
  cake: z.string().trim().min(1, "Nom du gâteau requis.").max(160),
  mode: z.enum(["retrait", "livraison"]),
  fulfillment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
});

export type NewOrderInput = z.infer<typeof newOrderSchema>;

/** Catalogue product create/update (dashboard). */
export const productSchema = z.object({
  name: z.string().trim().min(2, "Nom requis.").max(160),
  category: z.enum(["gateaux", "divers"]),
  price_label: z.string().trim().max(60).optional().or(z.literal("")),
  base_price: z
    .union([z.coerce.number().int().min(0).max(100_000_000), z.literal("")])
    .optional(),
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  flavors: z.string().trim().max(300).optional().or(z.literal("")),
  image_url: z.string().trim().max(500).url("URL invalide.").optional().or(z.literal("")),
  is_active: z.boolean().optional(),
  sort_order: z
    .union([z.coerce.number().int().min(0).max(100000), z.literal("")])
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

/** Site settings (dashboard Réglages). */
export const settingsSchema = z.object({
  phone_pretty: z.string().trim().min(1, "Numéro requis.").max(60),
  phone_tel: z.string().trim().min(1, "Numéro requis.").max(40),
  tiktok: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().max(160).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  hours: z.string().trim().max(400).optional().or(z.literal("")),
  currency: z.string().trim().min(1, "Devise requise.").max(12),
  hero_title: z.string().trim().min(1).max(200),
  hero_accent: z.string().trim().max(120).optional().or(z.literal("")),
  hero_subtitle: z.string().trim().min(1).max(600),
  order_intro: z.string().trim().min(1).max(600),
  footer_tagline: z.string().trim().max(160).optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
