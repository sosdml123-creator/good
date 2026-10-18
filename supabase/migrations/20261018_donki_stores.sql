-- 돈키호테 가이드: 여행객이 많이 가는 매장 목록 (관리자 탭에서 수정, 앱은 읽기만)

CREATE TABLE IF NOT EXISTS public.donki_stores (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,                 -- 도쿄 / 오사카 / 교토 / 후쿠오카 / 삿포로 / 오키나와 ...
    name TEXT NOT NULL,                 -- 한국어 매장명
    name_ja TEXT NOT NULL,              -- 지도 검색·택시 기사에게 보여줄 일본어 매장명
    area TEXT,                          -- 가까운 역·동네
    feature TEXT,                       -- 한 줄 특징
    sort_order INTEGER NOT NULL DEFAULT 999,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.donki_stores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS donki_stores_read ON public.donki_stores;
CREATE POLICY donki_stores_read ON public.donki_stores FOR SELECT USING (is_active);

INSERT INTO public.donki_stores (id, city, name, name_ja, area, feature, sort_order) VALUES
  ('tokyo-shibuya', '도쿄', 'MEGA 돈키호테 시부야 본점', 'MEGAドン・キホーテ渋谷本店', '시부야역 · 도겐자카', '지상 8층 대형 매장. 통로가 넓어 오래 쇼핑해도 덜 붐벼요', 10),
  ('tokyo-kabukicho', '도쿄', '돈키호테 신주쿠 가부키초점', 'ドン・キホーテ新宿歌舞伎町店', '신주쿠역 · 야스쿠니도리', '늦은 밤에도 쇼핑하기 좋은 매장. 관광객용 기념품·화장품이 많아요', 20),
  ('tokyo-ginza', '도쿄', '돈키호테 긴자 본관', 'ドン・キホーテ銀座本館', '긴자역', '긴자 쇼핑 동선에 넣기 좋은 관광객 중심 매장', 30),
  ('tokyo-akihabara', '도쿄', '돈키호테 아키하바라점', 'ドン・キホーテ秋葉原店', '아키하바라역', '전자상가 거리 한가운데. 캐릭터·애니 굿즈와 함께 둘러보기 좋아요', 40),
  ('tokyo-asakusa', '도쿄', '돈키호테 아사쿠사점', 'ドン・キホーテ浅草店', '아사쿠사역 · 센소지 근처', '센소지 관광 후 들르기 좋은 위치', 50),
  ('tokyo-ikebukuro', '도쿄', '돈키호테 이케부쿠로역 북쪽출구점', 'ドン・キホーテ池袋駅北口店', '이케부쿠로역 북쪽 출구', '역에서 가까워 짐 들고 가기 편해요', 60),
  ('osaka-dotonbori', '오사카', '돈키호테 도톤보리점', 'ドン・キホーテ道頓堀店', '난바 · 도톤보리', '건물 외벽 관람차가 랜드마크. 1층에 관광안내소·면세 카운터', 110),
  ('osaka-midosuji', '오사카', '돈키호테 도톤보리 미도스지점', 'ドン・キホーテ道頓堀御堂筋店', '난바 · 미도스지', '층별 테마 매장: 1층 과자·의약품, 2층 생활용품, 3층 화장품', 120),
  ('osaka-umeda', '오사카', '돈키호테 우메다 본점', 'ドン・キホーテ梅田本店', '우메다역 · 한큐히가시도리', '우메다 숙소라면 가장 가까운 대형 매장', 130),
  ('kyoto-kawaramachi', '교토', '돈키호테 시조가와라마치점', 'ドン・キホーテ四条河原町店', '가와라마치역', '교토 번화가 중심. 니시키 시장과 함께 둘러보기 좋아요', 210),
  ('fukuoka-nakasu', '후쿠오카', '돈키호테 나카스점', 'ドン・キホーテ中洲店', '나카스카와바타역', '나카스 야타이 거리와 가까워 저녁 코스로 좋아요', 310),
  ('fukuoka-tenjin', '후쿠오카', '돈키호테 텐진 본점', 'ドン・キホーテ天神本店', '텐진역', '텐진 쇼핑가 한가운데 위치', 320),
  ('sapporo-tanukikoji', '삿포로', '돈키호테 삿포로 다누키코지 본점', 'ドン・キホーテ札幌狸小路本店', '다누키코지 상점가', '아케이드 상점가 안이라 눈·비 와도 걸어가기 편해요', 410),
  ('okinawa-kokusai', '오키나와', '돈키호테 국제거리점', 'ドン・キホーテ国際通り店', '나하 · 국제거리', '오키나와 한정 과자·기념품을 한 번에 사기 좋아요', 510)
ON CONFLICT (id) DO NOTHING;
