
-- Create the announcements table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id), -- Optional: link to auth user if using Supabase Auth
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.announcements enable row level security;

-- Policy: Everyone can read announcements
create policy "Enable read access for all users"
on public.announcements
for select
using (true);

-- Policy: Only authenticated users (directors) can insert
create policy "Enable insert for authenticated users only"
on public.announcements
for insert
to authenticated
with check (true);

-- Insert sample announcement
insert into public.announcements (title, content)
values
  ('Welcome to the New Season!', 'We are excited to kick off the Fall 2025 season. Check your schedules and good luck!'),
  ('Weather Alert', 'Due to rain, all outdoor soccer games for tonight are cancelled. Rescheduling info to follow.');
