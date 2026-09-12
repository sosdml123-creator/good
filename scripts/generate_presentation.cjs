const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches

  const COLOR_PRIMARY = '0F172A'; // Dark Navy
  const COLOR_BLUE = '0066FF';    // Brand Blue
  const COLOR_ORANGE = 'FF6B00';  // Appetite Orange
  const COLOR_AMBER = 'F59E0B';   // Gold
  const COLOR_DARK = '1E293B';    // Charcoal
  const COLOR_MUTED = '64748B';   // Slate Gray
  const COLOR_BG = 'F8FAFC';      // Soft Light Blue/Gray
  const COLOR_WHITE = 'FFFFFF';
  const COLOR_BORDER = 'E2E8F0';
  const FONT_TITLE = 'Malgun Gothic';
  const FONT_BODY = 'Malgun Gothic';

  // Helper function to add common header to slides
  function addSlideHeader(slide, category, title, subtitle) {
    slide.background = { color: COLOR_BG };

    // Category Pill Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 0.5,
      w: 2.2,
      h: 0.35,
      rectRadius: 0.1,
      fill: { color: 'E0EDFF' },
      line: { color: 'BFDBFE', width: 1 }
    });
    slide.addText(category, {
      x: 0.8,
      y: 0.5,
      w: 2.2,
      h: 0.35,
      fontSize: 10,
      fontFace: FONT_TITLE,
      color: COLOR_BLUE,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // Main Title
    slide.addText(title, {
      x: 0.8,
      y: 0.95,
      w: 11.5,
      h: 0.6,
      fontSize: 22,
      fontFace: FONT_TITLE,
      color: COLOR_PRIMARY,
      bold: true,
      valign: 'middle'
    });

    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.5,
        w: 11.5,
        h: 0.35,
        fontSize: 12,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        valign: 'middle'
      });
    }

    // Top Right Logo Tag
    slide.addText("신상픽 SinSangPick", {
      x: 10.5,
      y: 0.5,
      w: 2.0,
      h: 0.35,
      fontSize: 11,
      fontFace: FONT_TITLE,
      color: COLOR_MUTED,
      bold: true,
      align: 'right',
      valign: 'middle'
    });

    // Footer
    slide.addText("신상 먹거리 정보 & 큐레이션 플랫폼 「신상픽」 서비스 소개 및 사업 기획서", {
      x: 0.8,
      y: 7.05,
      w: 10.0,
      h: 0.3,
      fontSize: 9,
      fontFace: FONT_BODY,
      color: '94A3B8'
    });
  }

  // ==========================================
  // SLIDE 1: 표지 (Cover)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_PRIMARY };

    // Decorative background shapes
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.5,
      y: -1.0,
      w: 6.0,
      h: 6.0,
      rectRadius: 0.5,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 9.5,
      y: 3.5,
      w: 5.0,
      h: 5.0,
      rectRadius: 0.5,
      fill: { color: '0066FF' },
      line: { color: '38BDF8', width: 1 }
    });

    // Sub Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 1.8,
      w: 2.8,
      h: 0.45,
      rectRadius: 0.15,
      fill: { color: '0066FF' }
    });
    slide.addText("APP SERVICE PROPOSAL", {
      x: 1.0,
      y: 1.8,
      w: 2.8,
      h: 0.45,
      fontSize: 11,
      fontFace: FONT_TITLE,
      color: COLOR_WHITE,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // Main App Title
    slide.addText("신상픽 (SinSangPick)", {
      x: 1.0,
      y: 2.4,
      w: 10.0,
      h: 1.2,
      fontSize: 44,
      fontFace: FONT_TITLE,
      color: COLOR_WHITE,
      bold: true
    });

    // Slogan & Concept
    slide.addText("대한민국 모든 신상 먹거리의 나침반\n실시간 편의점·마트 신제품 정보 & 재고 조회 & 내돈내산 찐리뷰 플랫폼", {
      x: 1.0,
      y: 3.7,
      w: 9.5,
      h: 1.0,
      fontSize: 18,
      fontFace: FONT_BODY,
      color: 'CBD5E1',
      lineSpacing: 26
    });

    // Key Features Highlight Row
    const highlights = [
      { icon: "⚡", label: "실시간 신상 캘린더" },
      { icon: "🏪", label: "인근 편의점 재고 연동" },
      { icon: "🧾", label: "내돈내산 영수증 리뷰" },
      { icon: "🏷️", label: "1+1 실속 할인 혜택" }
    ];

    highlights.forEach((h, i) => {
      const cardX = 1.0 + i * 2.7;
      slide.addShape(pres.ShapeType.roundRect, {
        x: cardX,
        y: 5.0,
        w: 2.5,
        h: 0.7,
        rectRadius: 0.1,
        fill: { color: '1E293B' },
        line: { color: '334155', width: 1 }
      });
      slide.addText(`${h.icon}  ${h.label}`, {
        x: cardX,
        y: 5.0,
        w: 2.5,
        h: 0.7,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });
    });

    // Author / Date
    slide.addText("작성: 신상픽 기획/개발팀  |  플랫폼: iOS App & Web  |  2026.09", {
      x: 1.0,
      y: 6.6,
      w: 8.0,
      h: 0.4,
      fontSize: 11,
      fontFace: FONT_BODY,
      color: '94A3B8'
    });
  }

  // ==========================================
  // SLIDE 2: 기획 배경 및 문제 제기 (Problem Definition)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "BACKGROUND & PROBLEM",
      "왜 '신상픽'인가? 소비자들의 4가지 핵심 불편함 (Pain Points)",
      "매주 100여 종 이상의 신제품이 쏟아지지만, 정작 소비자는 탐색부터 구매까지 번거로운 문제에 직면해 있습니다."
    );

    const painPoints = [
      {
        num: "01",
        title: "정보의 극심한 파편화",
        desc: "CU, GS25, 세븐일레븐, 대형마트, 프랜차이즈 카페 등 신제품 소식이 인스타그램, 블로그, 각종 커뮤니티에 흩어져 매번 찾아다녀야 하는 피로감",
        tag: "탐색 피로"
      },
      {
        num: "02",
        title: "광고·협찬 후기 피로도",
        desc: "SNS에 넘쳐나는 유료 광고와 바이럴 마케팅으로 인해 '진짜 맛있는지', '돈값 하는지' 신뢰할 수 있는 객관적인 맛 평가 데이터의 부재",
        tag: "신뢰 부족"
      },
      {
        num: "03",
        title: "매장 헛걸음과 재고 불확실성",
        desc: "신상 출시 소식을 접해도 정작 내 주변 가까운 매장에 입고가 되었는지 알 수 없어 허탕을 치거나 여러 지점을 헤매는 비효율",
        tag: "구매 장벽"
      },
      {
        num: "04",
        title: "놓치기 쉬운 실속 할인 혜택",
        desc: "1+1, 2+1 등 매월 바뀌는 편의점·마트 행사 정보가 제각각이라, 언제 어디서 사야 가장 저렴한지 실질적 혜택을 체감하기 어려움",
        tag: "가격 손실"
      }
    ];

    painPoints.forEach((p, i) => {
      const x = 0.8 + (i % 2) * 5.9;
      const y = 2.0 + Math.floor(i / 2) * 2.4;

      // Card Box
      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.6,
        h: 2.15,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      // Number Circle
      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.3,
        w: 0.6,
        h: 0.4,
        rectRadius: 0.08,
        fill: { color: 'FEE2E2' }
      });
      slide.addText(p.num, {
        x: x + 0.3,
        y: y + 0.3,
        w: 0.6,
        h: 0.4,
        fontSize: 12,
        fontFace: FONT_TITLE,
        color: 'DC2626',
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      // Tag
      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 4.3,
        y: y + 0.3,
        w: 1.0,
        h: 0.35,
        rectRadius: 0.08,
        fill: { color: 'F1F5F9' }
      });
      slide.addText(p.tag, {
        x: x + 4.3,
        y: y + 0.3,
        w: 1.0,
        h: 0.35,
        fontSize: 9,
        fontFace: FONT_TITLE,
        color: COLOR_MUTED,
        align: 'center',
        valign: 'middle'
      });

      // Title
      slide.addText(p.title, {
        x: x + 1.05,
        y: y + 0.3,
        w: 3.1,
        h: 0.4,
        fontSize: 14,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        valign: 'middle'
      });

      // Description
      slide.addText(p.desc, {
        x: x + 0.3,
        y: y + 0.85,
        w: 5.0,
        h: 1.1,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 3: 해결 방안 및 핵심 가치 (Solution & Vision)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "SOLUTION & CORE VALUES",
      "신상픽(SinSangPick)이 제시하는 올인원 푸드 라이프 솔루션",
      "탐색부터 검증, 재고 확인, 실속 구매까지 신상 소비의 모든 여정을 하나로 연결합니다."
    );

    const solutions = [
      {
        badge: "SOLUTION 01",
        title: "통합 신상 아카이브 & 캘린더",
        items: [
          "편의점 4사, 카페, 마트 신제품 실시간 수집",
          "출시 D-Day 카운트다운 및 입고 타임라인",
          "식약처 9대 영양성분 & 비파괴 당도 규격 제공"
        ],
        icon: "📅",
        color: "0066FF"
      },
      {
        badge: "SOLUTION 02",
        title: "내돈내산 영수증 인증 리뷰",
        items: [
          "영수증 인증 마크로 허위·바이럴 원천 차단",
          "맛/가성비/양/재구매 4대 다면 평가 지표",
          "당도(Brix), 맵기 단계, 식감 미식 프로필"
        ],
        icon: "🧾",
        color: "FF6B00"
      },
      {
        badge: "SOLUTION 03",
        title: "인근 매장 실시간 재고 조회",
        items: [
          "내 위치 반경 편의점 매장별 실시간 재고 연동",
          "여유 / 품절임박 / 품절 상태 한눈에 확인",
          "허탕 치지 않는 확실한 오프라인 방문 유도"
        ],
        icon: "📍",
        color: "10B981"
      },
      {
        badge: "SOLUTION 04",
        title: "실속 혜택 & 꿀조합 커뮤니티",
        items: [
          "1+1, 2+1, 단독특가 행사 모음 및 찜하기",
          "SNS 화제의 편의점 꿀조합 레시피 & 비용 계산",
          "A vs B 신상 배틀 투표 및 유저 수다방"
        ],
        icon: "🥪",
        color: "8B5CF6"
      }
    ];

    solutions.forEach((s, i) => {
      const x = 0.8 + i * 2.95;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 2.8,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 2.8,
        h: 0.65,
        rectRadius: 0.15,
        fill: { color: s.color }
      });
      slide.addText(`${s.icon}  ${s.badge}`, {
        x: x,
        y: y,
        w: 2.8,
        h: 0.65,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(s.title, {
        x: x + 0.2,
        y: y + 0.85,
        w: 2.4,
        h: 0.6,
        fontSize: 13,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      const bulletText = s.items.map(item => `• ${item}`).join('\n\n');
      slide.addText(bulletText, {
        x: x + 0.2,
        y: y + 1.6,
        w: 2.4,
        h: 2.7,
        fontSize: 10.5,
        fontFace: FONT_BODY,
        color: COLOR_DARK,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 4: 핵심 기능 1 - 신제품 큐레이션 & 출시 캘린더
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "KEY FEATURE 01",
      "실시간 신제품 탐색 & 출시 캘린더 (Discovery & Timeline)",
      "신제품의 사전예약부터 출시 당일 알림, 인기 브랜드 전용관까지 신상 정보를 가장 빠르게 전달합니다."
    );

    const subFeatures = [
      {
        title: "1. 9대 카테고리 실시간 신상 탐색",
        desc: "과자·스낵, 음료, 빵·디저트, 간편식(HMR), 패스트푸드, 아이스크림, 산지직송 제철 과일 등 전문화된 카테고리별 실시간 신제품 피드 제공",
        tag: "카테고리 큐레이션"
      },
      {
        title: "2. 신상 출시 캘린더 & D-Day 알림",
        desc: "출시 예정일 캘린더 타임라인을 통해 'D-3', '오늘출시' 배지 제공 및 관심 상품 사전예약·입고 알림 푸시로 얼리어먹터의 신상 선점 지원",
        tag: "캘린더 & 푸시"
      },
      {
        title: "3. 실시간 검색 유입 랭킹 알고리즘",
        desc: "실제 유저들이 검색창에서 가장 많이 찾아보고 유입된 데이터 기반 실시간 먹거리 랭킹 큐레이션으로 '지금 가장 핫한 대란템' 실시간 포착",
        tag: "트렌드 감지"
      },
      {
        title: "4. 인기 대표 브랜드 전용관",
        desc: "스타벅스, 컴포즈커피, 빽다방, 이디야, 투썸플레이스, 맥도날드 등 인기 F&B 프랜차이즈 브랜드별 신메뉴 및 단독 라인업 모아보기",
        tag: "브랜드 전용관"
      }
    ];

    subFeatures.forEach((f, i) => {
      const x = 0.8 + (i % 2) * 5.9;
      const y = 2.0 + Math.floor(i / 2) * 2.4;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.6,
        h: 2.15,
        rectRadius: 0.12,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.3,
        w: 1.5,
        h: 0.32,
        rectRadius: 0.08,
        fill: { color: 'EFF6FF' }
      });
      slide.addText(f.tag, {
        x: x + 0.3,
        y: y + 0.3,
        w: 1.5,
        h: 0.32,
        fontSize: 9.5,
        fontFace: FONT_TITLE,
        color: COLOR_BLUE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(f.title, {
        x: x + 0.3,
        y: y + 0.75,
        w: 5.0,
        h: 0.35,
        fontSize: 13.5,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        valign: 'middle'
      });

      slide.addText(f.desc, {
        x: x + 0.3,
        y: y + 1.15,
        w: 5.0,
        h: 0.85,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 5: 핵심 기능 2 - 내돈내산 찐리뷰 & 정밀 미식 평가 시스템
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "KEY FEATURE 02",
      "내돈내산 영수증 인증 리뷰 & 정밀 미식 분석 시스템",
      "광고·협찬을 철저히 배제하고, 맛·가성비·영양성분을 객관적으로 수치화하여 실패 없는 선택을 돕습니다."
    );

    // Left Column
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.0,
      w: 5.6,
      h: 4.7,
      rectRadius: 0.15,
      fill: { color: COLOR_WHITE },
      line: { color: COLOR_BORDER, width: 1 }
    });
    slide.addText("📊 4대 다면 평가 & 영수증 인증", {
      x: 1.1,
      y: 2.2,
      w: 5.0,
      h: 0.4,
      fontSize: 15,
      fontFace: FONT_TITLE,
      color: COLOR_PRIMARY,
      bold: true
    });

    const metrics = [
      { name: "맛 평가 (Taste)", desc: "단순 별점이 아닌 풍미, 조화, 첫인상 객관 점수화", score: "4.8 / 5.0" },
      { name: "가성비 (Value)", desc: "판매 정가 대비 만족도 및 1+1 행사 시 가격 대비 성능", score: "92% 만족" },
      { name: "양/용량 (Portion)", desc: "1인분 기준 실제 포만감 및 질소 과다 여부 검증", score: "적당함 (88%)" },
      { name: "재구매의사 (Repurchase)", desc: "'무조건 재구매' vs '한 번으로 만족' 실측 확률 집계", score: "재구매율 85%" }
    ];

    metrics.forEach((m, idx) => {
      const my = 2.8 + idx * 0.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 1.1,
        y: my,
        w: 5.0,
        h: 0.8,
        rectRadius: 0.08,
        fill: { color: 'F8FAFC' },
        line: { color: 'E2E8F0', width: 1 }
      });
      slide.addText(m.name, {
        x: 1.25,
        y: my + 0.1,
        w: 3.2,
        h: 0.3,
        fontSize: 12,
        fontFace: FONT_TITLE,
        color: COLOR_BLUE,
        bold: true
      });
      slide.addText(m.score, {
        x: 4.5,
        y: my + 0.1,
        w: 1.5,
        h: 0.3,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_ORANGE,
        bold: true,
        align: 'right'
      });
      slide.addText(m.desc, {
        x: 1.25,
        y: my + 0.42,
        w: 4.7,
        h: 0.3,
        fontSize: 9.5,
        fontFace: FONT_BODY,
        color: COLOR_MUTED
      });
    });

    // Right Column
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.0,
      w: 5.7,
      h: 4.7,
      rectRadius: 0.15,
      fill: { color: COLOR_WHITE },
      line: { color: COLOR_BORDER, width: 1 }
    });
    slide.addText("🔬 디테일 미식 프로필 & 영양성분 DB", {
      x: 7.1,
      y: 2.2,
      w: 5.0,
      h: 0.4,
      fontSize: 15,
      fontFace: FONT_TITLE,
      color: COLOR_PRIMARY,
      bold: true
    });

    const rightFeatures = [
      {
        title: "당도(Brix) & 맵기 단계 측정",
        desc: "과일/디저트의 실제 Brix 당도 등급 및 맵기(안매움/신라면/불닭급) 프로필 제공"
      },
      {
        title: "식약처 9대 영양성분 자동 연동",
        desc: "칼로리(kcal), 나트륨, 당류, 탄수화물, 지방, 트랜스지방, 포화지방, 콜레스테롤, 단백질 완벽 표기"
      },
      {
        title: "알레르기 유발물질 & 원산지 표기",
        desc: "밀, 대두, 우유, 견과류 등 알레르기 성분 및 식품 보관방법, 소비기한 안내"
      },
      {
        title: "내돈내산 영수증 인증 배지",
        desc: "실제 편의점·마트 구매 영수증 인증 유저에게 인증 배지 부여 및 신뢰도 가중치 부여"
      }
    ];

    rightFeatures.forEach((rf, idx) => {
      const rfy = 2.8 + idx * 0.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 7.1,
        y: rfy,
        w: 5.1,
        h: 0.8,
        rectRadius: 0.08,
        fill: { color: 'F8FAFC' },
        line: { color: 'E2E8F0', width: 1 }
      });
      slide.addText(`✔ ${rf.title}`, {
        x: 7.25,
        y: rfy + 0.1,
        w: 4.8,
        h: 0.3,
        fontSize: 12,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true
      });
      slide.addText(rf.desc, {
        x: 7.25,
        y: rfy + 0.42,
        w: 4.8,
        h: 0.3,
        fontSize: 9.5,
        fontFace: FONT_BODY,
        color: COLOR_MUTED
      });
    });
  }

  // ==========================================
  // SLIDE 6: 핵심 기능 3 - 인근 편의점 재고 조회 & 행사 소식
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "KEY FEATURE 03",
      "인근 매장 실시간 재고 확인 & 이달의 행사 큐레이션",
      "헛걸음 없는 100% 성공 쇼핑! 내 주변 편의점 재고 현황과 실속 1+1 할인 혜택을 한눈에 확인합니다."
    );

    const storeCards = [
      {
        title: "📍 인근 매장 실시간 재고 연동",
        subtitle: "헛걸음 방지 & 매장 거리 안내",
        bullets: [
          "CU, GS25, 세븐일레븐, 이마트24 주요 편의점 재고 현황",
          "내 위치 기준 최단거리 매장 안내 (150m, 320m 등)",
          "상태별 뱃지: [여유] [품절임박] [일시품절] [예약가능]",
          "매장 즉시 픽업 링크 및 24시간 영업 여부 안내"
        ],
        icon: "🏪"
      },
      {
        title: "🏷️ 이달의 편의점·마트 행사소식",
        subtitle: "1+1, 2+1, 단독특가 실속 쇼핑",
        bullets: [
          "편의점 4사 및 대형마트 이달의 행사 상품 통합 정리",
          "1+1 특가 적용 시 실질 개당 체감 단가 자동 계산",
          "관심 행사 상품 찜하기 & 행사 종료 D-Day 카운트다운",
          "식품/스낵/음료 카테고리별 실속 할인 큐레이션"
        ],
        icon: "🔥"
      }
    ];

    storeCards.forEach((c, idx) => {
      const x = 0.8 + idx * 5.9;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.6,
        h: 4.7,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.35,
        w: 0.8,
        h: 0.8,
        rectRadius: 0.1,
        fill: { color: idx === 0 ? 'EFF6FF' : 'FFF7ED' }
      });
      slide.addText(c.icon, {
        x: x + 0.3,
        y: y + 0.35,
        w: 0.8,
        h: 0.8,
        fontSize: 20,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(c.title, {
        x: x + 1.25,
        y: y + 0.35,
        w: 4.1,
        h: 0.45,
        fontSize: 16,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true
      });
      slide.addText(c.subtitle, {
        x: x + 1.25,
        y: y + 0.75,
        w: 4.1,
        h: 0.35,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_MUTED
      });

      c.bullets.forEach((b, bIdx) => {
        const by = y + 1.4 + bIdx * 0.75;
        slide.addShape(pres.ShapeType.roundRect, {
          x: x + 0.3,
          y: by,
          w: 5.0,
          h: 0.65,
          rectRadius: 0.08,
          fill: { color: 'F8FAFC' },
          line: { color: 'E2E8F0', width: 1 }
        });
        slide.addText(`•  ${b}`, {
          x: x + 0.5,
          y: by,
          w: 4.6,
          h: 0.65,
          fontSize: 11,
          fontFace: FONT_BODY,
          color: COLOR_DARK,
          valign: 'middle'
        });
      });
    });
  }

  // ==========================================
  // SLIDE 7: 핵심 기능 4 - 푸드 커뮤니티 & SNS 꿀조합 레시피
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "KEY FEATURE 04",
      "푸드 커뮤니티 & SNS 화제의 편의점 꿀조합 레시피",
      "신제품 배틀 투표와 유저 창작 레시피를 통해 능동적으로 소통하는 미식 놀이터를 조성합니다."
    );

    const communityFeatures = [
      {
        icon: "⚔️",
        title: "신상 배틀 (VS Match)",
        desc: "화제의 신제품 2종 매주 맞대결 투표 및 유저 실시간 투표율(%) 집계, 영양성분·스펙 1:1 비교표 제공"
      },
      {
        icon: "🥪",
        title: "SNS 화제의 꿀조합 레시피",
        desc: "마크정식, 편의점 파스타 등 신상 조합 요리의 상세 조리법, 난이도, 조리시간, 재료별 총비용 자동 계산"
      },
      {
        icon: "💬",
        title: "유저 수다방 & 소통 게시판",
        desc: "신제품 발굴 자랑, 맛 평가 토론, 질문/답변, 편의점 알바생 꿀팁 공유 등 활발한 푸드 커뮤니티 운영"
      },
      {
        icon: "🎁",
        title: "리워드 포인트 & 뱃지 시스템",
        desc: "영수증 리뷰 작성, 투표 참여, 레시피 등록 시 리워드 포인트 지급 및 맛잘알 레벨업 뱃지 획득"
      }
    ];

    communityFeatures.forEach((cf, i) => {
      const x = 0.8 + (i % 2) * 5.9;
      const y = 2.0 + Math.floor(i / 2) * 2.4;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.6,
        h: 2.15,
        rectRadius: 0.12,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.35,
        w: 0.6,
        h: 0.6,
        rectRadius: 0.08,
        fill: { color: 'F1F5F9' }
      });
      slide.addText(cf.icon, {
        x: x + 0.3,
        y: y + 0.35,
        w: 0.6,
        h: 0.6,
        fontSize: 16,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(cf.title, {
        x: x + 1.05,
        y: y + 0.35,
        w: 4.2,
        h: 0.45,
        fontSize: 14,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        valign: 'middle'
      });

      slide.addText(cf.desc, {
        x: x + 0.3,
        y: y + 1.05,
        w: 5.0,
        h: 0.95,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 8: 관리자(Admin) 자동화 & 데이터 파이프라인
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "DATA & ADMIN PIPELINE",
      "고도화된 관리자 대시보드 & 데이터 자동화 파이프라인",
      "네이버 쇼핑 트렌드 수집부터 식약처 공공 API 매칭, 품질 검증 큐까지 자동화된 데이터 생태계를 구축했습니다."
    );

    const steps = [
      {
        step: "STEP 01",
        title: "자동 수집 엔진",
        desc: "네이버 쇼핑 인사이트 검색 트렌드 키워드 및 주요 F&B 브랜드 신제품 데이터 자동 크롤링/수집",
        badge: "Brand Collector"
      },
      {
        step: "STEP 02",
        title: "식약처 공공 API 매칭",
        desc: "식품의약품안전처 영양성분 공공 DB 실시간 검색 연동으로 9대 영양성분 및 규격 자동 추출",
        badge: "Nutrition API"
      },
      {
        step: "STEP 03",
        title: "검증 승인 큐 (Quality)",
        desc: "쇼핑몰 가격/이미지 미매칭 상품 검증 필요 상태(Needs Review) 플래그 및 원클릭 승인/반려",
        badge: "Approval Queue"
      },
      {
        step: "STEP 04",
        title: "실시간 배포 & 푸시",
        desc: "승인 완료 즉시 메인 피드 반영, 타겟 푸시 알림 발송 및 홈 배너/신상 배틀 실시간 편성",
        badge: "Live Publish"
      }
    ];

    steps.forEach((st, idx) => {
      const x = 0.8 + idx * 2.95;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 2.8,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.25,
        y: y + 0.35,
        w: 1.3,
        h: 0.3,
        rectRadius: 0.06,
        fill: { color: '0066FF' }
      });
      slide.addText(st.step, {
        x: x + 0.25,
        y: y + 0.35,
        w: 1.3,
        h: 0.3,
        fontSize: 9.5,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(st.title, {
        x: x + 0.25,
        y: y + 0.8,
        w: 2.3,
        h: 0.45,
        fontSize: 14,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.25,
        y: y + 1.35,
        w: 2.3,
        h: 0.35,
        rectRadius: 0.06,
        fill: { color: 'F1F5F9' }
      });
      slide.addText(`⚙ ${st.badge}`, {
        x: x + 0.25,
        y: y + 1.35,
        w: 2.3,
        h: 0.35,
        fontSize: 9.5,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(st.desc, {
        x: x + 0.25,
        y: y + 1.9,
        w: 2.3,
        h: 2.4,
        fontSize: 10.5,
        fontFace: FONT_BODY,
        color: COLOR_DARK,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 9: 타겟 고객 및 사용자 페르소나
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "TARGET AUDIENCE & PERSONA",
      "핵심 타겟 고객층 및 3대 사용자 페르소나 (Persona)",
      "트렌드에 민감한 MZ세대부터 알뜰 1인 가구, 건강 식단 관리자까지 명확한 타겟군을 포괄합니다."
    );

    const personas = [
      {
        tag: "PERSONA A",
        title: "얼리어먹터 (Early Eater)",
        profile: "20대 대학생 / 사회초년생",
        needs: "신제품이 나오면 남들보다 먼저 먹어보고 SNS에 인증하고 싶음. 인근 편의점에 재고가 있는지 즉시 확인 필요.",
        favorite: "신상 과자, 한정판 음료, 인스타 대란 디저트",
        icon: "✨"
      },
      {
        tag: "PERSONA B",
        title: "알뜰 실속형 (Smart Shopper)",
        profile: "2030 직장인 / 1인 가구",
        needs: "물가 부담으로 편의점 1+1, 2+1 행사 소식을 적극 활용하며, 간단하고 맛있는 편의점 꿀조합 레시피를 즐김.",
        favorite: "1+1 간편식, 삼각김밥, 콤보 특가",
        icon: "🎯"
      },
      {
        tag: "PERSONA C",
        title: "헬시플레저 (Health & Fit)",
        profile: "식단 관리자 / 다이어터",
        needs: "신제품의 칼로리, 당류, 나트륨, 단백질 함량을 꼼꼼히 확인하고 건강하게 즐길 수 있는 먹거리를 선별 소비.",
        favorite: "제로 탄산, 단백질 바, 저당 디저트",
        icon: "🥗"
      }
    ];

    personas.forEach((p, idx) => {
      const x = 0.8 + idx * 3.95;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 3.7,
        h: 4.7,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.35,
        w: 1.4,
        h: 0.32,
        rectRadius: 0.08,
        fill: { color: 'EFF6FF' }
      });
      slide.addText(p.tag, {
        x: x + 0.3,
        y: y + 0.35,
        w: 1.4,
        h: 0.32,
        fontSize: 9.5,
        fontFace: FONT_TITLE,
        color: COLOR_BLUE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(`${p.icon}  ${p.title}`, {
        x: x + 0.3,
        y: y + 0.8,
        w: 3.1,
        h: 0.45,
        fontSize: 15,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true
      });
      slide.addText(p.profile, {
        x: x + 0.3,
        y: y + 1.25,
        w: 3.1,
        h: 0.3,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_MUTED
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 1.7,
        w: 3.1,
        h: 1.5,
        rectRadius: 0.08,
        fill: { color: 'F8FAFC' },
        line: { color: 'E2E8F0', width: 1 }
      });
      slide.addText("📌 핵심 니즈 (Needs)", {
        x: x + 0.45,
        y: y + 1.8,
        w: 2.8,
        h: 0.25,
        fontSize: 10,
        fontFace: FONT_TITLE,
        color: COLOR_DARK,
        bold: true
      });
      slide.addText(p.needs, {
        x: x + 0.45,
        y: y + 2.1,
        w: 2.8,
        h: 1.0,
        fontSize: 10,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 16
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 3.35,
        w: 3.1,
        h: 1.0,
        rectRadius: 0.08,
        fill: { color: 'F0FDF4' },
        line: { color: 'BBF7D0', width: 1 }
      });
      slide.addText("주요 소비 카테고리", {
        x: x + 0.45,
        y: y + 3.45,
        w: 2.8,
        h: 0.25,
        fontSize: 10,
        fontFace: FONT_TITLE,
        color: '166534',
        bold: true
      });
      slide.addText(p.favorite, {
        x: x + 0.45,
        y: y + 3.75,
        w: 2.8,
        h: 0.5,
        fontSize: 10.5,
        fontFace: FONT_BODY,
        color: '15803D'
      });
    });
  }

  // ==========================================
  // SLIDE 10: 비즈니스 수익화 모델 (Business Model)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "BUSINESS REVENUE MODEL",
      "다각화된 비즈니스 수익 창출 모델 (Business Model)",
      "B2B 식품 제조사 마케팅부터 제휴 커머스 수수료, 트렌드 빅데이터 판매까지 지속 가능한 수익 구조를 확보합니다."
    );

    const bms = [
      {
        num: "01",
        title: "B2B 신제품 마케팅 & 스폰서십",
        desc: "식품 대기업 및 F&B 프랜차이즈 대상 신제품 런칭 홈 배너, 브랜드 전용관 입점, 무료 신상 체험단 100명 모집 대행 광고비 수취",
        target: "식품 제조사 / 프랜차이즈",
        profit: "스폰서십 광고비"
      },
      {
        num: "02",
        title: "제휴 커머스 & 픽업 수수료",
        desc: "쿠팡 파트너스, 마켓컬리, 편의점 공식 앱 픽업 주문 링크 연동을 통한 구매 전환 수수료(Affiliate Commission) 발생",
        target: "이커머스 / 편의점 픽업",
        profit: "구매 전환 수수료 (3~8%)"
      },
      {
        num: "03",
        title: "F&B 트렌드 빅데이터 리포트",
        desc: "신제품 카테고리별 검색 유입량, 연령/지역별 선호 맛 프로필, 재구매 의향률 등 실측 소비자 행동 인사이트 데이터 판매",
        target: "식품 연구소 / 상품기획(MD)",
        profit: "월 구독형 데이터 리포트"
      },
      {
        num: "04",
        title: "지역 편의점 타겟 입고 알림 광고",
        desc: "특정 지역(구/동 단위) 편의점 가맹점주 대상, 신제품 입고 시 인근 반경 사용자에게 타겟 푸시 알림을 발송하는 로컬 광고",
        target: "편의점 점주 / 로컬 상권",
        profit: "건당 푸시 알림 광고료"
      }
    ];

    bms.forEach((b, i) => {
      const x = 0.8 + (i % 2) * 5.9;
      const y = 2.0 + Math.floor(i / 2) * 2.4;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.6,
        h: 2.15,
        rectRadius: 0.12,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 0.3,
        w: 0.6,
        h: 0.38,
        rectRadius: 0.08,
        fill: { color: '0066FF' }
      });
      slide.addText(b.num, {
        x: x + 0.3,
        y: y + 0.3,
        w: 0.6,
        h: 0.38,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(b.title, {
        x: x + 1.05,
        y: y + 0.3,
        w: 4.2,
        h: 0.38,
        fontSize: 13.5,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        valign: 'middle'
      });

      slide.addText(b.desc, {
        x: x + 0.3,
        y: y + 0.8,
        w: 5.0,
        h: 0.75,
        fontSize: 10.5,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 16
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3,
        y: y + 1.6,
        w: 5.0,
        h: 0.38,
        rectRadius: 0.06,
        fill: { color: 'F8FAFC' }
      });
      slide.addText(`타겟: ${b.target}  |  수익 모델: ${b.profit}`, {
        x: x + 0.4,
        y: y + 1.6,
        w: 4.8,
        h: 0.38,
        fontSize: 9.5,
        fontFace: FONT_TITLE,
        color: COLOR_BLUE,
        bold: true,
        valign: 'middle'
      });
    });
  }

  // ==========================================
  // SLIDE 11: 기술 스택 및 시스템 아키텍처
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "TECH STACK & ARCHITECTURE",
      "검증된 기술 스택 & 크로스 플랫폼 아키텍처",
      "웹부터 iOS 모바일 네이티브 앱까지 완전한 CI/CD 자동화 배포 파이프라인을 구축했습니다."
    );

    const stacks = [
      {
        category: "프론트엔드 (Frontend)",
        techs: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Lucide React"],
        desc: "반응형 모바일 퍼스트 UI, 빠르고 가벼운 번들링 및 타입 안정성 보장",
        color: "0066FF"
      },
      {
        category: "백엔드 & DB (Backend / DB)",
        techs: ["Supabase", "PostgreSQL", "Realtime WebSocket", "Row Level Security"],
        desc: "실시간 투표 및 재고 반영, 엔터프라이즈급 DB 무결성 및 강력한 보안",
        color: "10B981"
      },
      {
        category: "모바일 네이티브 (Hybrid Native)",
        techs: ["Capacitor 6.0 iOS", "App Store Connect", "Push Notification", "Camera OCR"],
        desc: "Capacitor 기반 단일 코드베이스로 iOS 네이티브 앱스토어 배포 및 푸시 알림",
        color: "8B5CF6"
      },
      {
        category: "인프라 & CI/CD (DevOps)",
        techs: ["Vercel Production", "GitHub Actions", "식약처 공공 API", "네이버 쇼핑 API"],
        desc: "커밋 시 Vercel 웹 배포 및 iOS TestFlight/App Store 자동 빌드 배포 완비",
        color: "FF6B00"
      }
    ];

    stacks.forEach((st, idx) => {
      const x = 0.8 + idx * 2.95;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 2.8,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 2.8,
        h: 0.55,
        rectRadius: 0.15,
        fill: { color: st.color }
      });
      slide.addText(st.category, {
        x: x,
        y: y,
        w: 2.8,
        h: 0.55,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      st.techs.forEach((t, tIdx) => {
        const ty = y + 0.8 + tIdx * 0.45;
        slide.addShape(pres.ShapeType.roundRect, {
          x: x + 0.25,
          y: ty,
          w: 2.3,
          h: 0.36,
          rectRadius: 0.06,
          fill: { color: 'F1F5F9' },
          line: { color: 'E2E8F0', width: 1 }
        });
        slide.addText(t, {
          x: x + 0.25,
          y: ty,
          w: 2.3,
          h: 0.36,
          fontSize: 10.5,
          fontFace: FONT_TITLE,
          color: COLOR_PRIMARY,
          bold: true,
          align: 'center',
          valign: 'middle'
        });
      });

      slide.addText(st.desc, {
        x: x + 0.25,
        y: y + 3.2,
        w: 2.3,
        h: 1.2,
        fontSize: 10,
        fontFace: FONT_BODY,
        color: COLOR_MUTED,
        lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 12: 서비스 성장 로드맵 (Roadmap)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      "ROADMAP & VISION",
      "서비스 단계별 로드맵 & 미래 비전 (Roadmap)",
      "편의점 신상 정보 아카이브를 시작으로, 대한민국 F&B의 모든 트렌드를 주도하는 메가 플랫폼으로 도약합니다."
    );

    const roadmapSteps = [
      {
        phase: "PHASE 1 (현재)",
        title: "시장 진입 & 기반 구축",
        timeline: "2026 상반기",
        items: [
          "편의점 4사 신제품 데이터베이스 구축",
          "내돈내산 영수증 인증 리뷰 및 배틀 런칭",
          "iOS 앱스토어 및 웹 정식 런칭",
          "얼리어먹터 초기 커뮤니티 1만 명 확보"
        ],
        color: "0066FF"
      },
      {
        phase: "PHASE 2 (확장)",
        title: "데이터 고도화 & 개인화",
        timeline: "2026 하반기",
        items: [
          "대형마트/백화점 팝업스토어로 영역 확대",
          "유저 취향 기반 AI 신제품 추천 알고리즘",
          "B2B 브랜드 전용관 및 스폰서십 활성화",
          "MAU 10만 명 돌파 및 수익 모델 검증"
        ],
        color: "10B981"
      },
      {
        phase: "PHASE 3 (도약)",
        title: "커머스 연동 & F&B 생태계",
        timeline: "2027~",
        items: [
          "편의점·마트 다이렉트 픽업 예약 결제 연동",
          "식품 대기업과 신상픽 단독 한정판 신상 출시",
          "F&B 상품 기획용 소비자 빅데이터 SaaS 출시",
          "대한민국 No.1 먹거리 디스커버리 플랫폼 완성"
        ],
        color: "8B5CF6"
      }
    ];

    roadmapSteps.forEach((rm, idx) => {
      const x = 0.8 + idx * 3.95;
      const y = 2.0;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 3.7,
        h: 4.7,
        rectRadius: 0.15,
        fill: { color: COLOR_WHITE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 3.7,
        h: 0.6,
        rectRadius: 0.15,
        fill: { color: rm.color }
      });
      slide.addText(`${rm.phase}  |  ${rm.timeline}`, {
        x: x,
        y: y,
        w: 3.7,
        h: 0.6,
        fontSize: 11,
        fontFace: FONT_TITLE,
        color: COLOR_WHITE,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(rm.title, {
        x: x + 0.3,
        y: y + 0.8,
        w: 3.1,
        h: 0.5,
        fontSize: 15,
        fontFace: FONT_TITLE,
        color: COLOR_PRIMARY,
        bold: true,
        align: 'center'
      });

      const bullets = rm.items.map(it => `✔  ${it}`).join('\n\n');
      slide.addText(bullets, {
        x: x + 0.35,
        y: y + 1.5,
        w: 3.0,
        h: 2.8,
        fontSize: 11,
        fontFace: FONT_BODY,
        color: COLOR_DARK,
        lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 13: 맺음말 & 문의 (Closing & Q&A)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_PRIMARY };

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 1.0,
      w: 11.33,
      h: 5.5,
      rectRadius: 0.2,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.0,
      y: 1.5,
      w: 3.33,
      h: 0.45,
      rectRadius: 0.1,
      fill: { color: '0066FF' }
    });
    slide.addText("THANK YOU FOR LISTENING", {
      x: 5.0,
      y: 1.5,
      w: 3.33,
      h: 0.45,
      fontSize: 11,
      fontFace: FONT_TITLE,
      color: COLOR_WHITE,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    slide.addText("가장 맛있는 내일을 고르는 곳,\n신상픽 (SinSangPick)", {
      x: 2.0,
      y: 2.2,
      w: 9.33,
      h: 1.4,
      fontSize: 34,
      fontFace: FONT_TITLE,
      color: COLOR_WHITE,
      bold: true,
      align: 'center',
      lineSpacing: 38
    });

    slide.addText("대한민국 먹거리 소비의 새로운 기준을 세워가겠습니다.\n궁금하신 점이 있으시면 언제든지 말씀해 주세요.", {
      x: 2.0,
      y: 3.8,
      w: 9.33,
      h: 0.8,
      fontSize: 15,
      fontFace: FONT_BODY,
      color: '94A3B8',
      align: 'center',
      lineSpacing: 22
    });

    // Contact info box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.5,
      y: 4.8,
      w: 6.33,
      h: 1.1,
      rectRadius: 0.1,
      fill: { color: '0F172A' },
      line: { color: '334155', width: 1 }
    });
    slide.addText("🌐 웹 서비스: sinsangpick.app  |  📱 iOS 앱스토어: '신상픽' 검색\n✉️ 제휴 및 문의: contact@sinsangpick.app", {
      x: 3.5,
      y: 4.8,
      w: 6.33,
      h: 1.1,
      fontSize: 12,
      fontFace: FONT_BODY,
      color: 'CBD5E1',
      align: 'center',
      valign: 'middle',
      lineSpacing: 20
    });
  }

  // Save the presentation
  const outputPath = path.resolve('docs', 'sinsangpick_presentation.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation created successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
