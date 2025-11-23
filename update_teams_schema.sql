-- Add missing columns to teams table
alter table public.teams add column if not exists captain_id uuid;
alter table public.teams add column if not exists members jsonb default '[]'::jsonb;
alter table public.teams add column if not exists points integer default 0;

-- Update RLS policies to allow insert/update on these columns if needed (usually covered by 'true' policies)
-- The existing policies are:
-- create policy "Enable insert for authenticated users only" on public.teams for insert to authenticated with check (true);
-- This should cover the new columns.
