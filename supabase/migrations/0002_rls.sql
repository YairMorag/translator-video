-- Row Level Security for NextPlay Academy.
-- Mirrors the access rules enforced in the app layer today (lib/auth,
-- lib/data/store.ts) so a future Supabase-backed build stays safe even if
-- an application bug bypasses the app-layer checks.

alter table schools enable row level security;
alter table teams enable row level security;
alter table profiles enable row level security;
alter table players enable row level security;
alter table parent_player_links enable row level security;
alter table coach_team_links enable row level security;
alter table task_catalog enable row level security;
alter table weekly_plans enable row level security;
alter table assigned_tasks enable row level security;
alter table task_reports enable row level security;
alter table coach_notes enable row level security;
alter table consents enable row level security;
alter table risk_flags enable row level security;

-- ---------- Helper functions ----------
-- security definer so they can read `profiles` regardless of the caller's
-- own row-level policy (avoids recursive policy evaluation).

create or replace function current_profile_id()
returns uuid
language sql
security definer
stable
as $$
  select id from profiles where auth_user_id = auth.uid()
$$;

create or replace function current_profile_role()
returns role
language sql
security definer
stable
as $$
  select role from profiles where auth_user_id = auth.uid()
$$;

create or replace function current_school_id()
returns uuid
language sql
security definer
stable
as $$
  select school_id from profiles where auth_user_id = auth.uid()
$$;

create or replace function is_coach_of_player(target_player_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from players p
    join coach_team_links ctl on ctl.team_id = p.team_id
    where p.id = target_player_id
      and ctl.coach_profile_id = current_profile_id()
  )
$$;

create or replace function is_parent_of_player(target_player_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from parent_player_links
    where player_id = target_player_id
      and parent_profile_id = current_profile_id()
  )
$$;

create or replace function is_own_player(target_player_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from players
    where id = target_player_id
      and profile_id = current_profile_id()
  )
$$;

create or replace function can_access_player(target_player_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select current_profile_role() = 'school_admin'
    or is_coach_of_player(target_player_id)
    or is_parent_of_player(target_player_id)
    or is_own_player(target_player_id)
$$;

-- ---------- Schools & profiles ----------

create policy "school members can read their school"
  on schools for select
  using (id = current_school_id());

create policy "profiles are readable within the same school"
  on profiles for select
  using (school_id = current_school_id());

create policy "users can update their own profile"
  on profiles for update
  using (auth_user_id = auth.uid());

-- ---------- Teams ----------

create policy "school members can read teams in their school"
  on teams for select
  using (school_id = current_school_id());

create policy "coaches manage their own teams"
  on teams for update
  using (coach_id = current_profile_id());

-- ---------- Players ----------

create policy "admins read all players in their school"
  on players for select
  using (
    current_profile_role() = 'school_admin' and school_id = current_school_id()
  );

create policy "coaches read players on their teams"
  on players for select
  using (is_coach_of_player(id));

create policy "parents read their linked children"
  on players for select
  using (is_parent_of_player(id));

create policy "players read their own row"
  on players for select
  using (is_own_player(id));

create policy "coaches update players on their teams"
  on players for update
  using (is_coach_of_player(id));

-- ---------- Parent/coach link tables ----------

create policy "parents read their own links"
  on parent_player_links for select
  using (parent_profile_id = current_profile_id());

create policy "coaches read their own team links"
  on coach_team_links for select
  using (coach_profile_id = current_profile_id());

-- ---------- Task catalog (shared reference data) ----------

create policy "any authenticated user can read the task catalog"
  on task_catalog for select
  using (auth.role() = 'authenticated');

-- ---------- Weekly plans & assigned tasks ----------

create policy "player-linked roles read weekly plans"
  on weekly_plans for select
  using (can_access_player(player_id));

create policy "coaches manage weekly plans for their players"
  on weekly_plans for all
  using (is_coach_of_player(player_id))
  with check (is_coach_of_player(player_id));

create policy "player-linked roles read assigned tasks"
  on assigned_tasks for select
  using (can_access_player(player_id));

create policy "coaches manage assigned tasks for their players"
  on assigned_tasks for all
  using (is_coach_of_player(player_id))
  with check (is_coach_of_player(player_id));

create policy "players update their own assigned task status"
  on assigned_tasks for update
  using (is_own_player(player_id))
  with check (is_own_player(player_id));

-- ---------- Task reports ----------
-- Pain and fatigue reports are safety-critical: only the reporting player
-- may create them, and every player-linked role may read them.

create policy "player-linked roles read task reports"
  on task_reports for select
  using (can_access_player(player_id));

create policy "players submit their own task reports"
  on task_reports for insert
  with check (is_own_player(player_id));

-- ---------- Coach notes ----------
-- Private notes stay coach + admin only; parent_visible notes are also
-- readable by the linked parent.

create policy "coaches read and write their own notes"
  on coach_notes for all
  using (coach_id = current_profile_id())
  with check (coach_id = current_profile_id());

create policy "admins read all notes in their school"
  on coach_notes for select
  using (
    current_profile_role() = 'school_admin'
    and exists (select 1 from players p where p.id = player_id and p.school_id = current_school_id())
  );

create policy "parents read parent-visible notes for their children"
  on coach_notes for select
  using (visibility = 'parent_visible' and is_parent_of_player(player_id));

-- ---------- Consents ----------

create policy "parents manage consent for their linked children"
  on consents for all
  using (parent_profile_id = current_profile_id())
  with check (parent_profile_id = current_profile_id());

create policy "coaches and admins read consent status"
  on consents for select
  using (is_coach_of_player(player_id) or current_profile_role() = 'school_admin');

-- ---------- Risk flags ----------
-- Safety flags are visible to every role connected to the player, but only
-- coaches/admins may resolve them.

create policy "player-linked roles read risk flags"
  on risk_flags for select
  using (can_access_player(player_id));

create policy "coaches manage risk flags for their players"
  on risk_flags for all
  using (is_coach_of_player(player_id) or current_profile_role() = 'school_admin')
  with check (is_coach_of_player(player_id) or current_profile_role() = 'school_admin');
