-- Seed the 9 demo business cards (no owner, published) so /c/<slug> works
-- against the DB and you can verify public-read RLS. Mirrors apps/web/src/features/cards/seed.ts.
-- Run after 0001_initial_schema.sql. Idempotent on slug.
--
-- These are well-known FICTIONAL pop-culture brands used purely to showcase each
-- template's personality. Demo-only — the names are trademarked.

-- Remove the previous demo set (owner-less seed rows) so re-seeding rebrands cleanly.
-- Safe: only deletes cards with no account_id (seed/demo rows), never real user cards.
delete from public.business_cards
where account_id is null
  and slug in (
    -- previous demo slugs
    'lumen-coffee', 'maison-bloom', 'vertex-studio', 'scoops-parlour', 'fade-house',
    'sugar-petal', 'hale-mercer', 'northgate-plumbing', 'flour-stone',
    -- current demo slugs (so this script is re-runnable)
    'wayne-enterprises', 'lumon-industries', 'stark-industries', 'krusty-krab',
    'duff-beer', 'willy-wonka', 'daily-planet', 'dunder-mifflin', 'central-perk'
  );

insert into public.business_cards (slug, template_id, business_name, tagline, description, contact, theme_overrides, published)
values
  ('wayne-enterprises', 'aurora', 'Wayne Enterprises', 'Building a brighter Gotham',
   'Aerospace, biotech, and applied sciences — innovating responsibly for a safer tomorrow.',
   '{"email":"info@wayne.enterprises","website":"wayne.enterprises","address":"1007 Mountain Dr, Gotham City"}'::jsonb,
   '{"accent":"#c9a227"}'::jsonb, true),
  ('lumon-industries', 'halo', 'Lumon Industries', 'The work is mysterious and important',
   'A diversified enterprise advancing the science of a balanced life since 1865. Praise Kier.',
   '{"email":"outreach@lumon.industries","website":"lumon.industries","address":"Kier, PE"}'::jsonb,
   '{"accent":"#3f9aa6"}'::jsonb, true),
  ('stark-industries', 'monolith', 'Stark Industries', 'The future, engineered',
   'Clean energy, advanced robotics, and aerospace. Privatizing world peace, one breakthrough at a time.',
   '{"email":"press@stark.com","website":"stark.com","phone":"+1 (212) 970-4133","address":"200 Park Ave, New York, NY"}'::jsonb,
   '{"accent":"#e0322b"}'::jsonb, true),
  ('krusty-krab', 'pop', 'The Krusty Krab', 'Home of the Krabby Patty',
   'The finest eating establishment under the sea. Secret-formula burgers, served fresh and fast.',
   '{"phone":"+1 (555) 836-2274","website":"krustykrab.sea","address":"831 Bottom Feeder Ln, Bikini Bottom","hours":"Mon–Sun · 11am–9pm"}'::jsonb,
   '{"accent":"#ef5e3a"}'::jsonb, true),
  ('duff-beer', 'neon', 'Duff Beer', 'Can''t get enough of that wonderful Duff',
   'Brewed with the finest hops since 1972. Ice-cold and always refreshing. Please drink responsibly.',
   '{"website":"duff.beer","address":"Springfield","hours":"Tap room · daily till 2am"}'::jsonb,
   '{"accent":"#ff2e4d"}'::jsonb, true),
  ('willy-wonka', 'carnival', 'Wonka Chocolate Factory', 'Pure imagination, pure chocolate',
   'Magical confections, everlasting gobstoppers, and golden-ticket tours. Scrumdiddlyumptious since 1964.',
   '{"email":"goldenticket@wonka.chocolate","website":"wonka.chocolate"}'::jsonb,
   '{"accent":"#7e57c2"}'::jsonb, true),
  ('daily-planet', 'editorial', 'The Daily Planet', 'Metropolis since 1938',
   'Award-winning journalism covering Metropolis and beyond. Truth, justice, and the stories that matter.',
   '{"phone":"+1 (212) 555-1938","email":"tips@dailyplanet.news","website":"dailyplanet.news","address":"1000 Broadway, Metropolis"}'::jsonb,
   '{"accent":"#234a8f"}'::jsonb, true),
  ('dunder-mifflin', 'embossed', 'Dunder Mifflin', 'Limitless paper in a paperless world',
   'Your local source for paper and office supplies. Regional, reliable, and refreshingly personal.',
   '{"phone":"+1 (570) 555-0000","email":"scranton@dundermifflin.com","website":"dundermifflin.com","address":"1725 Slough Ave, Scranton, PA"}'::jsonb,
   '{"accent":"#2f5d8a"}'::jsonb, true),
  ('central-perk', 'linen', 'Central Perk', 'Where everyone knows your order',
   'Coffee, couches, and good company in the heart of the Village. Open mic every Thursday.',
   '{"phone":"+1 (212) 555-2468","website":"centralperk.cafe","address":"90 Bedford St, New York, NY","hours":"Mon–Sun · 6am–11pm"}'::jsonb,
   '{"accent":"#b5651d"}'::jsonb, true)
on conflict (slug) do nothing;

insert into public.card_links (card_id, label, url, icon, position)
select c.id, x.label, x.url, x.icon, x.position
from public.business_cards c
join (
  values
    ('wayne-enterprises', 'Our divisions', 'wayne.enterprises/divisions', 'link', 0),
    ('wayne-enterprises', 'Wayne Foundation', 'wayne.enterprises/foundation', 'link', 1),
    ('wayne-enterprises', 'Careers', 'wayne.enterprises/careers', 'link', 2),
    ('lumon-industries', 'Explore severance', 'lumon.industries/severance', 'link', 0),
    ('lumon-industries', 'Our history', 'lumon.industries/kier', 'link', 1),
    ('stark-industries', 'Stark tech', 'stark.com/tech', 'link', 0),
    ('stark-industries', 'Clean energy', 'stark.com/arc', 'link', 1),
    ('stark-industries', 'Newsroom', 'stark.com/news', 'link', 2),
    ('krusty-krab', 'See the menu', 'krustykrab.sea/menu', 'link', 0),
    ('krusty-krab', 'Krabby of the day', 'krustykrab.sea/special', 'link', 1),
    ('duff-beer', 'Find a tap near you', 'duff.beer/locator', 'link', 0),
    ('duff-beer', 'Brewery tours', 'duff.beer/tours', 'link', 1),
    ('duff-beer', 'Instagram', 'instagram.com/duffbeer', 'instagram', 2),
    ('willy-wonka', 'Win a golden ticket', 'wonka.chocolate/ticket', 'link', 0),
    ('willy-wonka', 'Our sweets', 'wonka.chocolate/shop', 'link', 1),
    ('daily-planet', 'Subscribe', 'dailyplanet.news/subscribe', 'link', 0),
    ('daily-planet', 'Today''s front page', 'dailyplanet.news/today', 'link', 1),
    ('dunder-mifflin', 'Shop paper', 'dundermifflin.com/paper', 'link', 0),
    ('dunder-mifflin', 'Request a quote', 'dundermifflin.com/quote', 'link', 1),
    ('central-perk', 'Our menu', 'centralperk.cafe/menu', 'link', 0),
    ('central-perk', 'Open mic night', 'centralperk.cafe/openmic', 'link', 1)
) as x (slug, label, url, icon, position) on x.slug = c.slug
where not exists (
  select 1 from public.card_links l where l.card_id = c.id and l.label = x.label
);
