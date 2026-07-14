import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { TrackForm } from "@/components/marketing/TrackForm";

export const metadata: Metadata = {
  title: "Suivre ma commande — IDI's Cakes",
  description: "Suis l'état de ta commande IDI's Cakes avec ton numéro et ton téléphone.",
};

export default async function SuiviPage() {
  const settings = await getSettings();

  return (
    <main
      style={{
        backgroundImage:
          "radial-gradient(circle at 85% -10%, #FFE6EC 0%, transparent 45%), radial-gradient(circle at 0% 110%, #FFF1DE 0%, transparent 40%)",
      }}
    >
      <Nav settings={settings} />
      <section className="mx-auto min-h-[70vh] max-w-[520px] px-5 py-14 nav:py-20">
        <div className="mb-8 text-center">
          <span className="mb-3 block text-[13px] font-bold uppercase tracking-[2px] text-rose-mauve">
            Suivi de commande
          </span>
          <h1 className="font-display text-[32px] font-bold leading-[1.1] text-vin nav:text-[40px]">
            Où en est ton gâteau ?
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-texte-doux">
            Entre ton numéro de commande et le téléphone utilisé pour la
            passer — on te montre où on en est.
          </p>
        </div>
        <TrackForm />
      </section>
      <Footer settings={settings} />
    </main>
  );
}
