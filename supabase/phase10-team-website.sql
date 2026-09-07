-- Phase 10: Personal website on team profiles
-- Run in Supabase → SQL Editor (safe to re-run)
--
-- Adds a second, optional social link (personal website) alongside
-- linkedin_url so it can be set per row in Table Editor.

alter table public.team_members
  add column if not exists website_url text;
