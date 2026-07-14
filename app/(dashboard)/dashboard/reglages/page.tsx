import { getSettings } from "@/lib/settings";
import { ReglagesView } from "@/components/dashboard/ReglagesView";

export const dynamic = "force-dynamic";

export default async function ReglagesPage() {
  const settings = await getSettings();
  return <ReglagesView settings={settings} />;
}
