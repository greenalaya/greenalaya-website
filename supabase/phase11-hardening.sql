-- Phase 11: Schema catch-up, content cleanup, and contact rate-limit fix
-- Run in Supabase → SQL Editor (safe to re-run)
--
-- 1. Adds columns the site already reads (projects.image_url,
--    team_members.website_url) so fresh databases built from these files
--    match the code.
-- 2. Removes the legacy thematic-area rows from `projects` (inserted by
--    phase2-migrate.sql). The site only publishes the projects in
--    lib/content/seed.ts, so these rows were never listed but still showed
--    up in the sitemap. Re-running phase2-migrate.sql re-inserts them; run
--    this file again afterwards.
-- 3. Fixes the contact-form rate limit from phase7-hardening.sql, which
--    could never trigger: the trigger ran as the anonymous role, and RLS
--    (insert-only for anon) hid every existing row from its count.

-- ---------------------------------------------------------------------------
-- 1. Columns used by the site
-- ---------------------------------------------------------------------------
alter table public.projects add column if not exists image_url text;
alter table public.team_members add column if not exists website_url text;

-- ---------------------------------------------------------------------------
-- 2. Legacy project rows
-- ---------------------------------------------------------------------------
delete from public.projects
where slug in (
  'emerging-environmental-issues-research',
  'conservation-ecosystem-restoration',
  'climate-change-pollution-management',
  'innovation-eco-products-circular-economy',
  'environmental-technology-data-systems',
  'community-conservation-capacity-building',
  'environmental-policy-governance-ethics'
);

-- ---------------------------------------------------------------------------
-- 3. Contact form rate limiting
-- ---------------------------------------------------------------------------

-- The site's server action forwards the visitor IP as `x-client-ip` (taken
-- from the hosting proxy's x-forwarded-for). Requests made directly against
-- the REST API can spoof any header, which is why the trigger also enforces
-- a global cap below.
create or replace function public.request_client_ip()
returns text
language sql
stable
security definer
set search_path = public
as $$
  with request_headers as (
    select nullif(current_setting('request.headers', true), '')::json as h
  )
  select coalesce(
    nullif(trim((select h ->> 'x-client-ip' from request_headers)), ''),
    nullif(trim(split_part((select h ->> 'x-forwarded-for' from request_headers), ',', 1)), ''),
    nullif(trim((select h ->> 'cf-connecting-ip' from request_headers)), ''),
    'unknown'
  );
$$;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at);
create index if not exists contact_submissions_client_ip_created_at_idx
  on public.contact_submissions (client_ip, created_at);

-- SECURITY DEFINER lets the count see existing rows despite RLS. The
-- function only counts and stamps the new row; it never returns data.
create or replace function public.enforce_contact_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ip text := public.request_client_ip();
  recent_for_ip int;
  recent_total int;
begin
  -- Never trust client-supplied values for the fields the limit relies on.
  new.client_ip := ip;
  new.created_at := now();

  select count(*) into recent_total
  from public.contact_submissions
  where created_at > now() - interval '10 minutes';

  if recent_total >= 50 then
    raise exception 'Too many submissions. Please try again later.';
  end if;

  if ip <> 'unknown' then
    select count(*) into recent_for_ip
    from public.contact_submissions
    where client_ip = ip
      and created_at > now() - interval '10 minutes';

    if recent_for_ip >= 5 then
      raise exception 'Too many submissions. Please try again later.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_contact_rate_limit() from public;
revoke all on function public.request_client_ip() from public, anon, authenticated;

drop trigger if exists trg_contact_rate_limit on public.contact_submissions;
create trigger trg_contact_rate_limit
  before insert on public.contact_submissions
  for each row execute function public.enforce_contact_rate_limit();
