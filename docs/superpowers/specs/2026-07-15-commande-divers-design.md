# Design — Commande des « divers »

**Date :** 2026-07-15
**Statut :** validé (implémentation directe)

## Problème

Sur la vitrine, les articles « divers » (Samoussa, Mini pizza, Crêpes nature,
Crêpe chocolat) sont affichés dans la Carte mais **ne sont pas commandables** :
seul le flux gâteau possède un bouton « Commander » qui pré-remplit le formulaire.

## Décision

Réutiliser le formulaire de commande existant, la même Server Action et la même
table `orders`. On adapte le formulaire lorsqu'un « divers » est sélectionné.
Granularité choisie : **1 type d'article par demande + quantité** (calqué sur le
flux gâteau ; pas de panier multi-articles).

## Portée (4 fichiers)

1. **`lib/validation.ts`** — `orderRequestSchema` gagne :
   - `order_kind: z.enum(["cake","divers"]).optional()` (défaut : cake)
   - `quantity: z.union([z.coerce.number().int().min(1).max(1000), z.literal("")]).optional()`

2. **`components/marketing/OrderModelContext.tsx`** — ajoute une sélection divers :
   - `selectedDivers: { name: string; price: string } | null`
   - `selectDivers(item)` : mémorise l'article, vide la sélection gâteau, scrolle vers `#commander`
   - `selectCake` vide `selectedDivers` (exclusivité mutuelle) ; `clearModel` vide les deux

3. **`components/marketing/Carte.tsx`** — chaque ligne de divers reçoit un bouton
   « Commander » via un mini-composant client `DiversRow`. Les lignes gâteaux
   restent statiques (rendu serveur).

4. **`components/marketing/OrderForm.tsx`** — variante divers quand `selectedDivers` ≠ null :
   - Puce « Article : <nom> — <prix> » avec × pour retirer
   - Champ **Quantité** (nombre, défaut 1)
   - Masque : Type de gâteau, Message sur le gâteau, Sucre, Crème
   - Garde : Nom, Téléphone, Date souhaitée, Autres détails
   - Champs cachés : `order_kind="divers"`, `order_type="<nom>"`
   - Flux gâteau inchangé, avec `order_kind="cake"` caché en plus

5. **`app/(marketing)/actions.ts`** — pour `order_kind === "divers"` :
   - `cake = "<qty> × <nom>"` (ou `<nom>` si pas de quantité), `cake_sub = "Divers"`
   - message composé à partir de `Quantité : <qty>` + `details`
   - notification e-mail inchangée (part comme pour un gâteau)

## Hors périmètre (YAGNI)

Pas de panier multi-articles, pas de paiement en ligne, pas de nouvelle table,
pas de champ date obligatoire spécifique aux divers.

## Résultat attendu

Une commande « divers » apparaît dans le dashboard comme une commande normale,
ex. **« 20 × Samoussa · Divers »**, triable/exportable, avec e-mail de notif.
