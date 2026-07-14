"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/settings";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "./PageHeader";
import { updateSettings } from "@/app/(dashboard)/settings-actions";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 rounded-card bg-blanc p-5 shadow-card nav:p-6">
      <h2 className="font-display text-[19px] font-bold text-vin">{title}</h2>
      {description ? (
        <p className="mt-0.5 text-[13px] text-texte-doux">{description}</p>
      ) : null}
      <div className="mt-4 flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

export function ReglagesView({ settings }: { settings: Settings }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [v, setV] = useState<Settings>(settings);

  const set = (patch: Partial<Settings>) => setV((s) => ({ ...s, ...patch }));

  const onSave = () => {
    startTransition(async () => {
      const res = await updateSettings(v);
      if (res.ok) {
        toast("Réglages enregistrés ✓");
        router.refresh();
      } else {
        toast(res.message ?? "Une erreur est survenue.");
      }
    });
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-28 pt-6 nav:px-8">
      <PageHeader
        eyebrow="✦ ATELIER"
        title="Réglages"
        subtitle="Coordonnées, horaires, devise et contenu de la vitrine."
        actions={
          <Button onClick={onSave} disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        }
      />

      <div className="max-w-[720px]">
        <Section
          title="Coordonnées"
          description="Utilisées sur la vitrine (nav, contact, pied de page)."
        >
          <div className="grid grid-cols-1 gap-3.5 min-[520px]:grid-cols-2">
            <Field label="Téléphone (affiché)" htmlFor="s_phone">
              <Input
                id="s_phone"
                value={v.phone_pretty}
                onChange={(e) => set({ phone_pretty: e.target.value })}
                placeholder="+228 96 628 864"
              />
            </Field>
            <Field label="Téléphone (lien tel:)" htmlFor="s_tel">
              <Input
                id="s_tel"
                value={v.phone_tel}
                onChange={(e) => set({ phone_tel: e.target.value })}
                placeholder="+22896628864"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-3.5 min-[520px]:grid-cols-2">
            <Field label="TikTok" htmlFor="s_tiktok">
              <Input
                id="s_tiktok"
                value={v.tiktok}
                onChange={(e) => set({ tiktok: e.target.value })}
                placeholder="IDI'S CAKE"
              />
            </Field>
            <Field label="E-mail (optionnel)" htmlFor="s_email">
              <Input
                id="s_email"
                type="email"
                value={v.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="contact@…"
              />
            </Field>
          </div>
          <Field label="Adresse (optionnel)" htmlFor="s_address">
            <Input
              id="s_address"
              value={v.address}
              onChange={(e) => set({ address: e.target.value })}
              placeholder="Quartier, ville…"
            />
          </Field>
        </Section>

        <Section
          title="Horaires"
          description="Affichés dans la section contact de la vitrine."
        >
          <Field label="Horaires / disponibilité" htmlFor="s_hours">
            <Textarea
              id="s_hours"
              value={v.hours}
              onChange={(e) => set({ hours: e.target.value })}
              placeholder={"Lun–Sam : 9h–19h\nDim : sur commande"}
            />
          </Field>
        </Section>

        <Section
          title="Devise"
          description="Symbole utilisé pour les montants dans le tableau de bord."
        >
          <div className="max-w-[200px]">
            <Field label="Devise" htmlFor="s_currency">
              <Input
                id="s_currency"
                value={v.currency}
                onChange={(e) => set({ currency: e.target.value })}
                placeholder="F"
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Contenu de la vitrine"
          description="Textes de la page d'accueil. Laisse vide pour garder la valeur par défaut."
        >
          <Field label="Titre du héro" htmlFor="s_htitle">
            <Textarea
              id="s_htitle"
              value={v.hero_title}
              onChange={(e) => set({ hero_title: e.target.value })}
              placeholder={"Des douceurs\nfaites main,"}
            />
          </Field>
          <Field label="Ligne mise en avant (rose)" htmlFor="s_haccent">
            <Input
              id="s_haccent"
              value={v.hero_accent}
              onChange={(e) => set({ hero_accent: e.target.value })}
              placeholder="rien que pour toi."
            />
          </Field>
          <Field label="Sous-titre du héro" htmlFor="s_hsub">
            <Textarea
              id="s_hsub"
              value={v.hero_subtitle}
              onChange={(e) => set({ hero_subtitle: e.target.value })}
            />
          </Field>
          <Field label="Intro du bloc commande" htmlFor="s_ointro">
            <Textarea
              id="s_ointro"
              value={v.order_intro}
              onChange={(e) => set({ order_intro: e.target.value })}
            />
          </Field>
          <Field label="Signature (pied de page)" htmlFor="s_tag">
            <Input
              id="s_tag"
              value={v.footer_tagline}
              onChange={(e) => set({ footer_tagline: e.target.value })}
              placeholder="La pâtisserie faite avec le cœur"
            />
          </Field>
        </Section>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer les réglages"}
          </Button>
        </div>
      </div>
    </main>
  );
}
