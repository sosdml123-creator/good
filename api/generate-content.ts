// api/generate-content.ts
// 신상픽 인스타그램 카드뉴스 AI 카피 및 레이아웃 생성 Vercel 서버리스 함수 (Anthropic Claude API)

interface RequestBody {
  prompt: string;
  templateMode?: string;
  aspectRatio?: '1:1' | '4:5' | '9:16';
  products?: Array<{
    name: string;
    brand: string;
    category: string;
    price?: number;
    rating?: number;
    reviewCount?: number | string;
    image?: string;
    description?: string;
    stores?: string[];
  }>;
}

const SYSTEM_PROMPT = `당신은 대한민국 1등 식음료 신제품 큐레이션 플랫폼 '신상픽(SinSangPick)'의 공식 인스타그램 카드뉴스 전문 카피라이터입니다.

[신상픽 인스타 톤앤매너]
1. 친근하고 트렌디한 구어체 (적절한 반말/존댓말 혼용, 이모지 적극 활용, "이거 실화?", "당장 편의점 달려가야 함!")
2. 짧고 임팩트 있는 후크 문구와 한눈에 들어오는 서브카피
3. 과장·허위 정보 금지. 실제 맛과 특징에 집중
4. 상품 데이터에 없는 수치(별점, 리뷰수 등)는 절대 임의로 지어내지 말고, 제공된 DB 값만 사용하거나 자연스럽게 생략
5. 9종 템플릿의 Props 규격을 엄격히 준수:
   - cover_new: { title1, title2, handwriting }
   - hook_photo: { badge, hookTitle, subText, tag, pageIndicator, bgImage }
   - review_card: { badge, brand, productName, rating, reviewCount, description, recommendationTitle, recommendations (3개), productImage, handwriting }
   - top5: { badge, title, subText, items: [{ rank, name, category, image }] (5개) }
   - reels_cover: { stickerText, bgImage, stickerTag, viewsCount }
   - rating_detail: { badge, brand, productName, ratings: [{ label, score }], quote, productImage }
   - photo_dessert: { handwriting, badge, title, description, bgImage }
   - versus: { badge, question, product1: { name, image }, product2: { name, image }, buttonText }
   - cta_app: { handwriting, buttonText, mockImage }

[템플릿 조합 가이드]
- "신상 소개 / 편의점 신상": cover_new -> hook_photo -> review_card -> rating_detail -> cta_app (4~5장)
- "TOP 5 / 랭킹": top5 단독 1장 또는 cover_new -> top5 -> cta_app (3장)
- "비교 / VS / 대결": cover_new -> versus -> review_card -> cta_app (3~4장)
- "릴스 / 숏폼": reels_cover (1장)
- 사용자가 특정 템플릿(templateMode)을 지정한 경우 해당 템플릿을 중심으로 구성.

반드시 마크다운(\`\`\`json 등) 코드블록 없이 순수 JSON 객체만 출력하십시오.`;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, templateMode = 'auto', aspectRatio = '1:1', products = [] } = (req.body || {}) as RequestBody;

  if (!prompt && products.length === 0) {
    return res.status(400).json({ error: '요청 문구 또는 상품 데이터가 필요합니다.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Fallback: ANTHROPIC_API_KEY가 없을 경우 스마트 룰베이스 생성기 반환
  if (!apiKey) {
    console.warn('[api/generate-content] ANTHROPIC_API_KEY is not set. Generating smart fallback package.');
    const fallback = generateSmartFallbackContent(prompt || '화제의 신상 총정리', templateMode, aspectRatio, products);
    return res.status(200).json(fallback);
  }

  const userMessage = `[사용자 요청문]: "${prompt}"
[선택한 템플릿 모드]: "${templateMode}"
[비율]: "${aspectRatio}"
[선택된 상품 데이터]:
${JSON.stringify(products, null, 2)}

위 요청과 상품 데이터를 바탕으로 완벽한 인스타그램 카드뉴스 패키지 JSON을 만들어주세요.
반드시 아래 JSON 스키마를 만족해야 합니다:
{
  "caption": "인스타 캡션 내용 (3줄 이상, 엔터 포함)",
  "hashtags": ["#해시태그1", "#해시태그2" ... 총 15개],
  "slides": [
    {
      "templateType": "템플릿타입 (9종 중 하나)",
      "props": { ...해당 템플릿 props }
    }
  ]
}`;

  // Anthropic API 호출 함수 (실패 시 1회 재시도)
  async function callAnthropic(): Promise<any> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.content?.[0]?.text || '';
    
    // JSON 파싱 (마크다운 백틱 제거)
    const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  try {
    let result: any;
    try {
      result = await callAnthropic();
    } catch (firstErr) {
      console.warn('[api/generate-content] First attempt failed, retrying once...', firstErr);
      result = await callAnthropic();
    }

    // 슬라이드 각 항목에 고유 id 부여
    if (result && Array.isArray(result.slides)) {
      result.slides = result.slides.map((s: any, idx: number) => ({
        id: `slide-${Date.now()}-${idx}`,
        templateType: s.templateType,
        props: s.props || {},
      }));
    }

    return res.status(200).json({
      id: `gen-${Date.now()}`,
      prompt,
      aspectRatio,
      caption: result.caption || '',
      hashtags: Array.isArray(result.hashtags) ? result.hashtags : [],
      slides: result.slides || [],
      created_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[api/generate-content] Error:', error);
    // AI 에러 발생 시에도 빈 화면 대신 스마트 룰베이스 폴백 반환
    const fallback = generateSmartFallbackContent(prompt || '신상 추천', templateMode, aspectRatio, products);
    return res.status(200).json(fallback);
  }
}

/** ANTHROPIC_API_KEY 미설정 또는 네트워크 오류 시 스마트 생성 fallback */
function generateSmartFallbackContent(
  prompt: string,
  mode: string,
  aspectRatio: '1:1' | '4:5' | '9:16',
  products: any[]
) {
  const p1 = products[0] || {
    name: '불닭볶음면 까르보',
    brand: '삼양',
    category: '라면',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop',
    rating: 4.3,
  };
  const p2 = products[1] || {
    name: '포카칩 어니언버터',
    brand: '오리온',
    category: '간식',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop',
    rating: 4.1,
  };

  const slides: any[] = [];

  if (mode === 'top5' || prompt.includes('TOP') || prompt.includes('탑') || prompt.includes('순위')) {
    slides.push({
      id: `slide-${Date.now()}-1`,
      templateType: 'top5',
      props: {
        badge: 'THIS WEEK',
        title: '이번 주 신상 TOP 5',
        subText: '지금 가장 핫한 신상만 모았어요!',
        items: products.slice(0, 5).map((p, idx) => ({
          rank: idx + 1,
          name: p.name,
          category: p.category || '간식',
          image: p.image || p1.image,
        })),
      },
    });
  } else if (mode === 'versus' || prompt.includes('VS') || prompt.includes('비교')) {
    slides.push({
      id: `slide-${Date.now()}-1`,
      templateType: 'cover_new',
      props: {
        title1: '신상 맞대결',
        title2: '신상픽 VS',
        handwriting: '어떤 맛이\n더 맛있을까?',
      },
    });
    slides.push({
      id: `slide-${Date.now()}-2`,
      templateType: 'versus',
      props: {
        badge: '신상 비교',
        question: `${p1.name} VS ${p2.name}\n당신의 선택은?`,
        product1: { name: p1.name, image: p1.image },
        product2: { name: p2.name, image: p2.image },
        buttonText: '지금 바로 투표하기 →',
      },
    });
    slides.push({
      id: `slide-${Date.now()}-3`,
      templateType: 'cta_app',
      props: {
        handwriting: '더 많은 신상이\n궁금하다면?',
        buttonText: '앱에서 만나요 →',
      },
    });
  } else {
    // 기본 풀 패키지 (cover -> hook -> review -> cta)
    slides.push({
      id: `slide-${Date.now()}-1`,
      templateType: 'cover_new',
      props: {
        title1: '지금, 가장 새로운 맛',
        title2: '신상픽',
        handwriting: '새로운\n맛을\n만나다',
      },
    });
    slides.push({
      id: `slide-${Date.now()}-2`,
      templateType: 'hook_photo',
      props: {
        badge: 'NEW',
        hookTitle: `${p1.brand || '편의점'}에\n이거 나왔어요!`,
        subText: `${p1.name} 실물 영접!\n이 조합 못 참지..`,
        tag: '신상픽',
        pageIndicator: '1/3',
        bgImage: p1.image,
      },
    });
    slides.push({
      id: `slide-${Date.now()}-3`,
      templateType: 'review_card',
      props: {
        badge: 'NEW',
        brand: p1.brand,
        productName: p1.name,
        rating: p1.rating || 4.3,
        reviewCount: '1,245',
        description: `${p1.name}의 색다른 매력!\n직접 먹어본 사람들의 솔직한 후기 총정리`,
        recommendationTitle: '이런 분께 추천해요',
        recommendations: [
          `${p1.category || '간식'} 신메뉴를 기다려온 분`,
          '트렌디한 맛을 먼저 맛보고 싶은 얼리어먹터',
          '실패 없는 신상을 찾는 분',
        ],
        productImage: p1.image,
        handwriting: '이 조합 진짜 맛있다!',
      },
    });
    slides.push({
      id: `slide-${Date.now()}-4`,
      templateType: 'cta_app',
      props: {
        handwriting: '더 많은 신상이\n궁금하다면?',
        buttonText: '앱에서 만나요 →',
      },
    });
  }

  return {
    id: `fallback-${Date.now()}`,
    prompt,
    aspectRatio,
    caption: `🔥 이번 주 편의점 & 식음료 신상 총정리!\n\n눈뜨자마자 달려가야 할 화제의 신상 라인업 대공개!👀\n여러분의 오늘 원픽은 무엇인가요? 지금 댓글로 알려주세요! 👇\n더 많은 실시간 리뷰와 평점은 프로필 링크 '신상픽' 앱에서 확인하세요!`,
    hashtags: [
      '#신상픽', '#편의점신상', '#신상과자', '#신상라면', '#신상음료',
      '#디저트스타그램', '#먹스타그램', '#간식추천', '#편의점꿀조합', '#신제품리뷰',
      '#편의점신제품', '#CU신상', '#GS25신상', '#세븐일레븐신상', '#맛스타그램'
    ],
    slides,
    created_at: new Date().toISOString(),
  };
}
