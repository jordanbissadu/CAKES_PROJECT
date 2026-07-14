import type { Settings } from "@/lib/settings";
import { OrderForm } from "./OrderForm";

function ContactLine({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-[15px]">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white/[0.12] text-lg">
        {icon}
      </span>
      <div className="text-[#F3CAD5]">{children}</div>
    </div>
  );
}

export function Commande({ settings }: { settings: Settings }) {
  return (
    <section
      id="commander"
      className="mx-auto max-w-container px-5 pb-[90px] pt-5 nav:px-6"
    >
      <div className="grid grid-cols-1 items-start gap-8 rounded-[24px] bg-vin p-8 text-blush nav:grid-cols-[1fr_1.05fr] nav:gap-12 nav:rounded-[32px] nav:p-14">
        <div id="contact">
          <h2 className="mb-3.5 font-display text-[30px] font-bold leading-[1.12] text-white nav:text-[34px]">
            Envie d&apos;un gâteau
            <br />
            sur mesure ?
          </h2>
          <p className="mb-7 text-base leading-relaxed text-[#F3CAD5]">
            {settings.order_intro}
          </p>

          <div className="flex flex-col gap-3.5">
            <ContactLine icon="☎">
              Appelle-nous :{" "}
              <a
                href={`tel:${settings.phone_tel}`}
                className="font-bold text-white no-underline"
              >
                {settings.phone_pretty}
              </a>
            </ContactLine>
            {settings.tiktok ? (
              <ContactLine icon="🎵">
                TikTok : <b className="text-white">{settings.tiktok}</b>
              </ContactLine>
            ) : null}
            {settings.hours ? (
              <ContactLine icon="🕑">
                <span className="whitespace-pre-line">{settings.hours}</span>
              </ContactLine>
            ) : null}
            {settings.email ? (
              <ContactLine icon="✉️">
                <b className="text-white">{settings.email}</b>
              </ContactLine>
            ) : null}
            {settings.address ? (
              <ContactLine icon="📍">
                <span className="text-white">{settings.address}</span>
              </ContactLine>
            ) : null}
          </div>
        </div>

        <OrderForm />
      </div>
    </section>
  );
}
