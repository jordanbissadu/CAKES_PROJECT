"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { todayISO } from "@/lib/format";

export interface NewOrderValues {
  customer_name: string;
  cake: string;
  mode: string;
  fulfillment_date: string;
}

export function NewOrderModal({
  open,
  pending,
  onClose,
  onCreate,
}: {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onCreate: (values: NewOrderValues) => void;
}) {
  const [values, setValues] = useState<NewOrderValues>({
    customer_name: "",
    cake: "",
    mode: "retrait",
    fulfillment_date: todayISO(),
  });

  const set = (patch: Partial<NewOrderValues>) =>
    setValues((v) => ({ ...v, ...patch }));

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between px-6 pb-1 pt-5">
        <div className="font-display text-[23px] font-bold text-vin">
          Nouvelle commande
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune hover:bg-rose-bonbon-clair"
        >
          <X size={20} strokeWidth={2.2} />
        </button>
      </div>
      <p className="mx-6 mb-4 text-sm text-texte-doux">
        On l&apos;ajoute direct à la file « À préparer ». 🎂
      </p>

      <div className="flex flex-col gap-3.5 px-6 pb-5">
        <Field label="Client" htmlFor="no_client">
          <Input
            id="no_client"
            placeholder="Nom du client"
            value={values.customer_name}
            onChange={(e) => set({ customer_name: e.target.value })}
          />
        </Field>
        <Field label="Gâteau" htmlFor="no_cake">
          <Input
            id="no_cake"
            placeholder="Ex. Fraisier, Number cake…"
            value={values.cake}
            onChange={(e) => set({ cake: e.target.value })}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[150px] flex-1">
            <Field label="Mode" htmlFor="no_mode">
              <Select
                id="no_mode"
                value={values.mode}
                onChange={(e) => set({ mode: e.target.value })}
              >
                <option value="retrait">Retrait</option>
                <option value="livraison">Livraison</option>
              </Select>
            </Field>
          </div>
          <div className="min-w-[150px] flex-1">
            <Field label="Date de retrait" htmlFor="no_date">
              <Input
                id="no_date"
                type="date"
                value={values.fulfillment_date}
                onChange={(e) => set({ fulfillment_date: e.target.value })}
              />
            </Field>
          </div>
        </div>
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
            onClick={() => onCreate(values)}
          >
            {pending ? "Création…" : "Créer la commande"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
