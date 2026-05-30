-- =========================================================
-- Echoo E-commerce Simple Schema
-- Class 12 style simple SQL
-- =========================================================

-- This extension is used to generate random UUID ids
create extension if not exists "pgcrypto";


-- =========================================================
-- 1. Profiles Table
-- Stores user profile details
-- Supabase Auth stores login/password separately
-- =========================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text default 'User',
  avatar_url text,
  address jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- =========================================================
-- 2. Products Table
-- Stores all products of old website
-- =========================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  brand text,
  category text,
  description text,
  short_description text,
  price numeric not null,
  discount_price numeric,
  stock integer default 0,
  rating numeric default 0,
  is_featured boolean default false,
  variants jsonb,
  features jsonb,
  specs jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- =========================================================
-- 3. Product Images Table
-- Stores multiple images for one product
-- =========================================================

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);


-- =========================================================
-- 4. Cart Items Table
-- Stores products added to user cart
-- =========================================================

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- =========================================================
-- 5. Wishlist Items Table
-- Stores products saved by user
-- =========================================================

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamp with time zone default now()
);


-- =========================================================
-- 6. Orders Table
-- Stores order summary
-- =========================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total_amount numeric not null,
  payment_method text default 'razorpay',
  payment_status text default 'pending',
  order_status text default 'placed',
  payment_id text,
  address jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- =========================================================
-- 7. Order Items Table
-- Stores products inside each order
-- =========================================================

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer default 1,
  price numeric not null,
  created_at timestamp with time zone default now()
);


-- =========================================================
-- 8. Payments Table
-- Stores payment details
-- =========================================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  provider text default 'razorpay',
  payment_id text,
  amount numeric not null,
  status text default 'pending',
  raw_response jsonb,
  created_at timestamp with time zone default now()
);


-- =========================================================
-- Enable Row Level Security
-- This keeps user data secure
-- =========================================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table cart_items enable row level security;
alter table wishlist_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;