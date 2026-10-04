-- Beta privata: solo le email invitate possono creare un account.
-- Il controllo è un hook di Supabase Auth ("before user created"), quindi vale anche
-- per chi chiamasse l'API di Supabase direttamente. Per aprire a tutti: disattivare l'hook.

create table public.beta_invites (
  email text primary key check (email = lower(email)),
  note text,
  created_at timestamptz not null default now()
);

-- Nessuna policy: la tabella è leggibile solo dal service role e dall'hook.
alter table public.beta_invites enable row level security;

create function public.hook_before_user_created(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  user_email text := lower(event -> 'user' ->> 'email');
begin
  if exists (select 1 from public.beta_invites where email = user_email) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error', jsonb_build_object('http_code', 403, 'message', 'beta_invite_required')
  );
end $$;

grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from authenticated, anon, public;
grant select on public.beta_invites to supabase_auth_admin;

-- Account di test locale e il titolare.
insert into public.beta_invites (email, note) values
  ('genitore.test@example.com', 'account di test locale'),
  ('mirco@mircocervi.it', 'titolare');
