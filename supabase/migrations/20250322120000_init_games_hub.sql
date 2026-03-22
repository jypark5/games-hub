-- Games hub: profiles, game catalog, and generic game results (Wordle, Snake, 2048, …)

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Game types (extensible catalog; FK keeps slugs consistent)
-- ---------------------------------------------------------------------------
create table public.game_types (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.game_types enable row level security;

create policy "Game types are readable by everyone"
  on public.game_types for select
  using (true);

insert into public.game_types (slug, name) values
  ('wordle', 'Wordle'),
  ('snake', 'Snake'),
  ('game_2048', '2048');

-- ---------------------------------------------------------------------------
-- Game results: one row per finished session (or submission)
-- score: higher = better for arcade/high-score games; Wordle can encode e.g. win bonus + guesses left
-- details: jsonb for game-specific payloads (guesses, board state summary, duration, etc.)
-- ---------------------------------------------------------------------------
create table public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  game_slug text not null references public.game_types (slug),
  score bigint,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index game_results_user_game_created_idx
  on public.game_results (user_id, game_slug, created_at desc);

alter table public.game_results enable row level security;

create policy "Users can read own game results"
  on public.game_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own game results"
  on public.game_results for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
