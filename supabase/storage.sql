-- Echoo E-commerce Simple Storage Setup

-- 1. Product images bucket
insert into storage.buckets (
  id,
  name,
  public
)
values (
  'product-images',
  'product-images',
  true
)
on conflict (id) do nothing;

-- 2. User avatars bucket
insert into storage.buckets (
  id,
  name,
  public
)
values (
  'avatars',
  'avatars',
  true
)
on conflict (id) do nothing;

-- 3. Anyone can view product images
create policy "anyone can view product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

-- 4. Admin can upload product images
create policy "admin can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and is_admin()
);

-- 5. Admin can update product images
create policy "admin can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and is_admin()
);

-- 6. Admin can delete product images
create policy "admin can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and is_admin()
);

-- 7. Anyone can view avatars
create policy "anyone can view avatars"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'avatars');

-- 8. Logged-in user can upload avatar
create policy "user can upload avatar"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- 9. Logged-in user can update avatar
create policy "user can update avatar"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars');

-- 10. Logged-in user can delete avatar
create policy "user can delete avatar"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars');