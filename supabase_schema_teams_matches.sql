-- Create teams table
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  league_id uuid references public.leagues(id) on delete cascade not null,
  name text not null,
  captain_name text,
  division text,
  wins integer default 0,
  losses integer default 0,
  draws integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create matches table
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  league_id uuid references public.leagues(id) on delete cascade not null,
  home_team_id uuid references public.teams(id) on delete cascade,
  away_team_id uuid references public.teams(id) on delete cascade,
  start_time timestamp with time zone not null,
  location text,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  home_score integer,
  away_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.teams enable row level security;
alter table public.matches enable row level security;

-- Policies for teams
create policy "Enable read access for all users" on public.teams for select using (true);
create policy "Enable insert for authenticated users only" on public.teams for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.teams for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.teams for delete to authenticated using (true);

-- Policies for matches
create policy "Enable read access for all users" on public.matches for select using (true);
create policy "Enable insert for authenticated users only" on public.matches for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.matches for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.matches for delete to authenticated using (true);
