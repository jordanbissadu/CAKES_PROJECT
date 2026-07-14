-- IDI's Cakes — catalogue seed (from the storefront "Notre carte").
-- Idempotent: safe to re-run.

insert into public.products
  (name, slug, category, description, base_price, price_label, badge, flavors, sort_order)
values
  ('Gâteau anniversaire — 6 parts', 'gateau-anniversaire-6', 'gateaux',
   'Saveurs vanille ou chocolat.', 6000, 'dès 6 000F', 'Best-seller',
   array['Vanille','Chocolat'], 10),
  ('Gâteau anniversaire — 10 parts', 'gateau-anniversaire-10', 'gateaux',
   'Saveurs vanille, chocolat ou fraise.', 10000, '10 000F', null,
   array['Vanille','Chocolat','Fraise'], 20),
  ('Gâteau anniversaire — 12 parts', 'gateau-anniversaire-12', 'gateaux',
   'Vanille, chocolat, fraise, oreo ou caramel.', 12000, '12 000F', null,
   array['Vanille','Chocolat','Fraise','Oreo','Caramel'], 30),
  ('Pièce montée', 'piece-montee', 'gateaux',
   'Deux niveaux, pour vos mariages, baptêmes et grandes occasions. Sur commande.',
   30000, '30 000F', 'Grand jour', null, 40),
  ('Cupcakes', 'cupcakes', 'gateaux',
   '6 cupcakes personnalisables, saveurs vanille ou chocolat. Parfaits à partager.',
   5000, '6 pour 5 000F', 'Personnalisable', array['Vanille','Chocolat'], 50),
  ('Barre de cake', 'barre-de-cake', 'gateaux',
   'Grosse barre, saveurs vanille, marbre ou chocolat.', 3000, '3 000F', null,
   array['Vanille','Marbré','Chocolat'], 60),
  ('Samoussa', 'samoussa', 'divers', null, 200, '200F', null, null, 110),
  ('Mini pizza', 'mini-pizza', 'divers', null, 500, '500F', null, null, 120),
  ('Crêpes nature', 'crepes-nature', 'divers', null, 1000, '5 pour 1 000F', null, null, 130),
  ('Crêpe chocolat', 'crepe-chocolat', 'divers', null, 1500, '5 pour 1 500F', null, null, 140)
on conflict (slug) do nothing;
