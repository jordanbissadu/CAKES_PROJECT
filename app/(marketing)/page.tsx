import { getSettings } from "@/lib/settings";
import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Gallery } from "@/components/marketing/Gallery";
import { Divider } from "@/components/marketing/Divider";
import { Carte } from "@/components/marketing/Carte";
import { Commande } from "@/components/marketing/Commande";
import { Footer } from "@/components/marketing/Footer";
import { OrderModelProvider } from "@/components/marketing/OrderModelContext";

export default async function LandingPage() {
  const settings = await getSettings();

  return (
    <main
      style={{
        backgroundImage:
          "radial-gradient(circle at 85% -10%, #FFE6EC 0%, transparent 45%), radial-gradient(circle at 0% 110%, #FFF1DE 0%, transparent 40%)",
      }}
    >
      <Nav settings={settings} />
      <Hero settings={settings} />
      <OrderModelProvider>
        <Gallery />
        <Divider />
        <Carte />
        <Divider />
        <Commande settings={settings} />
      </OrderModelProvider>
      <Footer settings={settings} />
    </main>
  );
}
