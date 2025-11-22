-- Create the leagues table
create table public.leagues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sport text not null,
  season text not null,
  status text not null check (status in ('active', 'upcoming', 'past')),
  registration_open boolean default false,
  start_date date,
  end_date date,
  max_teams integer,
  format text,
  divisions jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.leagues enable row level security;

-- Create a policy that allows everyone to read leagues
create policy "Enable read access for all users"
on public.leagues
for select
using (true);

-- Create a policy that allows authenticated users to insert/update (adjust as needed)
-- For now, we'll allow public insert for testing purposes if you want, or restrict to authenticated
create policy "Enable insert for authenticated users only"
on public.leagues
for insert
to authenticated
with check (true);

-- Insert some sample data
insert into public.leagues (name, sport, season, status, registration_open, start_date, end_date, max_teams, format, divisions)
values
  ('Fall 2025 Basketball', 'Basketball', 'Fall 2025', 'active', true, '2025-10-29', '2025-11-27', 16, 'Single Elimination', '["Men''s A", "Men''s B", "Co-Rec", "Women''s"]'),
  ('Fall 2025 Soccer', 'Soccer', 'Fall 2025', 'active', true, '2025-09-15', '2025-11-15', 24, 'Round Robin', '["Open", "Co-Rec"]');
