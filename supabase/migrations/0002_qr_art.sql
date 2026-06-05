-- YourBusiness.Cards — AI QR art (Milestone 7A)
-- Adds a per-card stylized-QR image URL + a public Storage bucket to hold the
-- generated PNGs. Uploads are done server-side with the service-role key, so the
-- only client-facing policy needed is public read.

-- Column for the generated QR-art image (public Storage URL).
alter table public.business_cards
  add column if not exists qr_art_url text;

-- Public bucket for generated QR art.
insert into storage.buckets (id, name, public)
values ('qr-art', 'qr-art', true)
on conflict (id) do nothing;

-- Anyone may read QR-art objects (the bucket is public; writes go through the
-- service role which bypasses RLS).
drop policy if exists "qr_art_public_read" on storage.objects;
create policy "qr_art_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'qr-art');
