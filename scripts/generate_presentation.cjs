const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createSimplePresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches

  const COLOR_WHITE = 'FFFFFF';
  const COLOR_BG_CARD = 'F9FAFB';
  const COLOR_TEXT_MAIN = '111827';   // Almost black
  const COLOR_TEXT_BODY = '374151';   // Dark gray
  const COLOR_TEXT_MUTED = '6B7280';  // Medium gray
  const COLOR_POINT = '2563EB';       // Clean Simple Blue
  const COLOR_BORDER = 'E5E7EB';      // Light border
  const FONT_MAIN = 'Malgun Gothic';

  // ==========================================
  // SLIDE 1: 표지 (Cover) - 심플한 화이트
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_WHITE };

    // Point Tag
    slide.addText("신상 먹거리 리뷰 & 리워드 앱", {
      x: 1.2,
      y: 2.0,
      w: 8.0,
      h: 0.4,
      fontSize: 14,
      fontFace: FONT_MAIN,
      color: COLOR_POINT,
      bold: true
    });

    // Main App Title
    slide.addText("신상픽 (SinSangPick)", {
      x: 1.2,
      y: 2.5,
      w: 10.0,
      h: 1.2,
      fontSize: 44,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MAIN,
      bold: true
    });

    // Core Concept One-liner
    slide.addText("신제품 먹어보고 리뷰 쓰면 포인트 적립!\n모은 포인트로 편의점·카페 e쿠폰(기프티콘) 교환", {
      x: 1.2,
      y: 3.9,
      w: 10.0,
      h: 1.0,
      fontSize: 20,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_BODY,
      lineSpacing: 30
    });

    // Simple Separator Line
    slide.addShape(pres.ShapeType.line, {
      x: 1.2,
      y: 5.3,
      w: 10.9,
      h: 0,
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Bottom Info
    slide.addText("서비스 소개서  |  신상픽", {
      x: 1.2,
      y: 5.7,
      w: 8.0,
      h: 0.4,
      fontSize: 12,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MUTED
    });
  }

  // ==========================================
  // SLIDE 2: 서비스 핵심 흐름 (Step 1 -> 2 -> 3)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_WHITE };

    // Slide Header
    slide.addText("서비스 이용 흐름", {
      x: 1.0,
      y: 0.9,
      w: 11.0,
      h: 0.5,
      fontSize: 24,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MAIN,
      bold: true
    });
    slide.addText("소비자가 신상품을 구매하고 보상을 받는 3단계 구조", {
      x: 1.0,
      y: 1.45,
      w: 11.0,
      h: 0.35,
      fontSize: 13,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MUTED
    });

    const steps = [
      {
        num: "01",
        title: "신상품 탐색 & 구매",
        desc: "편의점(CU, GS25, 세븐, 이마트24), 마트의 새로 나온 과자, 음료, 디저트 등 신상 먹거리 확인 및 구매"
      },
      {
        num: "02",
        title: "솔직한 리뷰 등록",
        desc: "직접 먹어본 맛, 가성비, 사진과 함께 솔직 후기 작성\n👉 작성 즉시 현금처럼 쓰는 포인트 지급!"
      },
      {
        num: "03",
        title: "e쿠폰(기프티콘) 교환",
        desc: "차곡차곡 모은 포인트로 편의점 모바일 상품권, 스타벅스 커피 쿠폰 등 원하는 모바일 e쿠폰 즉시 교환"
      }
    ];

    steps.forEach((s, i) => {
      const x = 1.0 + i * 3.85;
      const y = 2.2;

      // Card
      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 3.6,
        h: 4.2,
        rectRadius: 0.1,
        fill: { color: COLOR_BG_CARD },
        line: { color: COLOR_BORDER, width: 1 }
      });

      // Step Number
      slide.addText(s.num, {
        x: x + 0.3,
        y: y + 0.4,
        w: 3.0,
        h: 0.5,
        fontSize: 28,
        fontFace: FONT_MAIN,
        color: COLOR_POINT,
        bold: true
      });

      // Title
      slide.addText(s.title, {
        x: x + 0.3,
        y: y + 1.1,
        w: 3.0,
        h: 0.4,
        fontSize: 16,
        fontFace: FONT_MAIN,
        color: COLOR_TEXT_MAIN,
        bold: true
      });

      // Separator inside card
      slide.addShape(pres.ShapeType.line, {
        x: x + 0.3,
        y: y + 1.7,
        w: 3.0,
        h: 0,
        line: { color: COLOR_BORDER, width: 1 }
      });

      // Desc
      slide.addText(s.desc, {
        x: x + 0.3,
        y: y + 1.9,
        w: 3.0,
        h: 2.0,
        fontSize: 12,
        fontFace: FONT_MAIN,
        color: COLOR_TEXT_BODY,
        lineSpacing: 20
      });
    });
  }

  // ==========================================
  // SLIDE 3: 핵심 가치 & 기대효과 (Why & Impact)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_WHITE };

    // Slide Header
    slide.addText("핵심 가치 & 기대효과", {
      x: 1.0,
      y: 0.9,
      w: 11.0,
      h: 0.5,
      fontSize: 24,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MAIN,
      bold: true
    });
    slide.addText("유저에게는 확실한 혜택을, 플랫폼에는 신뢰할 수 있는 데이터를 만듭니다.", {
      x: 1.0,
      y: 1.45,
      w: 11.0,
      h: 0.35,
      fontSize: 13,
      fontFace: FONT_MAIN,
      color: COLOR_TEXT_MUTED
    });

    const values = [
      {
        target: "유저 관점 (User)",
        title: "실패 없는 소비 & 쏠쏠한 리워드",
        bullets: [
          "광고·협찬 없는 찐후기 보고 신제품 실패 없이 구매",
          "내가 먹은 일상 후기 작성하고 포인트 받는 쏠쏠한 앱테크",
          "모은 포인트로 편의점 상품권·커피 e쿠폰 무료 교환"
        ]
      },
      {
        target: "서비스 관점 (Platform)",
        title: "자발적인 찐리뷰 축적 & 활성화",
        bullets: [
          "포인트 보상 시스템으로 고품질 실구매자 리뷰 자발적 누적",
          "신제품 궁금한 유저들의 지속적인 방문 및 커뮤니티 활성화",
          "축적된 리뷰 데이터를 바탕으로 F&B 제휴 및 e쿠폰 커머스 확장"
        ]
      }
    ];

    values.forEach((v, i) => {
      const x = 1.0 + i * 5.8;
      const y = 2.2;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.5,
        h: 4.2,
        rectRadius: 0.1,
        fill: { color: COLOR_BG_CARD },
        line: { color: COLOR_BORDER, width: 1 }
      });

      // Target Label
      slide.addText(v.target, {
        x: x + 0.4,
        y: y + 0.4,
        w: 4.7,
        h: 0.35,
        fontSize: 12,
        fontFace: FONT_MAIN,
        color: COLOR_POINT,
        bold: true
      });

      // Title
      slide.addText(v.title, {
        x: x + 0.4,
        y: y + 0.85,
        w: 4.7,
        h: 0.45,
        fontSize: 17,
        fontFace: FONT_MAIN,
        color: COLOR_TEXT_MAIN,
        bold: true
      });

      // Line
      slide.addShape(pres.ShapeType.line, {
        x: x + 0.4,
        y: y + 1.45,
        w: 4.7,
        h: 0,
        line: { color: COLOR_BORDER, width: 1 }
      });

      // Bullets
      const bulletText = v.bullets.map(b => `•  ${b}`).join('\n\n');
      slide.addText(bulletText, {
        x: x + 0.4,
        y: y + 1.7,
        w: 4.7,
        h: 2.2,
        fontSize: 12.5,
        fontFace: FONT_MAIN,
        color: COLOR_TEXT_BODY,
        lineSpacing: 22
      });
    });
  }

  // Save to docs
  const outputPath = path.resolve('docs', 'sinsangpick_presentation.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Simple 3-slide presentation created at: ${outputPath}`);
}

createSimplePresentation().catch(err => {
  console.error("Error creating simple presentation:", err);
  process.exit(1);
});
