/**
 * 내 주변 매장 검색 (/api/naver?type=nearby_stores)
 *
 * 1) NAVER Maps Reverse Geocoding 으로 좌표 → 동/도로명
 * 2) NAVER 지역 검색(local)으로 "<동> <브랜드>" 실제 매장 조회
 *
 * 재고·행사 정보는 제공처가 없으므로 내려주지 않습니다 (매장 위치만).
 */

const REVGEO_URL = 'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc';
const HUB_LOCAL_URL = 'https://naverapihub.apigw.ntruss.com/search/v1/local';
const OPENAPI_LOCAL_URL = 'https://openapi.naver.com/v1/search/local.json';

const MAX_DISTANCE_M = 3000;

// 브랜드별 검색어와 상호 판별 패턴 (다른 업종·타 브랜드 결과 제외용)
export const NEARBY_BRANDS = {
  CU: { keyword: 'CU', match: /(^|\s)CU(\s|$)|씨유/i },
  GS25: { keyword: 'GS25', match: /GS\s?25|지에스25/i },
  세븐일레븐: { keyword: '세븐일레븐', match: /세븐일레븐|7-?ELEVEN/i },
  이마트24: { keyword: '이마트24', match: /이마트\s?24|emart\s?24/i },
};

const trimEnv = (v) => String(v || '').trim();

const haversine = (lat1, lng1, lat2, lng2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

async function reverseGeocode(lat, lng) {
  const keyId = trimEnv(process.env.NAVER_MAP_CLIENT_ID);
  const key = trimEnv(process.env.NAVER_MAP_CLIENT_SECRET);
  if (!keyId || !key) return { error: 'NAVER_MAP_CLIENT_ID / NAVER_MAP_CLIENT_SECRET 미설정' };

  const res = await fetch(`${REVGEO_URL}?coords=${lng},${lat}&orders=legalcode,admcode,roadaddr&output=json`, {
    headers: { 'x-ncp-apigw-api-key-id': keyId, 'x-ncp-apigw-api-key': key },
  });
  if (!res.ok) return { error: `reverse geocoding ${res.status}` };

  const data = await res.json();
  const pick = (name) => (data.results || []).find((r) => r.name === name);
  const legal = pick('legalcode')?.region;
  const adm = pick('admcode')?.region;
  const road = pick('roadaddr');
  const base = legal || adm;
  if (!base) return { error: '주소를 찾지 못했습니다' };

  return {
    sido: base.area1?.name || '',
    sigungu: base.area2?.name || '',
    legalDong: legal?.area3?.name || '',
    admDong: adm?.area3?.name || '',
    roadName: road?.land?.name || '',
  };
}

async function searchLocal(query, creds) {
  const qs = `?query=${encodeURIComponent(query)}&display=5&sort=random`;
  const attempts = [
    ['hub', HUB_LOCAL_URL, { 'X-NCP-APIGW-API-KEY-ID': creds.hubId, 'X-NCP-APIGW-API-KEY': creds.hubSecret }],
  ];
  if (creds.openId && creds.openSecret) {
    attempts.push(['openapi', OPENAPI_LOCAL_URL, { 'X-Naver-Client-Id': creds.openId, 'X-Naver-Client-Secret': creds.openSecret }]);
  }
  attempts.push(['openapi(hub key)', OPENAPI_LOCAL_URL, { 'X-Naver-Client-Id': creds.hubId, 'X-Naver-Client-Secret': creds.hubSecret }]);

  // 실패 시 경로별 응답 코드·메시지를 남겨 어떤 API 권한이 빠졌는지 알 수 있게 합니다
  const failures = [];
  for (const [via, url, headers] of attempts) {
    try {
      const res = await fetch(url + qs, { headers });
      if (res.ok) return { items: (await res.json()).items || [] };
      const body = await res.json().catch(() => ({}));
      failures.push({ via, status: res.status, message: body?.error?.message || body?.errorMessage || '' });
    } catch (e) {
      failures.push({ via, status: 0, message: 'network' });
    }
  }
  return { items: [], failures };
}

/**
 * @returns {{ status: number, body: object }}
 */
export async function findNearbyStores({ lat, lng, brand, creds }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 33 || lat > 39 || lng < 124 || lng > 132) {
    return { status: 400, body: { error: 'lat/lng 값이 올바르지 않습니다.' } };
  }

  const region = await reverseGeocode(lat, lng);
  if (region.error) return { status: 502, body: { error: region.error } };

  const brands = NEARBY_BRANDS[brand] ? [brand] : Object.keys(NEARBY_BRANDS);
  const areas = [...new Set([region.legalDong, region.admDong, region.roadName].filter(Boolean))];
  const prefix = region.sigungu ? `${region.sigungu} ` : '';

  const jobs = [];
  for (const b of brands) {
    for (const area of areas) jobs.push({ brand: b, query: `${prefix}${area} ${NEARBY_BRANDS[b].keyword}` });
  }
  const results = await Promise.all(jobs.map((j) => searchLocal(j.query, creds)));

  const seen = new Set();
  const stores = [];
  let failed = 0;
  results.forEach((r, i) => {
    if (r.failures) failed += 1;
    const b = jobs[i].brand;
    for (const it of r.items) {
      const name = String(it.title || '').replace(/<[^>]+>/g, '').trim();
      const sLng = Number(it.mapx) / 1e7;
      const sLat = Number(it.mapy) / 1e7;
      if (!name || !NEARBY_BRANDS[b].match.test(name) || !Number.isFinite(sLat) || !Number.isFinite(sLng)) continue;
      const address = it.roadAddress || it.address || '';
      const key = `${name}|${address}`;
      if (seen.has(key)) continue;
      const distance = haversine(lat, lng, sLat, sLng);
      if (distance > MAX_DISTANCE_M) continue;
      seen.add(key);
      stores.push({ id: key, brand: b, name, address, phone: it.telephone || '', lat: sLat, lng: sLng });
    }
  });

  if (stores.length === 0 && failed === jobs.length) {
    return { status: 502, body: { error: '지역 검색 API 호출 실패', failures: results[0]?.failures || [], region } };
  }

  const label = [region.sido, region.sigungu, region.legalDong || region.admDong].filter(Boolean).join(' ');
  return { status: 200, body: { location: label, stores } };
}
