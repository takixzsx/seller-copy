import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `당신은 이커머스 마케팅 카피라이터 전문가입니다.
사용자가 제공하는 상품 정보를 바탕으로 아래 3종의 마케팅 카피를 생성하세요.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "detailPage": {
    "title": "후킹 제목 (호기심 유발, 1줄)",
    "body": "상세페이지 판매 본문 (3~5단락, 각 단락은 줄바꿈으로 구분, 고객의 고민→해결→증거→혜택 구조)",
    "cta": "구매 유도 문구 (1줄)"
  },
  "blogReview": "네이버 블로그 체험 리뷰 형식 글 (자연스러운 후기 톤, SEO 키워드 자연 삽입, 500자 내외)",
  "instagram": {
    "caption": "인스타그램/릴스 캡션 (감성적 톤, 이모지 포함, 3~5줄)",
    "hashtags": ["#해시태그1", "#해시태그2", "...최대 15개"]
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const { productName, category, features, target } = await req.json();

    if (!productName || !category || !features || !target) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const userPrompt = `상품명: ${productName}
카테고리: ${category}
핵심 특징:
${features}
타겟 고객: ${target}`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(getDemoResponse(productName, category, features, target));
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: err.error?.message || "AI API 호출에 실패했습니다." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "카피 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function getDemoResponse(
  productName: string,
  category: string,
  features: string,
  target: string
) {
  const featureList = features
    .split(/\n|\\n/)
    .map((f: string) => f.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  const mainFeature = featureList[0] || "최고의 품질";
  const subFeatures = featureList.slice(1).join(", ") || "우수한 성능";

  return {
    detailPage: {
      title: `아직도 ${category}에서 고민하세요? ${productName} 하나로 끝내세요`,
      body: `${target}이라면 한 번쯤 이런 고민 해보셨을 거예요.\n"좋은 ${category} 제품 없을까?" "가성비 좋으면서 품질도 괜찮은 거 없나?"\n\n${productName}은 바로 그 고민에서 시작했습니다.\n${mainFeature}을(를) 핵심으로, ${subFeatures}까지 갖춘 제품이에요.\n\n실제 사용자 후기에서도 "이 가격에 이 퀄리티?" 라는 반응이 쏟아지고 있습니다.\n만족도 98%, 재구매율 85%가 그 증거입니다.\n\n지금 구매하시면 한정 특가로 만나보실 수 있어요.\n늦기 전에 확인해보세요.`,
      cta: `지금 바로 ${productName} 만나보기 →`,
    },
    blogReview: `안녕하세요~ 오늘은 요즘 핫한 ${category} 아이템, ${productName} 솔직 후기 들고 왔어요!\n\n사실 저도 처음엔 반신반의했거든요. 근데 써보고 깜짝 놀랐어요 ㅎㅎ\n\n일단 ${mainFeature}이(가) 확실히 느껴지더라구요. ${subFeatures}도 기대 이상이었고요.\n\n${target}분들께 특히 추천드려요. 저도 이제 이거 없으면 안 될 것 같아요 ㅋㅋ\n\n가격 대비 만족도 최고! ${productName} 강력 추천합니다. 궁금하신 점은 댓글로 물어봐주세요~`,
    instagram: {
      caption: `✨ 드디어 찾았다, 인생 ${category} 아이템\n\n${productName} 써보고 완전 반해버림 🥹\n${mainFeature} 덕분에 매일이 달라졌어요\n\n솔직히 이건 안 써본 사람만 손해 💯`,
      hashtags: [
        `#${productName.replace(/\s/g, "")}`,
        `#${category.replace(/[/]/g, "")}추천`,
        "#솔직후기",
        "#인생템발견",
        "#강력추천",
        `#${category.replace(/[/]/g, "")}`,
        "#일상템",
        "#꿀템",
        "#리뷰",
        "#추천아이템",
      ],
    },
  };
}
