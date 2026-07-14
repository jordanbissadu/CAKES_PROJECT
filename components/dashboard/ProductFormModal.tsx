"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import type { Product } from "@/lib/products";

export type ProductFormValues = {
  name: string;
  category: "gateaux" | "divers";
  price_label: string;
  base_price: string;
  badge: string;
  description: string;
  flavors: string;
  image_url: string;
  is_active: boolean;
  sort_order: string;
};

function fromProduct(p: Product | null): ProductFormValues {
  return {
    name: p?.name ?? "",
    category: p?.category ?? "gateaux",
    price_label: p?.price_label ?? "",
    base_price: p?.base_price != null ? String(p.base_price) : "",
    badge: p?.badge ?? "",
    description: p?.description ?? "",
    flavors: p?.flavors?.join(", ") ?? "",
    image_url: p?.image_url ?? "",
    is_active: p?.is_active ?? true,
    sort_order: p?.sort_order != null ? String(p.sort_order) : "0",
  };
}

export function ProductFormModal({
  open,
  product,
  pending,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  pending: boolean;
  onClose: () => void;
  onSave: (values: ProductFormValues) => void;
}) {
  const [v, setV] = useState<ProductFormValues>(fromProduct(product));
  // Re-seed when the target product changes.
  const [seededFor, setSeededFor] = useState<string | null>(product?.id ?? null);
  if (open && seededFor !== (product?.id ?? "new")) {
    setV(fromProduct(product));
    setSeededFor(product?.id ?? "new");
  }

  const set = (patch: Partial<ProductFormValues>) =>
    setV((s) => ({ ...s, ...patch }));

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between px-6 pb-1 pt-5">
        <div className="font-display text-[23px] font-bold text-vin">
          {product ? "Modifier le gâteau" : "Nouveau gâteau"}
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune hover:bg-rose-bonbon-clair"
        >
          <X size={20} strokeWidth={2.2} />
        </button>
      </div>

      <div className="flex flex-col gap-3.5 px-6 pb-5 pt-3">
        <Field label="Nom" htmlFor="p_name">
          <Input
            id="p_name"
            value={v.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Ex. Gâteau anniversaire — 6 parts"
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[150px] flex-1">
            <Field label="Catégorie" htmlFor="p_cat">
              <Select
                id="p_cat"
                value={v.category}
                onChange={(e) =>
                  set({ category: e.target.value as "gateaux" | "divers" })
                }
              >
                <option value="gateaux">Gâteaux</option>
                <option value="divers">Divers</option>
              </Select>
            </Field>
          </div>
          <div className="min-w-[150px] flex-1">
            <Field label="Ordre d'affichage" htmlFor="p_sort">
              <Input
                id="p_sort"
                type="number"
                inputMode="numeric"
                value={v.sort_order}
                onChange={(e) => set({ sort_order: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[150px] flex-1">
            <Field label="Libellé de prix" htmlFor="p_label">
              <Input
                id="p_label"
                value={v.price_label}
                onChange={(e) => set({ price_label: e.target.value })}
                placeholder="dès 6 000F"
              />
            </Field>
          </div>
          <div className="min-w-[150px] flex-1">
            <Field label="Prix (F, nombre)" htmlFor="p_price">
              <Input
                id="p_price"
                type="number"
                inputMode="numeric"
                value={v.base_price}
                onChange={(e) => set({ base_price: e.target.value })}
                placeholder="6000"
              />
            </Field>
          </div>
        </div>

        <Field label="Badge (optionnel)" htmlFor="p_badge">
          <Input
            id="p_badge"
            value={v.badge}
            onChange={(e) => set({ badge: e.target.value })}
            placeholder="Best-seller, Nouveau…"
          />
        </Field>

        <Field label="Description" htmlFor="p_desc">
          <Textarea
            id="p_desc"
            value={v.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Saveurs, occasions…"
          />
        </Field>

        <Field label="Saveurs (séparées par des virgules)" htmlFor="p_flav">
          <Input
            id="p_flav"
            value={v.flavors}
            onChange={(e) => set({ flavors: e.target.value })}
            placeholder="Vanille, Chocolat, Fraise"
          />
        </Field>

        <Field label="URL de la photo (optionnel)" htmlFor="p_img">
          <Input
            id="p_img"
            type="url"
            inputMode="url"
            value={v.image_url}
            onChange={(e) => set({ image_url: e.target.value })}
            placeholder="https://…/gateau.jpg"
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-semibold text-texte">
          <input
            type="checkbox"
            checked={v.is_active}
            onChange={(e) => set({ is_active: e.target.checked })}
            className="h-5 w-5 accent-framboise"
          />
          Visible dans le catalogue
        </label>
      </div>

      <div
        className="flex gap-2.5 px-6"
        style={{ paddingBottom: "calc(22px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onClose} disabled={pending}>
            Annuler
          </Button>
        </div>
        <div className="flex-[1.4]">
          <Button
            fullWidth
            disabled={pending}
            onClick={() =>
              onSave({
                name: v.name,
                category: v.category,
                price_label: v.price_label,
                base_price: v.base_price,
                badge: v.badge,
                description: v.description,
                flavors: v.flavors,
                image_url: v.image_url,
                is_active: v.is_active,
                sort_order: v.sort_order,
              })
            }
          >
            {pending ? "Enregistrement…" : product ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
