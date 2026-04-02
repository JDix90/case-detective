-- Admin role, profile email column, site_settings, is_admin(), and RLS for admins.

-- Extend role check and add email (mirrors auth.users.email for admin UI; kept in sync by app + trigger)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('teacher', 'student', 'admin'));

alter table public.profiles add column if not exists email text;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Backfill emails from auth (run as migration owner)
create or replace function public._backfill_profile_emails()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles p
  set email = u.email
  from auth.users u
  where u.id = p.id and (p.email is null or p.email = '');
end;
$$;

select public._backfill_profile_emails();

drop function public._backfill_profile_emails();

-- New signups: store email on profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
  dn text;
begin
  r := coalesce(new.raw_user_meta_data->>'role', 'student');
  if r not in ('teacher', 'student') then
    r := 'student';
  end if;

  dn := nullif(trim(coalesce(new.raw_user_meta_data->>'display_name', '')), '');
  if dn is null or dn = '' then
    dn := coalesce(nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'User');
  end if;

  insert into public.profiles (id, role, display_name, email)
  values (new.id, r, dn, new.email)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Profiles: admins see everyone
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select using (public.is_admin());

-- Classes
drop policy if exists "Admins read all classes" on public.classes;
create policy "Admins read all classes"
  on public.classes for select using (public.is_admin());

drop policy if exists "Admins manage all classes" on public.classes;
create policy "Admins manage all classes"
  on public.classes for all using (public.is_admin()) with check (public.is_admin());

-- Class memberships
drop policy if exists "Admins read all memberships" on public.class_memberships;
create policy "Admins read all memberships"
  on public.class_memberships for select using (public.is_admin());

drop policy if exists "Admins manage all memberships" on public.class_memberships;
create policy "Admins manage all memberships"
  on public.class_memberships for all using (public.is_admin()) with check (public.is_admin());

-- User settings
drop policy if exists "Admins read all user settings" on public.user_settings;
create policy "Admins read all user settings"
  on public.user_settings for select using (public.is_admin());

-- Mastery & sessions (read-only admin)
drop policy if exists "Admins read all mastery" on public.mastery_records;
create policy "Admins read all mastery"
  on public.mastery_records for select using (public.is_admin());

drop policy if exists "Admins read all sessions" on public.session_summaries;
create policy "Admins read all sessions"
  on public.session_summaries for select using (public.is_admin());

-- Assignments
drop policy if exists "Admins read all assignments" on public.assignments;
create policy "Admins read all assignments"
  on public.assignments for select using (public.is_admin());

drop policy if exists "Admins manage all assignments" on public.assignments;
create policy "Admins manage all assignments"
  on public.assignments for all using (public.is_admin()) with check (public.is_admin());

-- Assignment completions
drop policy if exists "Admins read all completions" on public.assignment_completions;
create policy "Admins read all completions"
  on public.assignment_completions for select using (public.is_admin());

-- Site-wide settings (key/value JSON)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value)
values ('general', '{"announcement": ""}'::jsonb)
on conflict (key) do nothing;
