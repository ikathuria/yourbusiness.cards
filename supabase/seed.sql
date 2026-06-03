-- Seed the 9 demo business cards (no owner, published) so /c/<slug> works
-- against the DB and you can verify public-read RLS. Mirrors apps/web/src/features/cards/seed.ts.
-- Run after 0001_initial_schema.sql. Idempotent on slug.

insert into public.business_cards (slug, template_id, business_name, tagline, description, contact, published)
values
  ('lumen-coffee', 'aurora', 'Lumen Coffee', 'Specialty roasts, all day',
   'Single-origin espresso, slow bar, and pastries baked in-house every morning.',
   '{"phone":"+1 (415) 555-0123","website":"lumen.coffee","address":"812 Valencia St, San Francisco, CA","hours":"Mon–Sun · 7am–6pm"}'::jsonb, true),
  ('maison-bloom', 'halo', 'Maison Bloom', 'Floral design studio',
   'Seasonal arrangements, weddings, and weekly subscriptions for homes and offices.',
   '{"phone":"+1 (212) 555-0177","email":"hello@maisonbloom.co","website":"maisonbloom.co","address":"45 Greenwich Ave, New York, NY"}'::jsonb, true),
  ('vertex-studio', 'monolith', 'Vertex Studio', 'Brand & product design',
   'We build identities and interfaces for ambitious teams. Currently booking Q3.',
   '{"email":"studio@vertex.design","website":"vertex.design","phone":"+1 (310) 555-0199"}'::jsonb, true),
  ('scoops-parlour', 'pop', 'Scoops Parlour', '24 wild flavors',
   'Small-batch ice cream, sundaes, and shakes. Made fresh, scooped with joy.',
   '{"phone":"+1 (305) 555-0144","website":"scoops.fun","address":"120 Ocean Dr, Miami, FL"}'::jsonb, true),
  ('fade-house', 'neon', 'Fade House', 'Cuts after dark',
   'Precision fades, hot-towel shaves, and beard work. Walk-ins till midnight.',
   '{"phone":"+1 (702) 555-0188","website":"fadehouse.la","address":"9 Fremont St, Las Vegas, NV","hours":"Tue–Sun · 2pm–12am"}'::jsonb, true),
  ('sugar-petal', 'carnival', 'Sugar & Petal', 'Cakes & blooms',
   'Custom cakes and fresh flowers for birthdays, weddings, and just-because days.',
   '{"phone":"+1 (503) 555-0166","email":"hi@sugarpetal.shop","website":"sugarpetal.shop"}'::jsonb, true),
  ('hale-mercer', 'editorial', 'Hale & Mercer', 'Attorneys at Law',
   'Estate planning, real estate, and small-business counsel. Trusted since 1998.',
   '{"phone":"+1 (617) 555-0133","email":"office@halemercer.law","website":"halemercer.law","address":"200 Beacon St, Boston, MA"}'::jsonb, true),
  ('northgate-plumbing', 'embossed', 'Northgate Plumbing', 'Licensed & insured',
   'Residential and commercial plumbing. Same-day service, upfront pricing, no surprises.',
   '{"phone":"+1 (614) 555-0111","email":"dispatch@northgate.plumbing","website":"northgate.plumbing","address":"Serving Greater Columbus, OH"}'::jsonb, true),
  ('flour-stone', 'linen', 'Flour & Stone', 'Wood-fired bakery',
   'Naturally leavened sourdough, morning pastries, and stone-milled flour. Baked daily.',
   '{"phone":"+1 (415) 555-0150","website":"flourandstone.bakery","address":"27 Mill Ln, Sonoma, CA","hours":"Wed–Sun · 7am–2pm"}'::jsonb, true)
on conflict (slug) do nothing;

insert into public.card_links (card_id, label, url, icon, position)
select c.id, x.label, x.url, x.icon, x.position
from public.business_cards c
join (
  values
    ('lumen-coffee', 'Order ahead', 'lumen.coffee/order', 'link', 0),
    ('lumen-coffee', 'Instagram', 'instagram.com/lumencoffee', 'instagram', 1),
    ('lumen-coffee', 'Our menu', 'lumen.coffee/menu', 'link', 2),
    ('maison-bloom', 'Book a consultation', 'maisonbloom.co/book', 'link', 0),
    ('maison-bloom', 'Instagram', 'instagram.com/maisonbloom', 'instagram', 1),
    ('vertex-studio', 'See our work', 'vertex.design/work', 'link', 0),
    ('vertex-studio', 'Start a project', 'vertex.design/contact', 'link', 1),
    ('vertex-studio', 'LinkedIn', 'linkedin.com/company/vertex', 'linkedin', 2),
    ('scoops-parlour', 'Today''s flavors', 'scoops.fun/flavors', 'link', 0),
    ('scoops-parlour', 'Order a cake', 'scoops.fun/cakes', 'link', 1),
    ('fade-house', 'Book a chair', 'fadehouse.la/book', 'link', 0),
    ('fade-house', 'Instagram', 'instagram.com/fadehouse', 'instagram', 1),
    ('sugar-petal', 'Order a cake', 'sugarpetal.shop/order', 'link', 0),
    ('sugar-petal', 'Wedding inquiries', 'sugarpetal.shop/weddings', 'link', 1),
    ('hale-mercer', 'Schedule a consultation', 'halemercer.law/contact', 'link', 0),
    ('northgate-plumbing', 'Request service', 'northgate.plumbing/book', 'link', 0),
    ('northgate-plumbing', 'Get a quote', 'northgate.plumbing/quote', 'link', 1),
    ('flour-stone', 'Pre-order bread', 'flourandstone.bakery/order', 'link', 0),
    ('flour-stone', 'Visit us', 'flourandstone.bakery/visit', 'link', 1)
) as x (slug, label, url, icon, position) on x.slug = c.slug
where not exists (
  select 1 from public.card_links l where l.card_id = c.id and l.label = x.label
);
