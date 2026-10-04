-- Blocco temporaneo del PIN dopo troppi tentativi sbagliati (colonne solo lato server).
alter table public.parents
  add column pin_failed_attempts int not null default 0,
  add column pin_locked_until timestamptz;
