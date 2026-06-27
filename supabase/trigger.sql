create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, name, personal_details, education, work_experience, skills, projects, achievements
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    jsonb_build_object(
      'name',     coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
      'email',    coalesce(new.email, ''),
      'phone',    '', 'location', '', 'linkedin', '', 'website', ''
    ),
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
