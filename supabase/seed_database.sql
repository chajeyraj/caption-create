-- Caption Create seed data
-- Run after supabase/rebuild_database.sql.
-- Creates 10 demo auth users, 120 captions across app categories, and sample likes.

begin;

create extension if not exists pgcrypto;

do $$ begin raise notice 'seed step 01: preflight checks'; end $$;

do $$
begin
  if to_regclass('public.users') is null then
    raise exception 'Missing table public.users. Run supabase/rebuild_database.sql before this seed script.';
  end if;

  if to_regclass('public.profiles') is null then
    raise exception 'Missing table public.profiles. Run supabase/rebuild_database.sql before this seed script.';
  end if;

  if to_regclass('public.categories') is null then
    raise exception 'Missing table public.categories. Run the latest supabase/rebuild_database.sql before this seed script.';
  end if;

  if to_regclass('public.captions') is null then
    raise exception 'Missing table public.captions. Run supabase/rebuild_database.sql before this seed script.';
  end if;

  if to_regclass('public.likes') is null then
    raise exception 'Missing table public.likes. Run supabase/rebuild_database.sql before this seed script.';
  end if;
end;
$$;

-- Avoid firing stale signup triggers while inserting demo auth users.
-- The script manually inserts public.users and public.profiles below, then restores the app trigger at the end.
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

do $$ begin raise notice 'seed step 02: auth.users'; end $$;

-- Fixed demo users. Password for all demo auth users: Caption123!
with seed_users(id, email, display_name, is_admin) as (
  values
    ('10000000-0000-0000-0000-000000000001'::uuid, 'admin@captioncreate.test', 'Admin Creator', true),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'maya@captioncreate.test', 'Maya Silva', false),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'noah@captioncreate.test', 'Noah Reed', false),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'aria@captioncreate.test', 'Aria Chen', false),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'leo@captioncreate.test', 'Leo Morgan', false),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'zara@captioncreate.test', 'Zara Khan', false),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'ethan@captioncreate.test', 'Ethan Brooks', false),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'nina@captioncreate.test', 'Nina Patel', false),
    ('10000000-0000-0000-0000-000000000009'::uuid, 'kai@captioncreate.test', 'Kai Fernando', false),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'sophia@captioncreate.test', 'Sophia Lane', false)
)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000',
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('Caption123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('display_name', display_name),
  now(),
  now()
from seed_users
on conflict (id) do update
set email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

do $$ begin raise notice 'seed step 03: auth.identities'; end $$;

with seed_users(id, email, display_name, is_admin) as (
  values
    ('10000000-0000-0000-0000-000000000001'::uuid, 'admin@captioncreate.test', 'Admin Creator', true),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'maya@captioncreate.test', 'Maya Silva', false),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'noah@captioncreate.test', 'Noah Reed', false),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'aria@captioncreate.test', 'Aria Chen', false),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'leo@captioncreate.test', 'Leo Morgan', false),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'zara@captioncreate.test', 'Zara Khan', false),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'ethan@captioncreate.test', 'Ethan Brooks', false),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'nina@captioncreate.test', 'Nina Patel', false),
    ('10000000-0000-0000-0000-000000000009'::uuid, 'kai@captioncreate.test', 'Kai Fernando', false),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'sophia@captioncreate.test', 'Sophia Lane', false)
)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  id,
  id,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  'email',
  id::text,
  now(),
  now(),
  now()
from seed_users
on conflict (provider, provider_id) do update
set identity_data = excluded.identity_data,
    updated_at = now();

do $$ begin raise notice 'seed step 04: public.users'; end $$;

