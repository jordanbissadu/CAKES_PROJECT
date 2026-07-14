# IDI's Cakes — SaaS

Vitrine publique + dashboard d'atelier pour la pâtisserie artisanale **IDI's Cakes**.
Next.js 14 (App Router) · Supabase (Postgres + Auth) · Tailwind CSS · déploiement Vercel.

## Ce qui est inclus (Phase 1 / MVP)

- **Vitrine publique** (`/`) — hero, spécialités, carte, formulaire de demande de commande,
  pied de page, barre d'action flottante mobile. Mobile-first, aux couleurs du design system.
- **Réception de commandes** — le formulaire crée une commande en statut `nouvelle`
  (paiement hors-ligne, pas de paiement en ligne).
- **Suivi de commande public** (`/suivi`) — le client entre son n° de commande + téléphone
  (secret léger, anti-énumération) et voit l'avancement (Reçue → En préparation → Prête).
  Aucun compte / mot de passe.
- **Dashboard d'atelier** (`/dashboard`, protégé) :
  - **Commandes** — KPIs, vues **Liste** et **Préparation (kanban)**, recherche/filtres,
    fiche détaillée avec timeline de statut, création manuelle de commande,
    **export CSV** des commandes filtrées, et contact rapide **WhatsApp / appel** du client.
  - **Nos gâteaux** — CRUD du catalogue (ajout/édition/suppression, visible/masqué, photo par URL).
  - **Clients** — carnet dérivé des commandes (regroupés par téléphone), historique par client.
  - **Calendrier** — vue mensuelle des commandes par date de retrait/livraison.
  - **Réglages** — coordonnées, horaires, devise et contenu éditable de la vitrine
    (titre du héro, sous-titre, intro commande, signature). La vitrine lit ces réglages,
    avec repli sur les valeurs par défaut.

## Prérequis

- Node 18+ (testé sur Node 22)
- Un projet [Supabase](https://supabase.com)

## Configuration

1. **Variables d'environnement** — copie `.env.local.example` en `.env.local` et remplis :

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # serveur uniquement, ne JAMAIS exposer
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Base de données** — dans le SQL editor de Supabase, exécute dans l'ordre :
   - `supabase/migrations/0001_init.sql` (tables `products` + `orders`, RLS, séquence de n°)
   - `supabase/migrations/0002_product_image.sql` (colonne `image_url` pour le catalogue)
   - `supabase/migrations/0003_settings.sql` (réglages du site : coordonnées, horaires, devise, contenu vitrine)
   - `supabase/seed.sql` (catalogue de départ)

3. **Compte admin** — crée l'utilisateur du personnel dans Supabase
   (Authentication → Users → *Add user* → email + mot de passe). Il n'y a pas
   d'inscription publique : seuls ces comptes accèdent au dashboard.

## Lancer en local

```bash
npm install
npm run dev
```

- Vitrine : http://localhost:3000
- Dashboard : http://localhost:3000/dashboard → redirige vers `/login`

> Sans Supabase configuré, la vitrine s'affiche quand même (catalogue de secours), mais
> l'envoi du formulaire et le dashboard nécessitent les variables d'environnement.

## Notifications de commande (optionnel)

À chaque nouvelle commande passée depuis la vitrine, un e-mail peut être envoyé à
la pâtisserie via [Resend](https://resend.com). C'est **facultatif** : sans configuration,
les commandes fonctionnent normalement, sans e-mail.

Pour activer, renseigne dans `.env.local` : `RESEND_API_KEY`, `ORDER_FROM_EMAIL`
(expéditeur vérifié chez Resend) et `ORDER_NOTIFY_EMAIL` (destinataire — sinon l'e-mail
défini dans **Réglages** est utilisé).

## Déploiement (Vercel)

- **Root Directory** du projet Vercel = `web/`.
- Renseigne les mêmes variables d'environnement dans les *Project Settings → Environment Variables*.
- `SUPABASE_SERVICE_ROLE_KEY` : variable **serveur** (non préfixée `NEXT_PUBLIC_`).

## Architecture

```
app/
  (marketing)/         Vitrine publique + Server Action de commande
  (dashboard)/         Dashboard protégé (layout garde la session)
  login/               Connexion admin (Supabase Auth)
components/ui/         Primitives (Button, Card, Badge, Field, Drawer, Modal, Toast…)
components/marketing/  Sections de la vitrine
components/dashboard/  Sidebar, TopBar, tableau, kanban, drawer, modal…
lib/                   Helpers Supabase, format, modèle de commande, validation Zod
supabase/              Migrations SQL + seed
```

Modèle de commande et transitions de statut : `lib/orders.ts`
(`nouvelle → apreparer → enpreparation → prete`, + `annulee`).
