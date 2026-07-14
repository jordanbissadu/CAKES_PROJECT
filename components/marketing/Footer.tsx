import type { Settings } from "@/lib/settings";

export function Footer({ settings }: { settings: Settings }) {
  const bits = [
    settings.footer_tagline,
    settings.phone_pretty,
    settings.tiktok ? `TikTok ${settings.tiktok}` : "",
  ].filter(Boolean);

  return (
    <footer className="bg-vin px-6 py-10 text-center text-[#F3CAD5]">
      <div className="mb-2 font-display text-[22px] font-bold text-white">
        IDI&apos;s Cakes
      </div>
      <p className="text-sm">{bits.join(" · ")}</p>
    </footer>
  );
}
