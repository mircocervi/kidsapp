-- Schema iniziale.
-- Principi: minimizzazione (nessun nome reale, data di nascita, foto o email del bambino),
-- isolamento per famiglia via RLS, cancellazione automatica delle chat dopo 90 giorni.

create extension if not exists pg_cron with schema pg_catalog;

-- Classe scolastica: è l'unico dato "anagrafico" del bambino, serve per i guardrail
-- del chatbot e per il livello dei giochi.
create type public.grade as enum (
  'pre3', 'pre4', 'pre5',            -- scuola dell'infanzia / pre-school (3, 4, 5 anni)
  'g1', 'g2', 'g3', 'g4', 'g5',      -- primaria
  'm1', 'm2', 'm3'                   -- secondaria di primo grado (solo chat)
);

create type public.chat_mode as enum ('socratic', 'direct');
create type public.message_role as enum ('child', 'assistant');
create type public.safety_category as enum (
  'self_harm', 'abuse', 'bullying', 'sexual', 'violence',
  'dangerous', 'hate', 'personal_info', 'other'
);
create type public.alert_severity as enum ('info', 'warning', 'urgent');

-- Il genitore: 1:1 con auth.users. L'email vive solo in auth.users.
create table public.parents (
  id uuid primary key references auth.users (id) on delete cascade,
  locale text not null default 'en',
  country text,                                   -- ISO 3166-1 alpha-2, per età del consenso e numeri di aiuto
  consent_version text,                           -- versione dell'informativa accettata
  consent_at timestamptz,                         -- consenso del titolare della responsabilità genitoriale (art. 8 GDPR)
  adult_confirmed_at timestamptz,                 -- dichiarazione di maggiore età
  pin_hash text,                                  -- PIN dell'area genitore (scrypt, mai in chiaro)
  chat_mode public.chat_mode not null default 'socratic',
  daily_limit_minutes int check (daily_limit_minutes between 5 and 240),
  quiet_hours_start time,                         -- es. 20:30 → app in pausa
  quiet_hours_end time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  avatar text not null,                           -- id di un avatar predefinito, mai foto
  grade public.grade not null,
  mascot text,                                    -- scelta dal bambino al primo accesso
  locale text,                                    -- se null usa quella del genitore
  chat_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.children (parent_id);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  role public.message_role not null,
  content text not null,                          -- già ripulito dai dati personali riconosciuti
  flagged boolean not null default false,
  flag_category public.safety_category,
  model text,                                     -- modello che ha generato la risposta (tracciabilità AI Act)
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index on public.chat_messages (child_id, created_at desc);
create index on public.chat_messages (expires_at);

create table public.safety_alerts (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  message_id uuid references public.chat_messages (id) on delete set null,
  category public.safety_category not null,
  severity public.alert_severity not null,
  seen_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index on public.safety_alerts (parent_id, created_at desc);

-- Statistiche d'uso dei giochi: solo esiti aggregabili, nessun contenuto.
create table public.activity_results (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  game_id text not null,
  subject text not null,
  level int not null,
  correct int not null check (correct >= 0),
  total int not null check (total > 0),
  duration_seconds int not null check (duration_seconds >= 0),
  created_at timestamptz not null default now()
);
create index on public.activity_results (child_id, created_at desc);

-- updated_at automatico
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger parents_touch before update on public.parents
  for each row execute function public.touch_updated_at();
create trigger children_touch before update on public.children
  for each row execute function public.touch_updated_at();

-- Riga parents creata alla registrazione
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.parents (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: ogni genitore vede e modifica solo la propria famiglia.
alter table public.parents enable row level security;
alter table public.children enable row level security;
alter table public.chat_messages enable row level security;
alter table public.safety_alerts enable row level security;
alter table public.activity_results enable row level security;

create policy "parent reads self" on public.parents
  for select using ((select auth.uid()) = id);
create policy "parent updates self" on public.parents
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "parent manages children" on public.children
  for all using ((select auth.uid()) = parent_id) with check ((select auth.uid()) = parent_id);

-- Chat e avvisi: scritti solo dal server (service role) dopo i controlli di sicurezza;
-- il genitore li legge e li può cancellare.
create policy "parent reads chat" on public.chat_messages
  for select using ((select auth.uid()) = parent_id);
create policy "parent deletes chat" on public.chat_messages
  for delete using ((select auth.uid()) = parent_id);

create policy "parent reads alerts" on public.safety_alerts
  for select using ((select auth.uid()) = parent_id);
create policy "parent updates alerts" on public.safety_alerts
  for update using ((select auth.uid()) = parent_id) with check ((select auth.uid()) = parent_id);
create policy "parent deletes alerts" on public.safety_alerts
  for delete using ((select auth.uid()) = parent_id);

create policy "parent reads results" on public.activity_results
  for select using ((select auth.uid()) = parent_id);
create policy "family inserts results" on public.activity_results
  for insert with check (
    (select auth.uid()) = parent_id
    and exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid()))
  );
create policy "parent deletes results" on public.activity_results
  for delete using ((select auth.uid()) = parent_id);

-- Il PIN non deve mai uscire verso il client e consenso/PIN si scrivono solo dal server:
-- i privilegi di colonna funzionano solo se si toglie prima quello di tabella.
revoke select, insert, update, delete on public.parents from anon, authenticated;
grant select (id, locale, country, consent_version, consent_at, adult_confirmed_at,
              chat_mode, daily_limit_minutes, quiet_hours_start, quiet_hours_end, created_at, updated_at)
  on public.parents to authenticated;
grant update (locale, country, chat_mode, daily_limit_minutes, quiet_hours_start, quiet_hours_end)
  on public.parents to authenticated;

revoke insert, update on public.chat_messages from anon, authenticated;
revoke insert on public.safety_alerts from anon, authenticated;

-- Retention: cancellazione automatica ogni notte alle 03:00 UTC.
select cron.schedule(
  'purge-expired-chat',
  '0 3 * * *',
  $$
    delete from public.chat_messages where expires_at < now();
    delete from public.safety_alerts where expires_at < now();
    delete from public.activity_results where created_at < now() - interval '13 months';
  $$
);
