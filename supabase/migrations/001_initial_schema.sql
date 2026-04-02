-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('teacher', 'student')),
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Classes
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  join_code text not null unique,
  created_at timestamptz not null default now()
);

alter table public.classes enable row level security;

create policy "Teachers can manage own classes"
  on public.classes for all using (teacher_id = auth.uid());

create policy "Anyone authenticated can read class by join_code"
  on public.classes for select using (auth.role() = 'authenticated');

-- Class memberships
create table if not exists public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(class_id, student_id)
);

alter table public.class_memberships enable row level security;

-- Membership checks in SECURITY DEFINER functions bypass RLS so policies on classes
-- and class_memberships do not recurse (42P17).
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

create policy "Students can read own memberships"
  on public.class_memberships for select using (student_id = auth.uid());

create policy "Students can join classes"
  on public.class_memberships for insert with check (student_id = auth.uid());

create policy "Teachers can read memberships for their classes"
  on public.class_memberships for select using (
    public.teacher_owns_class(auth.uid(), class_id)
  );

create policy "Teachers can remove students from their classes"
  on public.class_memberships for delete using (
    public.teacher_owns_class(auth.uid(), class_id)
  );

-- Policies below need class_memberships to exist; use helper functions above (no RLS recursion).
create policy "Teachers can read students in their classes"
  on public.profiles for select using (
    public.is_teacher_of_student(auth.uid(), profiles.id)
  );

create policy "Students can read classes they belong to"
  on public.classes for select using (
    public.student_is_in_class(auth.uid(), classes.id)
  );

-- User settings
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  audio_enabled boolean not null default false,
  difficulty text not null default 'standard',
  show_helper_words boolean not null default true,
  show_english_gloss boolean not null default true,
  active_categories text[] not null default '{pronoun}'
);

alter table public.user_settings enable row level security;

create policy "Users manage own settings"
  on public.user_settings for all using (user_id = auth.uid());

-- Mastery records
create table if not exists public.mastery_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  form_key text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  last_seen_at timestamptz not null default now(),
  last_correct_at timestamptz,
  ease_score double precision not null default 1.0,
  mastery_score integer not null default 0,
  consecutive_correct integer not null default 0,
  consecutive_wrong integer not null default 0,
  confusion_with text[] not null default '{}',
  status text not null default 'unseen',
  unique(user_id, form_key)
);

alter table public.mastery_records enable row level security;

create policy "Users manage own mastery records"
  on public.mastery_records for all using (user_id = auth.uid());

create policy "Teachers can read mastery for their students"
  on public.mastery_records for select using (
    public.is_teacher_of_student(auth.uid(), mastery_records.user_id)
  );

-- Session summaries
create table if not exists public.session_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode_id text not null,
  score integer not null default 0,
  accuracy double precision not null default 0,
  average_response_ms integer not null default 0,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  best_streak integer not null default 0,
  weak_forms text[] not null default '{}',
  confusion_pairs_hit text[] not null default '{}',
  completed_at timestamptz not null default now(),
  categories text[] not null default '{}'
);

alter table public.session_summaries enable row level security;

create policy "Users manage own sessions"
  on public.session_summaries for all using (user_id = auth.uid());

create policy "Teachers can read sessions for their students"
  on public.session_summaries for select using (
    public.is_teacher_of_student(auth.uid(), session_summaries.user_id)
  );

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  mode_id text,
  case_ids text[] not null default '{}',
  categories text[] not null default '{}',
  min_questions integer not null default 10,
  min_accuracy double precision not null default 0.7,
  due_date timestamptz,
  created_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

create policy "Teachers manage own assignments"
  on public.assignments for all using (teacher_id = auth.uid());

create policy "Students can read assignments for their classes"
  on public.assignments for select using (
    public.student_is_in_class(auth.uid(), assignments.class_id)
  );

-- Assignment completions
create table if not exists public.assignment_completions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  session_summary_id uuid references public.session_summaries(id),
  completed_at timestamptz not null default now(),
  unique(assignment_id, student_id)
);

alter table public.assignment_completions enable row level security;

create policy "Students manage own completions"
  on public.assignment_completions for all using (student_id = auth.uid());

create policy "Teachers can read completions for their assignments"
  on public.assignment_completions for select using (
    exists (
      select 1 from public.assignments
      where id = assignment_completions.assignment_id
        and teacher_id = auth.uid()
    )
  );

-- Indexes
create index if not exists idx_mastery_user on public.mastery_records(user_id);
create index if not exists idx_sessions_user on public.session_summaries(user_id);
create index if not exists idx_memberships_student on public.class_memberships(student_id);
create index if not exists idx_memberships_class on public.class_memberships(class_id);
create index if not exists idx_assignments_class on public.assignments(class_id);
create index if not exists idx_completions_assignment on public.assignment_completions(assignment_id);
create index if not exists idx_classes_join_code on public.classes(join_code);
