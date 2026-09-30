-- Parent-only optional sync. Child profiles remain local and anonymous.
create table if not exists public.parents (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  auth_provider text not null default 'email',
  created_at timestamptz not null default now()
);

create or replace function public.create_parent_record()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.parents (id, email, auth_provider)
  values (new.id, new.email, coalesce(new.raw_app_meta_data ->> 'provider', 'email'))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_parent on auth.users;
create trigger on_auth_user_created_parent
  after insert on auth.users
  for each row execute procedure public.create_parent_record();

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  product_id text not null,
  platform text not null check (platform in ('android','ios')),
  transaction_reference text not null,
  entitlement text not null,
  active boolean not null default false,
  purchased_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(platform, transaction_reference)
);

create table if not exists public.parent_backups (
  parent_id uuid primary key references public.parents(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.parents enable row level security;
alter table public.entitlements enable row level security;
alter table public.parent_backups enable row level security;

create policy "parents can read own parent record" on public.parents
  for select to authenticated using (id = (select auth.uid()));
create policy "parents can create own parent record" on public.parents
  for insert to authenticated with check (id = (select auth.uid()));
create policy "parents can update own parent record" on public.parents
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "parents can read own entitlements" on public.entitlements
  for select to authenticated using (parent_id = (select auth.uid()));
-- Deliberately no client insert/update policy. A trusted server must verify store receipts.

create policy "parents can read own backup" on public.parent_backups
  for select to authenticated using (parent_id = (select auth.uid()));
create policy "parents can create own backup" on public.parent_backups
  for insert to authenticated with check (parent_id = (select auth.uid()));
create policy "parents can update own backup" on public.parent_backups
  for update to authenticated using (parent_id = (select auth.uid())) with check (parent_id = (select auth.uid()));
