-- Caption Create database rebuild script
-- Run this in the Supabase SQL editor to recreate the app schema from scratch.
-- This script drops app tables only. It does not drop Supabase auth users.

begin;

-- Drop app tables in dependency order.
drop table if exists public.likes cascade;
drop table if exists public.captions cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;

-- Drop app auth triggers/functions from previous attempts.
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_created_profile on auth.users;
drop trigger if exists on_auth_user_created_public on auth.users;
do $$
declare
  trigger_record record;
begin
  for trigger_record in
    select trigger_name
    from information_schema.triggers
    where event_object_schema = 'auth'
      and event_object_table = 'users'
      and action_statement like '%public.%'
  loop
    execute format('drop trigger if exists %I on auth.users', trigger_record.trigger_name);
  end loop;
end;
$$;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.update_updated_at_column() cascade;

-- Drop storage policies that may already exist.
drop policy if exists "Caption images are publicly accessible" on storage.objects;
drop policy if exists "Authenticated users can upload caption images" on storage.objects;
drop policy if exists "Users can update their own caption images" on storage.objects;
drop policy if exists "Users can delete their own caption images" on storage.objects;

-- Required for gen_random_uuid().
create extension if not exists pgcrypto;

-- Public user metadata used by the app for admin checks.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  is_admin boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Public profile information.
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  email text not null,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Managed caption categories.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Main caption records.
create table public.captions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  content text not null,
  -- Kept for compatibility with the current frontend. Prefer category_id for new DB work.
  category text,
  image_url text,
  likes integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Per-user likes for captions.
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc', now()),
  user_id uuid not null references public.users(id) on delete cascade,
  caption_id uuid not null references public.captions(id) on delete cascade,
  constraint likes_user_caption_key unique (user_id, caption_id)
);

-- Indexes.
create index idx_captions_category on public.captions(category);
create index captions_category_id_idx on public.captions(category_id);
create index captions_user_id_idx on public.captions(user_id);
create index captions_created_at_idx on public.captions(created_at desc);
create index categories_slug_idx on public.categories(slug);
create index likes_user_id_idx on public.likes(user_id);
create index likes_caption_id_idx on public.likes(caption_id);

-- Timestamp trigger helper.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_users_updated_at
before update on public.users
for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger update_categories_updated_at
before update on public.categories
for each row execute function public.update_updated_at_column();

create trigger update_captions_updated_at
before update on public.captions
for each row execute function public.update_updated_at_column();

-- Create app rows when a Supabase Auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), new.email);

  insert into public.users (id, email, name, is_admin)
  values (new.id, new.email, display_name, false)
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(public.users.name, excluded.name);

  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, display_name)
  on conflict (user_id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS.
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.captions enable row level security;
alter table public.likes enable row level security;

create policy "users_select_own"
on public.users for select
using (auth.uid() = id);

create policy "profiles_select_public"
on public.profiles for select
using (true);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "categories_select_active"
on public.categories for select
using (is_active = true);

create policy "categories_admin_all"
on public.categories for all
using (
  exists (
    select 1
    from public.users
    where users.id = auth.uid()
      and users.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = auth.uid()
      and users.is_admin = true
  )
);

create policy "captions_select_public"
on public.captions for select
using (true);

create policy "captions_insert_own"
on public.captions for insert
with check (auth.uid() = user_id);

create policy "captions_update_own_or_admin"
on public.captions for update
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.users
    where users.id = auth.uid()
      and users.is_admin = true
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1
    from public.users
    where users.id = auth.uid()
      and users.is_admin = true
  )
);

create policy "captions_delete_own_or_admin"
on public.captions for delete
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.users
    where users.id = auth.uid()
      and users.is_admin = true
  )
);

create policy "likes_select_public"
on public.likes for select
using (true);

create policy "likes_insert_own"
on public.likes for insert
with check (auth.uid() = user_id);

create policy "likes_delete_own"
on public.likes for delete
using (auth.uid() = user_id);

-- Storage bucket and policies for caption images.
insert into storage.buckets (id, name, public)
values ('captions', 'captions', true)
on conflict (id) do update
set public = excluded.public;

create policy "Caption images are publicly accessible"
on storage.objects for select
using (bucket_id = 'captions');

create policy "Authenticated users can upload caption images"
on storage.objects for insert
with check (bucket_id = 'captions' and auth.role() = 'authenticated');

create policy "Users can update their own caption images"
on storage.objects for update
using (bucket_id = 'captions' and auth.role() = 'authenticated')
with check (bucket_id = 'captions' and auth.role() = 'authenticated');

create policy "Users can delete their own caption images"
on storage.objects for delete
using (bucket_id = 'captions' and auth.role() = 'authenticated');

commit;
