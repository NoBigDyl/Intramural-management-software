-- Update the insert policy to allow everyone (including anonymous users) to create leagues
-- First, drop the old policy if it exists (or just create a new one)
drop policy if exists "Enable insert for authenticated users only" on public.leagues;

create policy "Enable insert for all users"
on public.leagues
for insert
to public
with check (true);
