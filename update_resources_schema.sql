-- Create the resources table
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  description text,
  category text not null, -- 'Rules', 'Forms', 'Safety', 'Other'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.resources enable row level security;

-- Create a policy that allows everyone to read resources
create policy "Enable read access for all users"
on public.resources
for select
using (true);

-- Create a policy that allows authenticated users (directors) to insert
-- Ideally, we'd check for role='director' in a real app with custom claims,
-- but for now we'll allow authenticated users to insert.
create policy "Enable insert for authenticated users"
on public.resources
for insert
to authenticated
with check (true);

-- Insert some sample data
insert into public.resources (title, url, description, category)
values
  ('Intramural Handbook 2025', 'https://example.com/handbook.pdf', 'Complete guide to policies and procedures.', 'Rules'),
  ('Waiver Form', 'https://example.com/waiver.pdf', 'Required liability waiver for all participants.', 'Forms'),
  ('Concussion Safety', 'https://example.com/concussion.pdf', 'Safety protocols and concussion recognition.', 'Safety');
