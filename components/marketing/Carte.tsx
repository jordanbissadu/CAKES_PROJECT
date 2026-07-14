import { MENU_CAKES, MENU_DIVERS } from "@/lib/gallery";

function Row({
  name,
  price,
  desc,
}: {
  name: string;
  price: string;
  desc?: string;
}) {
  return (
    <div className="border-b border-vin/[0.09] py-[15px] last:border-b-0">
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-texte">{name}</span>
        <span className="mt-[-3px] flex-1 border-b-2 border-dotted border-prune/35" />
        <span className="whitespace-nowrap font-display text-base font-bold text-vin">
          {price}
        </span>
      </div>
      {desc ? (
        <div className="mt-[3px] text-[13px] text-texte-doux">{desc}</div>
      ) : null}
    </div>
  );
}

export function Carte() {
  return (
    <section
      id="carte"
      className="mx-auto max-w-container px-5 py-16 nav:px-6 nav:py-20"
    >
      <div className="mx-auto mb-12 max-w-[36em] text-center">
        <span className="mb-3.5 block text-[13px] font-bold uppercase tracking-[2px] text-rose-mauve">
          Tout est fait maison
        </span>
        <h2 className="font-display text-[30px] font-bold leading-[1.1] text-vin nav:text-[38px]">
          Notre carte
        </h2>
        <p className="mt-3 text-[17px] leading-relaxed text-texte-doux">
          Des gâteaux pour chaque occasion et quelques petites gourmandises
          salées et sucrées.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 nav:grid-cols-[1.5fr_1fr] nav:gap-11">
        <div>
          <h3 className="mb-1.5 border-b-2 border-rose-bonbon pb-2.5 font-display text-2xl font-bold text-vin">
            Gâteaux
          </h3>
          {MENU_CAKES.map((m) => (
            <Row key={m.name} name={m.name} price={m.price} desc={m.desc} />
          ))}
        </div>

        <aside className="rounded-[22px] bg-creme px-[26px] pb-3 pt-[26px]">
          <h3 className="mb-1.5 border-b-2 border-[#EAD9B8] pb-2.5 font-display text-2xl font-bold text-vin">
            Divers
          </h3>
          {MENU_DIVERS.map((m) => (
            <Row key={m.name} name={m.name} price={m.price} />
          ))}
        </aside>
      </div>
    </section>
  );
}
