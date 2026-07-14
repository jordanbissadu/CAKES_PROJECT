"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Cake } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { ProductFormValues } from "./ProductFormModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "./PageHeader";
import { ProductFormModal } from "./ProductFormModal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
} from "@/app/(dashboard)/catalogue-actions";

export function ProductsView({ products }: { products: Product[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const gateaux = products.filter((p) => p.category === "gateaux");
  const divers = products.filter((p) => p.category === "divers");

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  const onSave = (values: ProductFormValues) => {
    startTransition(async () => {
      const res = editing
        ? await updateProduct(editing.id, values)
        : await createProduct(values);
      if (res.ok) {
        toast(editing ? "Gâteau mis à jour ✓" : "Gâteau ajouté 🎂");
        setModalOpen(false);
        router.refresh();
      } else {
        toast(res.message ?? "Une erreur est survenue.");
      }
    });
  };

  const onToggle = (p: Product) =>
    startTransition(async () => {
      const res = await toggleProduct(p.id, !p.is_active);
      if (res.ok) router.refresh();
      else toast(res.message ?? "Échec.");
    });

  const onDelete = (p: Product) => {
    if (!confirm(`Supprimer « ${p.name} » ? Cette action est définitive.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(p.id);
      if (res.ok) {
        toast("Gâteau supprimé");
        router.refresh();
      } else toast(res.message ?? "Échec de la suppression.");
    });
  };

  const Row = ({ p }: { p: Product }) => (
    <div className="flex items-center gap-3.5 border-t border-vin/[0.07] px-4 py-3 first:border-t-0 nav:px-5">
      <div className="h-12 w-12 flex-none overflow-hidden rounded-input bg-rose-bonbon-clair">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-rose-mauve">
            <Cake size={20} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[15px] font-bold text-texte">
            {p.name}
          </span>
          {p.badge ? <Badge tone="prune">{p.badge}</Badge> : null}
          {!p.is_active ? (
            <span className="rounded-pill bg-vin/[0.06] px-2 py-0.5 text-[11px] font-bold text-texte-doux">
              Masqué
            </span>
          ) : null}
        </div>
        <div className="truncate text-[13px] text-texte-doux">
          {p.price_label ?? formatPrice(p.base_price)}
          {p.description ? ` · ${p.description}` : ""}
        </div>
      </div>
      <div className="flex flex-none items-center gap-1">
        <button
          onClick={() => onToggle(p)}
          disabled={pending}
          aria-label={p.is_active ? "Masquer" : "Afficher"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-prune hover:bg-rose-bonbon-clair"
        >
          {p.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button
          onClick={() => openEdit(p)}
          aria-label="Modifier"
          className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-prune hover:bg-rose-bonbon-clair"
        >
          <Pencil size={17} />
        </button>
        <button
          onClick={() => onDelete(p)}
          disabled={pending}
          aria-label="Supprimer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-framboise hover:bg-rose-bonbon-clair"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );

  const Group = ({ title, items }: { title: string; items: Product[] }) => (
    <div className="mb-6">
      <h2 className="mb-2.5 px-1 font-display text-[19px] font-bold text-vin">
        {title}{" "}
        <span className="text-[15px] font-semibold text-texte-doux">
          ({items.length})
        </span>
      </h2>
      <div className="overflow-hidden rounded-card bg-blanc shadow-card">
        {items.length ? (
          items.map((p) => <Row key={p.id} p={p} />)
        ) : (
          <div className="px-5 py-10 text-center text-sm text-texte-doux">
            Aucun élément. Clique sur « Nouveau gâteau » pour en ajouter.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-28 pt-6 nav:px-8">
      <PageHeader
        eyebrow="✦ CATALOGUE"
        title="Nos gâteaux"
        subtitle="Gère les gâteaux et gourmandises de ta carte."
        actions={
          <Button onClick={openNew}>
            <Plus size={18} strokeWidth={2.2} />
            Nouveau gâteau
          </Button>
        }
      />

      <Group title="Gâteaux" items={gateaux} />
      <Group title="Divers" items={divers} />

      <ProductFormModal
        open={modalOpen}
        product={editing}
        pending={pending}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />
    </main>
  );
}
