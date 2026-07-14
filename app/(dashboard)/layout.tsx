import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { ToastProvider } from "@/components/ui/Toast";
import { CurrencyProvider } from "@/components/dashboard/CurrencyContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defence in depth — middleware already guards, but never render staff UI
  // without a confirmed session.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/login");
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const settings = await getSettings();

  return (
    <ToastProvider>
      <CurrencyProvider currency={settings.currency}>
        <div className="flex min-h-screen bg-blush">
          <Sidebar />
          <div className="flex h-screen min-w-0 flex-1 flex-col">{children}</div>
          <MobileBottomNav />
        </div>
      </CurrencyProvider>
    </ToastProvider>
  );
}
