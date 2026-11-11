-- 돈키호테 필수템 세부 정보: 세부분류·용량·구매 팁·테마 태그 (운영 DB 적용 완료 2026-11-11)
alter table public.donki_items
  add column if not exists sub_category text,
  add column if not exists volume text,
  add column if not exists buy_tip text,
  add column if not exists tags text[] not null default '{}';

drop function if exists public.get_donki_ranking();
create function public.get_donki_ranking()
 returns table(id text, name text, name_ja text, brand text, category text, sub_category text, volume text, buy_tip text, tags text[], price_yen integer, description text, image_url text, editor_rank integer, badge text, price_krw integer, krw_note text, krw_checked_on date, pick_count bigint, review_count bigint, avg_rating numeric)
 language sql stable security definer set search_path to 'public'
as $function$
    select i.id, i.name, i.name_ja, i.brand, i.category, i.sub_category, i.volume, i.buy_tip, i.tags, i.price_yen,
           i.description, i.image_url, i.editor_rank, i.badge,
           i.price_krw, i.krw_note, i.krw_checked_on,
           (select count(*) from public.donki_picks p where p.item_id = i.id) as pick_count,
           (select count(*) from public.donki_reviews r where r.item_id = i.id) as review_count,
           (select round(avg(r.rating)::numeric, 1) from public.donki_reviews r where r.item_id = i.id) as avg_rating
    from public.donki_items i
    where i.is_active
    order by pick_count desc, i.editor_rank asc;
$function$;
grant execute on function public.get_donki_ranking() to anon, authenticated;
