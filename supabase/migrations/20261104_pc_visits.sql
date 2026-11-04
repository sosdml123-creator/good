-- PC 사이트(pc.sinsangpick.kr) 방문 기록. 브라우저는 기록만 쓰고, 집계는 관리자 서버(service role)만 읽습니다.
create table if not exists public.pc_visits (
  id bigserial primary key,
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  path text not null default '/' check (char_length(path) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists pc_visits_created_at_idx on public.pc_visits (created_at);

alter table public.pc_visits enable row level security;

drop policy if exists "pc_visits_insert" on public.pc_visits;
create policy "pc_visits_insert" on public.pc_visits
  for insert to anon, authenticated
  with check (created_at > now() - interval '1 minute' and created_at < now() + interval '1 minute');

-- 최근 N일(한국 시간 날짜) 방문자·페이지뷰
create or replace function public.pc_visitor_daily(days int default 14)
returns table (day date, visitors bigint, pageviews bigint)
language sql
stable
security definer
set search_path = public
as $$
  with range as (
    select generate_series(
      (now() at time zone 'Asia/Seoul')::date - (days - 1),
      (now() at time zone 'Asia/Seoul')::date,
      interval '1 day'
    )::date as day
  )
  select r.day,
         count(distinct v.visitor_id) as visitors,
         count(v.id) as pageviews
  from range r
  left join public.pc_visits v
    on (v.created_at at time zone 'Asia/Seoul')::date = r.day
  group by r.day
  order by r.day;
$$;

create or replace function public.pc_visitor_total(days int default 14)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(distinct visitor_id)
  from public.pc_visits
  where created_at >= ((now() at time zone 'Asia/Seoul')::date - (days - 1))::timestamp at time zone 'Asia/Seoul';
$$;

revoke all on function public.pc_visitor_daily(int) from public, anon, authenticated;
revoke all on function public.pc_visitor_total(int) from public, anon, authenticated;
grant execute on function public.pc_visitor_daily(int) to service_role;
grant execute on function public.pc_visitor_total(int) to service_role;
