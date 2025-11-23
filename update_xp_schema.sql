
-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) primary key,
  xp integer default 0,
  level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Everyone can read profiles
create policy "Enable read access for all users"
on public.profiles
for select
using (true);

-- Policy: Users can update their own profile (or maybe only system/admin?)
-- For now, let's say only authenticated users can update their own
create policy "Enable update for users based on id"
on public.profiles
for update
using (auth.uid() = id);

-- Insert mock data for existing users (using the IDs from store/index.js)
insert into public.profiles (id, xp, level)
values
  ('11111111-1111-1111-1111-111111111111', 500, 5), -- Admin
  ('22222222-2222-2222-2222-222222222222', 0, 1),   -- John Doe
  ('33333333-3333-3333-3333-333333333333', 150, 2); -- Jane Smith
