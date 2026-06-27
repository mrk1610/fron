-- Run this entire file in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run

-- Profiles table (one per user, stores the master candidate profile)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  personal_details jsonb default '{}'::jsonb,
  education jsonb default '[]'::jsonb,
  work_experience jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  achievements jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Resumes table (tailored resume variations per user)
create table if not exists resumes (
  id uuid primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  target_job_title text,
  target_company text,
  profile jsonb not null default '{}'::jsonb,
  template text not null default 'modern',
  updated_at text,
  created_at timestamptz default now()
);

-- Job applications table (tracker board entries)
create table if not exists job_applications (
  id uuid primary key,
  user_id uuid references auth.users on delete cascade not null,
  job_title text not null,
  company text not null,
  status text not null default 'Bookmarked',
  date_applied text,
  salary text,
  notes text,
  location text,
  job_url text,
  associated_resume_id text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (users can only access their own rows)
alter table profiles enable row level security;
alter table resumes enable row level security;
alter table job_applications enable row level security;

-- RLS Policies (drop first so this file is safely re-runnable)
drop policy if exists "Users can manage own profile" on profiles;
drop policy if exists "Users can manage own resumes" on resumes;
drop policy if exists "Users can manage own applications" on job_applications;

create policy "Users can manage own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can manage own resumes" on resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own applications" on job_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: auto-create a profiles row whenever a new user signs up
-- (works for both email/password and Google OAuth)
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    personal_details,
    education,
    work_experience,
    skills,
    projects,
    achievements
  ) values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    jsonb_build_object(
      'name',     coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
      'email',    coalesce(new.email, ''),
      'phone',    '',
      'location', '',
      'linkedin', '',
      'website',  ''
    ),
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if re-running this file, then recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
