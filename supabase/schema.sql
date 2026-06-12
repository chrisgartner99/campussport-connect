-- CampusSport Connect – Datenbankschema
-- Zum Ausführen im Supabase SQL Editor (idempotent, kann erneut laufen).

-- ---------------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  studiengang text,
  semester int check (semester between 1 and 20),
  sportarten text[] not null default '{}',
  niveau text check (niveau in ('Anfänger', 'Mittel', 'Fortgeschritten')),
  hochschule text not null default 'Hochschule Heilbronn',
  created_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  titel text not null,
  sportart text not null,
  beschreibung text,
  -- "Was erwartet dich": kurzer Ablauf des Treffens
  ablauf text,
  datum timestamptz not null,
  ort text not null,
  niveau text check (niveau in ('Anfänger', 'Mittel', 'Fortgeschritten')),
  max_plaetze int not null check (max_plaetze > 0),
  erstie_freundlich boolean not null default false,
  hochschule text not null default 'Hochschule Heilbronn',
  created_at timestamptz not null default now()
);

create table if not exists public.participations (
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kommt_allein boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (meeting_id, user_id)
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  empfaenger_id uuid not null references public.profiles (id) on delete cascade,
  nachricht text,
  status text not null default 'offen'
    check (status in ('offen', 'angenommen', 'abgelehnt')),
  created_at timestamptz not null default now(),
  check (sender_id <> empfaenger_id)
);

-- Freundschaften werden normalisiert gespeichert (user_a < user_b),
-- damit jedes Paar nur einmal existieren kann.
create table if not exists public.friendships (
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  empfaenger_id uuid not null references public.profiles (id) on delete cascade,
  inhalt text not null,
  created_at timestamptz not null default now(),
  check (sender_id <> empfaenger_id)
);

-- ---------------------------------------------------------------------------
-- Trigger: angenommener Request legt automatisch eine Freundschaft an
-- ---------------------------------------------------------------------------

create or replace function public.handle_request_accepted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'angenommen' and old.status is distinct from 'angenommen' then
    insert into public.friendships (user_a, user_b)
    values (
      least(new.sender_id, new.empfaenger_id),
      greatest(new.sender_id, new.empfaenger_id)
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_request_accepted on public.requests;
create trigger on_request_accepted
  after update of status on public.requests
  for each row
  execute function public.handle_request_accepted();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.meetings enable row level security;
alter table public.participations enable row level security;
alter table public.requests enable row level security;
alter table public.friendships enable row level security;
alter table public.messages enable row level security;

-- profiles: alle eingeloggten Nutzer dürfen Profile sehen,
-- schreiben darf jeder nur sein eigenes.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- meetings: für alle eingeloggten Nutzer sichtbar,
-- anlegen/ändern/löschen nur durch den Ersteller.
drop policy if exists "meetings_select" on public.meetings;
create policy "meetings_select" on public.meetings
  for select to authenticated using (true);

drop policy if exists "meetings_insert_own" on public.meetings;
create policy "meetings_insert_own" on public.meetings
  for insert to authenticated with check (creator_id = auth.uid());

drop policy if exists "meetings_update_own" on public.meetings;
create policy "meetings_update_own" on public.meetings
  for update to authenticated
  using (creator_id = auth.uid()) with check (creator_id = auth.uid());

drop policy if exists "meetings_delete_own" on public.meetings;
create policy "meetings_delete_own" on public.meetings
  for delete to authenticated using (creator_id = auth.uid());

-- participations: sichtbar für alle eingeloggten Nutzer (Teilnehmerlisten),
-- zu-/absagen kann jeder nur für sich selbst.
drop policy if exists "participations_select" on public.participations;
create policy "participations_select" on public.participations
  for select to authenticated using (true);

drop policy if exists "participations_insert_own" on public.participations;
create policy "participations_insert_own" on public.participations
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "participations_update_own" on public.participations;
create policy "participations_update_own" on public.participations
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "participations_delete_own" on public.participations;
create policy "participations_delete_own" on public.participations
  for delete to authenticated using (user_id = auth.uid());

-- requests: nur Sender und Empfänger sehen die Anfrage.
-- Senden nur im eigenen Namen, beantworten darf nur der Empfänger.
drop policy if exists "requests_select_involved" on public.requests;
create policy "requests_select_involved" on public.requests
  for select to authenticated
  using (auth.uid() in (sender_id, empfaenger_id));

drop policy if exists "requests_insert_own" on public.requests;
create policy "requests_insert_own" on public.requests
  for insert to authenticated with check (sender_id = auth.uid());

drop policy if exists "requests_update_empfaenger" on public.requests;
create policy "requests_update_empfaenger" on public.requests
  for update to authenticated
  using (empfaenger_id = auth.uid()) with check (empfaenger_id = auth.uid());

-- friendships: nur für die beiden Beteiligten sichtbar und löschbar.
-- Angelegt werden Freundschaften ausschließlich über den Request-Trigger
-- (security definer), daher keine Insert-Policy.
drop policy if exists "friendships_select_involved" on public.friendships;
create policy "friendships_select_involved" on public.friendships
  for select to authenticated
  using (auth.uid() in (user_a, user_b));

drop policy if exists "friendships_delete_involved" on public.friendships;
create policy "friendships_delete_involved" on public.friendships
  for delete to authenticated
  using (auth.uid() in (user_a, user_b));

-- messages: nur Sender und Empfänger sehen Nachrichten,
-- gesendet wird nur im eigenen Namen.
drop policy if exists "messages_select_involved" on public.messages;
create policy "messages_select_involved" on public.messages
  for select to authenticated
  using (auth.uid() in (sender_id, empfaenger_id));

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert to authenticated with check (sender_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Indizes
-- ---------------------------------------------------------------------------

-- Treffen-Übersicht sortiert/filtert nach Datum
create index if not exists meetings_datum_idx
  on public.meetings (datum);

create index if not exists meetings_creator_idx
  on public.meetings (creator_id);

-- "Meine Treffen": Teilnahmen eines Nutzers
create index if not exists participations_user_idx
  on public.participations (user_id);

-- Eingegangene Anfragen eines Nutzers
create index if not exists requests_empfaenger_idx
  on public.requests (empfaenger_id, status);

-- Chat-Verlauf eines Nutzerpaars in zeitlicher Reihenfolge
create index if not exists messages_pair_idx
  on public.messages (
    (least(sender_id, empfaenger_id)),
    (greatest(sender_id, empfaenger_id)),
    created_at
  );
