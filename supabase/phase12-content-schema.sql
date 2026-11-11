-- Run in Supabase SQL Editor to resolve the team/blog schema warnings.
-- Safe to re-run; existing team members and blog posts are preserved.
begin;

alter table public.team_members add column if not exists website_url text;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image_url text,
  author text,
  author_url text,
  author_role text,
  source_url text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);

alter table public.blog_posts
  add column if not exists author text,
  add column if not exists author_url text,
  add column if not exists author_role text,
  add column if not exists source_url text;

alter table public.blog_posts enable row level security;
drop policy if exists "Public read blog_posts" on public.blog_posts;
create policy "Public read blog_posts"
  on public.blog_posts for select
  using (true);

notify pgrst, 'reload schema';
commit;
