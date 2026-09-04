-- Run in Supabase → SQL Editor
-- Adds a blog_posts table with public read access (same pattern as news)

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image_url text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Public read blog_posts"
  on public.blog_posts for select
  using (true);
