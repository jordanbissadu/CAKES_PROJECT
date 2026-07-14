"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard/commandes";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Identifiants incorrects. Réessaie.");
      setLoading(false);
      return;
    }
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2.5 font-display text-[26px] font-bold text-vin">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-mauve" />
          IDI&apos;s Cakes
        </div>
        <p className="text-[15px] text-texte-doux">Espace atelier — connexion</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 rounded-card bg-blanc p-7 shadow-card"
      >
        <Field label="E-mail" htmlFor="email">
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Mot de passe" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        {error ? (
          <p className="text-[14px] font-semibold text-framboise">{error}</p>
        ) : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-texte-doux">
        <a href="/" className="font-semibold text-prune no-underline">
          ← Retour à la vitrine
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blush px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
