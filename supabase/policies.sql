-- =========================================================
-- Echoo E-commerce Simple RLS Policies
-- Class 12 style simple SQL
-- =========================================================

-- Admin check function
-- It checks if current logged-in user has Admin role
create or replace function is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'Admin'
  );
$$;


-- =========================================================
-- 1. Profiles Policies
-- User can see and update only own profile
-- Admin can see all profiles
-- =========================================================

create policy "user can view own profile"
on profiles
for select
to authenticated
using (id = auth.uid());

create policy "user can insert own profile"
on profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "user can update own profile"
on profiles
for update
to authenticated
using (id = auth.uid());

create policy "admin can view all profiles"
on profiles
for select
to authenticated
using (is_admin());


-- =========================================================
-- 2. Products Policies
-- Anyone can view products
-- Only admin can add, update, and delete products
-- =========================================================

create policy "anyone can view products"
on products
for select
to anon, authenticated
using (true);

create policy "admin can add products"
on products
for insert
to authenticated
with check (is_admin());

create policy "admin can update products"
on products
for update
to authenticated
using (is_admin());

create policy "admin can delete products"
on products
for delete
to authenticated
using (is_admin());


-- =========================================================
-- 3. Product Images Policies
-- Anyone can view product images
-- Only admin can manage product images
-- =========================================================

create policy "anyone can view product images"
on product_images
for select
to anon, authenticated
using (true);

create policy "admin can add product images"
on product_images
for insert
to authenticated
with check (is_admin());

create policy "admin can update product images"
on product_images
for update
to authenticated
using (is_admin());

create policy "admin can delete product images"
on product_images
for delete
to authenticated
using (is_admin());


-- =========================================================
-- 4. Cart Policies
-- User can access only own cart
-- =========================================================

create policy "user can view own cart"
on cart_items
for select
to authenticated
using (user_id = auth.uid());

create policy "user can add own cart"
on cart_items
for insert
to authenticated
with check (user_id = auth.uid());

create policy "user can update own cart"
on cart_items
for update
to authenticated
using (user_id = auth.uid());

create policy "user can delete own cart"
on cart_items
for delete
to authenticated
using (user_id = auth.uid());


-- =========================================================
-- 5. Wishlist Policies
-- User can access only own wishlist
-- =========================================================

create policy "user can view own wishlist"
on wishlist_items
for select
to authenticated
using (user_id = auth.uid());

create policy "user can add own wishlist"
on wishlist_items
for insert
to authenticated
with check (user_id = auth.uid());

create policy "user can delete own wishlist"
on wishlist_items
for delete
to authenticated
using (user_id = auth.uid());


-- =========================================================
-- 6. Orders Policies
-- User can access only own orders
-- Admin can view and update all orders
-- =========================================================

create policy "user can view own orders"
on orders
for select
to authenticated
using (user_id = auth.uid());

create policy "user can create own order"
on orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "user can update own order"
on orders
for update
to authenticated
using (user_id = auth.uid());

create policy "admin can view all orders"
on orders
for select
to authenticated
using (is_admin());

create policy "admin can update all orders"
on orders
for update
to authenticated
using (is_admin());


-- =========================================================
-- 7. Order Items Policies
-- User can access items of own order
-- Admin can view all order items
-- =========================================================

create policy "user can view own order items"
on order_items
for select
to authenticated
using (
  exists (
    select 1
    from orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "user can add own order items"
on order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "admin can view all order items"
on order_items
for select
to authenticated
using (is_admin());


-- =========================================================
-- 8. Payments Policies
-- User can access only own payments
-- Admin can view and update all payments
-- =========================================================

create policy "user can view own payments"
on payments
for select
to authenticated
using (user_id = auth.uid());

create policy "user can add own payment"
on payments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "admin can view all payments"
on payments
for select
to authenticated
using (is_admin());

create policy "admin can update payments"
on payments
for update
to authenticated
using (is_admin());