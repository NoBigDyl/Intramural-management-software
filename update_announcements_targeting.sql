-- Add targeting columns to announcements table
alter table public.announcements
add column target_type text default 'all' check (target_type in ('all', 'league', 'team', 'user')),
add column target_id uuid; -- Can be null if target_type is 'all'

-- Update existing announcements to be 'all'
update public.announcements
set target_type = 'all'
where target_type is null;
