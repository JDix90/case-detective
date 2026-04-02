-- Fixes 42P17 infinite recursion between classes <-> class_memberships RLS policies.
-- Run in SQL Editor if you already applied 001 before this fix.

create or replace function public.student_is_in_class(_student uuid, _class_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.class_memberships
    where student_id = _student and class_id = _class_id
  );
$$;

create or replace function public.teacher_owns_class(_teacher uuid, _class_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.classes
    where id = _class_id and teacher_id = _teacher
  );
$$;

create or replace function public.is_teacher_of_student(_teacher uuid, _student uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships cm
    join public.classes c on c.id = cm.class_id
    where cm.student_id = _student
      and c.teacher_id = _teacher
  );
$$;

grant execute on function public.student_is_in_class(uuid, uuid) to authenticated;
grant execute on function public.teacher_owns_class(uuid, uuid) to authenticated;
grant execute on function public.is_teacher_of_student(uuid, uuid) to authenticated;

drop policy if exists "Teachers can read students in their classes" on public.profiles;
create policy "Teachers can read students in their classes"
  on public.profiles for select using (
    public.is_teacher_of_student(auth.uid(), profiles.id)
  );

drop policy if exists "Students can read classes they belong to" on public.classes;
create policy "Students can read classes they belong to"
  on public.classes for select using (
    public.student_is_in_class(auth.uid(), classes.id)
  );

drop policy if exists "Teachers can read memberships for their classes" on public.class_memberships;
create policy "Teachers can read memberships for their classes"
  on public.class_memberships for select using (
    public.teacher_owns_class(auth.uid(), class_id)
  );

drop policy if exists "Teachers can remove students from their classes" on public.class_memberships;
create policy "Teachers can remove students from their classes"
  on public.class_memberships for delete using (
    public.teacher_owns_class(auth.uid(), class_id)
  );

drop policy if exists "Teachers can read mastery for their students" on public.mastery_records;
create policy "Teachers can read mastery for their students"
  on public.mastery_records for select using (
    public.is_teacher_of_student(auth.uid(), mastery_records.user_id)
  );

drop policy if exists "Teachers can read sessions for their students" on public.session_summaries;
create policy "Teachers can read sessions for their students"
  on public.session_summaries for select using (
    public.is_teacher_of_student(auth.uid(), session_summaries.user_id)
  );

drop policy if exists "Students can read assignments for their classes" on public.assignments;
create policy "Students can read assignments for their classes"
  on public.assignments for select using (
    public.student_is_in_class(auth.uid(), assignments.class_id)
  );
