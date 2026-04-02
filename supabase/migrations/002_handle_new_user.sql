-- Auto-create profile + user_settings when a row is inserted into auth.users.
-- Runs as security definer so it works when email confirmation is on (no client session yet).
-- Client passes role + display_name via signUp({ options: { data: { ... } } }).

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

  insert into public.profiles (id, role, display_name)
  values (new.id, r, dn)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