with seed_users(id, email, display_name, is_admin) as (
  values
    ('10000000-0000-0000-0000-000000000001'::uuid, 'admin@captioncreate.test', 'Admin Creator', true),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'maya@captioncreate.test', 'Maya Silva', false),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'noah@captioncreate.test', 'Noah Reed', false),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'aria@captioncreate.test', 'Aria Chen', false),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'leo@captioncreate.test', 'Leo Morgan', false),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'zara@captioncreate.test', 'Zara Khan', false),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'ethan@captioncreate.test', 'Ethan Brooks', false),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'nina@captioncreate.test', 'Nina Patel', false),
    ('10000000-0000-0000-0000-000000000009'::uuid, 'kai@captioncreate.test', 'Kai Fernando', false),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'sophia@captioncreate.test', 'Sophia Lane', false)
)
insert into public.users (id, email, name, is_admin)
select id, email, display_name, is_admin
from seed_users
on conflict (id) do update
set email = excluded.email,
    name = excluded.name,
    is_admin = excluded.is_admin;

do $$ begin raise notice 'seed step 05: public.profiles'; end $$;

with seed_users(id, email, display_name) as (
  values
    ('10000000-0000-0000-0000-000000000001'::uuid, 'admin@captioncreate.test', 'Admin Creator'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'maya@captioncreate.test', 'Maya Silva'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'noah@captioncreate.test', 'Noah Reed'),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'aria@captioncreate.test', 'Aria Chen'),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'leo@captioncreate.test', 'Leo Morgan'),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'zara@captioncreate.test', 'Zara Khan'),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'ethan@captioncreate.test', 'Ethan Brooks'),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'nina@captioncreate.test', 'Nina Patel'),
    ('10000000-0000-0000-0000-000000000009'::uuid, 'kai@captioncreate.test', 'Kai Fernando'),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'sophia@captioncreate.test', 'Sophia Lane')
)
insert into public.profiles (user_id, email, display_name, avatar_url)
select
  id,
  email,
  display_name,
  'https://api.dicebear.com/8.x/initials/svg?seed=' || replace(display_name, ' ', '%20')
from seed_users
on conflict (user_id) do update
set email = excluded.email,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url;

do $$ begin raise notice 'seed step 06: clear old captions'; end $$;

-- Remove previous seed captions/likes for these users before reseeding.
delete from public.captions
where user_id between '10000000-0000-0000-0000-000000000001'::uuid
                  and '10000000-0000-0000-0000-000000000010'::uuid;

do $$ begin raise notice 'seed step 07: categories'; end $$;

with seed_categories(name, slug, description, sort_order) as (
  values
    ('Motivational', 'motivational', 'Inspire and get inspired', 1),
    ('Success', 'success', 'Celebrate achievements', 2),
    ('Funny', 'funny', 'Bring smiles and laughter', 3),
    ('Love & Romance', 'love-romance', 'Express your feelings', 4),
    ('Life Quotes', 'life-quotes', 'Wisdom for daily life', 5),
    ('Coffee', 'coffee', 'For coffee lovers', 6),
    ('Books', 'books', 'Literary inspiration', 7),
    ('Good Morning', 'good-morning', 'Start your day right', 8),
    ('à®¤à®®à®¿à®´à¯', 'tamil', 'Tamil quotes and wisdom', 9),
    ('à·ƒà·’à¶‚à·„à¶½', 'sinhala', 'Sinhala quotes and wisdom', 10),
    ('ä¸­æ–‡', 'chinese', 'Chinese quotes and wisdom', 11),
    ('à¤¹à¤¿à¤¨à¥à¤¦à¥€', 'hindi', 'Hindi quotes and wisdom', 12)
)
insert into public.categories (name, slug, description, sort_order, is_active)
select name, slug, description, sort_order, true
from seed_categories
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

do $$ begin raise notice 'seed step 08: captions'; end $$;

