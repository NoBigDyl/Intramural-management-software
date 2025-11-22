-- Allow everyone to update leagues
create policy "Enable update for all users"
on public.leagues
for update
to public
using (true)
with check (true);

-- Allow everyone to delete leagues
create policy "Enable delete for all users"
on public.leagues
for delete
to public
using (true);
