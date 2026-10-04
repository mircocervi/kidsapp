-- Amici, sfide e messaggi (docs/design/amici-sfide-messaggi.md).
-- Regola d'oro: un'amicizia esiste solo se entrambi i genitori l'hanno approvata
-- (A genera un codice per un figlio, B lo riscatta scegliendo un proprio figlio).
-- Tutte le scritture passano dal server dopo i controlli; la RLS consente ai genitori solo letture.

create table public.friend_invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z2-9]{8}$'),
  parent_id uuid not null references public.parents (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  expires_at timestamptz not null default now() + interval '48 hours',
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.friend_invites (parent_id);

create type public.friendship_status as enum ('active', 'blocked');

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  child_a uuid not null references public.children (id) on delete cascade,
  child_b uuid not null references public.children (id) on delete cascade,
  parent_a uuid not null references public.parents (id) on delete cascade,
  parent_b uuid not null references public.parents (id) on delete cascade,
  status public.friendship_status not null default 'active',
  blocked_by uuid references public.children (id) on delete set null,
  created_at timestamptz not null default now(),
  check (child_a <> child_b)
);
create unique index friendships_pair on public.friendships (least(child_a, child_b), greatest(child_a, child_b));
create index on public.friendships (parent_a);
create index on public.friendships (parent_b);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  friendship_id uuid not null references public.friendships (id) on delete cascade,
  from_child uuid not null references public.children (id) on delete cascade,
  to_child uuid not null references public.children (id) on delete cascade,
  game_id text not null,
  level int not null,
  seed int not null,
  from_correct int,
  to_correct int,
  total int not null default 8,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  completed_at timestamptz
);
create index on public.challenges (friendship_id, created_at desc);

create type public.friend_message_kind as enum ('sticker', 'phrase', 'text');

create table public.friend_messages (
  id uuid primary key default gen_random_uuid(),
  friendship_id uuid not null references public.friendships (id) on delete cascade,
  from_child uuid not null references public.children (id) on delete cascade,
  to_child uuid not null references public.children (id) on delete cascade,
  kind public.friend_message_kind not null,
  content text not null check (char_length(content) <= 300),
  delivered boolean not null default true,       -- false: bloccato dal controllo di sicurezza
  flag_category public.safety_category,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index on public.friend_messages (friendship_id, created_at desc);

-- Avvisi anche per i messaggi tra amici e per le segnalazioni dei bambini.
alter type public.safety_category add value if not exists 'friend_report';
alter table public.safety_alerts add column friend_message_id uuid references public.friend_messages (id) on delete set null;

-- RLS: i genitori leggono ciò che riguarda i propri figli; nessuna scrittura diretta dal client.
alter table public.friend_invites enable row level security;
alter table public.friendships enable row level security;
alter table public.challenges enable row level security;
alter table public.friend_messages enable row level security;

create policy "parent reads own invites" on public.friend_invites
  for select using ((select auth.uid()) = parent_id);

create policy "parents read friendships" on public.friendships
  for select using ((select auth.uid()) in (parent_a, parent_b));

create policy "parents read challenges" on public.challenges
  for select using (exists (
    select 1 from public.friendships f
    where f.id = friendship_id and (select auth.uid()) in (f.parent_a, f.parent_b)
  ));

create policy "parents read friend messages" on public.friend_messages
  for select using (exists (
    select 1 from public.friendships f
    where f.id = friendship_id and (select auth.uid()) in (f.parent_a, f.parent_b)
  ));

revoke insert, update, delete on public.friend_invites, public.friendships, public.challenges, public.friend_messages
  from anon, authenticated;

-- Retention
select cron.schedule(
  'purge-friends',
  '15 3 * * *',
  $$
    delete from public.friend_messages where expires_at < now();
    delete from public.friend_invites where expires_at < now() - interval '1 day';
    delete from public.challenges where created_at < now() - interval '13 months';
  $$
);