with
categories(id, name) as (
  select id, name
  from public.categories
  where slug in (
    'motivational',
    'success',
    'funny',
    'love-romance',
    'life-quotes',
    'coffee',
    'books',
    'good-morning',
    'tamil',
    'sinhala',
    'chinese',
    'hindi'
  )
),
caption_templates(content) as (
  values
    ('Small steps become strong stories when you keep moving.'),
    ('Build the version of yourself your future will thank.'),
    ('The best caption is honest, simple, and impossible to ignore.'),
    ('Your mood deserves words that match its energy.'),
    ('Keep your focus clean and your standards high.'),
    ('A quiet mind can still make a loud impact.'),
    ('Turn ordinary moments into a memory worth keeping.'),
    ('Some days need courage, some days need coffee.'),
    ('Let your heart speak before the world edits it.'),
    ('Confidence looks better when it stays kind.'),
    ('Do the work, trust the timing, keep the faith.'),
    ('Memories feel brighter when the words are right.'),
    ('Stay close to people who make life lighter.'),
    ('The morning is new, and so is your chance.'),
    ('Read more, rush less, notice everything.'),
    ('Love grows best where respect feels natural.'),
    ('Laugh first, overthink later.'),
    ('Wisdom is knowing what deserves your energy.'),
    ('Success starts as discipline before it becomes a result.'),
    ('Life gets clearer when you stop performing for everyone.')
),
users as (
  select id, row_number() over (order by id) as user_no
  from public.users
  where id between '10000000-0000-0000-0000-000000000001'::uuid
               and '10000000-0000-0000-0000-000000000010'::uuid
),
numbered_categories as (
  select id, name, row_number() over (order by name) as category_no
  from categories
),
numbered_templates as (
  select content, row_number() over (order by content) as template_no
  from caption_templates
),
caption_source as (
  select
    gs as caption_no,
    u.id as user_id,
    c.id as category_id,
    c.name as category,
    t.content
  from generate_series(1, 120) gs
  join users u on u.user_no = ((gs - 1) % 10) + 1
  join numbered_categories c on c.category_no = ((gs - 1) % 12) + 1
  join numbered_templates t on t.template_no = ((gs - 1) % 20) + 1
)
insert into public.captions (user_id, category_id, title, content, category, image_url, created_at, updated_at)
select
  user_id,
  category_id,
  category || ' Caption ' || caption_no,
  content,
  category,
  null,
  now() - (caption_no || ' hours')::interval,
  now() - (caption_no || ' hours')::interval
from caption_source;

do $$ begin raise notice 'seed step 09: likes'; end $$;

-- Add deterministic sample likes. Each caption receives likes from 0 to 4 users.
with
seed_users as (
  select id, row_number() over (order by id) as user_no
  from public.users
  where id between '10000000-0000-0000-0000-000000000001'::uuid
               and '10000000-0000-0000-0000-000000000010'::uuid
),
seed_captions as (
  select
    id,
    user_id,
    row_number() over (order by created_at desc, id) as caption_no
  from public.captions
  where user_id between '10000000-0000-0000-0000-000000000001'::uuid
                    and '10000000-0000-0000-0000-000000000010'::uuid
),
like_source as (
  select distinct
    su.id as user_id,
    sc.id as caption_id,
    now() - ((sc.caption_no + su.user_no) || ' minutes')::interval as created_at
  from seed_captions sc
  join seed_users su
    on su.id <> sc.user_id
   and su.user_no <= ((sc.caption_no % 5) + 1)
)
insert into public.likes (user_id, caption_id, created_at)
select user_id, caption_id, created_at
from like_source
on conflict (user_id, caption_id) do nothing;

do $$ begin raise notice 'seed step 10: like counts'; end $$;

-- Keep denormalized caption like counts in sync with the likes table.
update public.captions c
set likes = coalesce(like_counts.total, 0)
from (
  select caption_id, count(*)::integer as total
  from public.likes
  group by caption_id
) like_counts
where c.id = like_counts.caption_id;

update public.captions
set likes = 0
where id not in (select caption_id from public.likes);

do $$ begin raise notice 'seed step 11: restore trigger'; end $$;

-- Restore the signup trigger for real users created after seeding.
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

commit;
