import { NextRequest, NextResponse } from "next/server";

const TONE_MAP: Record<string, string> = {
  friendly: "친근하고 편안한 ~해요체를 사용하세요. 이모티콘을 적절히 활용하세요.",
  professional:
    "전문적이고 신뢰감 있는 톤으로 작성하세요. 구체적 수치와 데이터를 강조하세요.",
  emotional:
    "감성적인 스토리텔링 톤으로 작성하세요. 독자의 감정에 공감하는 문장을 사용하세요.",
  witty: "위트 있고 유머러스한 톤으로 작성하세요. 밈 감성과 트렌디한 표현을 활용하세요.",
};

function buildSystemPrompt(tone: string) {
  const toneInstruction = TONE_MAP[tone] || TONE_MAP.friendly;

  return `당신은 이커머스 마케팅 카피라이터 전문가입니다.
사용자가 제공하는 상품 정보를 바탕으로 아래 3종의 마케팅 카피를 생성하세요.

톤 & 스타일: ${toneInstruction}

[사실 정확성 규칙 — 가장 중요]
이 카피는 실제 판매 페이지에 그대로 사용됩니다. 사실과 다른 내용은 판매자에게
허위광고 책임을 지웁니다. 다음을 반드시 지키세요.

1. 입력에 있는 수치, 소재명, 인증명, 규격은 한 글자도 바꾸지 마세요.
   ("304 스테인리스"를 "307 스테인리스"로 쓰는 것 같은 변형은 절대 금지)
2. 입력에 없는 수치를 지어내지 마세요. 만족도 98%, 재구매율 85%, 판매 1위,
   임상 테스트 완료, 수상 이력 같은 검증 불가능한 표현을 만들어내지 마세요.
3. 후기·평점·판매량을 사실처럼 쓰지 마세요. 블로그 리뷰는 1인칭 사용 경험
   형식으로 쓰되, 구체적 수치는 입력에 있는 것만 사용하세요.
4. "최고", "1위", "유일한" 같은 최상급 표현은 근거가 입력에 없으면 쓰지 마세요.
5. 설득력은 지어낸 숫자가 아니라, 입력된 특징이 타겟 고객의 어떤 불편을
   해결하는지 구체적으로 연결해서 만드세요.

출력 형식(JSON 스키마)은 별도로 지정되어 있습니다. 각 필드 설명에 맞춰 작성하세요.`;
}

const COPY_SCHEMA = {
  type: "object",
  properties: {
    detailPage: {
      type: "object",
      properties: {
        title: { type: "string", description: "후킹 제목 (호기심 유발, 1줄)" },
        body: {
          type: "string",
          description:
            "상세페이지 판매 본문 (3~5단락, 각 단락은 줄바꿈으로 구분, 고객의 고민→해결→입력된 특징으로 뒷받침→혜택 구조. 입력에 없는 수치나 후기를 만들어내지 말 것)",
        },
        cta: { type: "string", description: "구매 유도 문구 (1줄)" },
      },
      required: ["title", "body", "cta"],
      additionalProperties: false,
    },
    blogReview: {
      type: "string",
      description:
        "네이버 블로그 체험 리뷰 형식 글 (자연스러운 후기 톤, SEO 키워드 자연 삽입, 500자 내외)",
    },
    instagram: {
      type: "object",
      properties: {
        caption: {
          type: "string",
          description: "인스타그램/릴스 캡션 (감성적 톤, 이모지 포함, 3~5줄)",
        },
        hashtags: {
          type: "array",
          items: { type: "string" },
          description: "해시태그 최대 15개, 각 항목은 # 로 시작",
        },
      },
      required: ["caption", "hashtags"],
      additionalProperties: false,
    },
  },
  required: ["detailPage", "blogReview", "instagram"],
  additionalProperties: false,
} as const;

export const maxDuration = 60;

/**
 * 비용 방어 3단.
 *
 * 주의: Vercel 서버리스는 인스턴스마다 메모리가 따로이고 콜드스타트로 초기화되므로
 * 아래 카운터는 "완벽한 상한"이 아니라 "우발적·소규모 남용을 막는 최소 방어"다.
 * 진짜 상한은 Anthropic 콘솔의 월 지출 한도(spend limit)로 걸어야 한다.
 */
const PER_MIN_LIMIT = 5; // IP당 분당
const PER_DAY_LIMIT = 10; // IP당 일일 (UI는 3회지만 공용 IP 고려해 여유)
const GLOBAL_DAY_LIMIT = 300; // 인스턴스당 일일 총량 (폭주 차단용 서킷 브레이커)

const minuteCounts = new Map<string, { count: number; resetAt: number }>();
const dayCounts = new Map<string, { count: number; day: string }>();
let globalDay = "";
let globalCount = 0;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type LimitResult = { ok: true } | { ok: false; reason: "rate" | "daily" | "global" };

function checkLimits(ip: string): LimitResult {
  const now = Date.now();
  const day = today();

  // 전역 일일 상한
  if (globalDay !== day) {
    globalDay = day;
    globalCount = 0;
    // 날짜가 바뀌면 IP별 일일 카운터도 정리해 메모리 누수를 막는다.
    dayCounts.clear();
  }
  if (globalCount >= GLOBAL_DAY_LIMIT) return { ok: false, reason: "global" };

  // IP별 분당
  const m = minuteCounts.get(ip);
  if (!m || now > m.resetAt) {
    minuteCounts.set(ip, { count: 1, resetAt: now + 60 * 1000 });
  } else if (m.count >= PER_MIN_LIMIT) {
    return { ok: false, reason: "rate" };
  } else {
    m.count++;
  }

  // IP별 일일
  const d = dayCounts.get(ip);
  if (!d || d.day !== day) {
    dayCounts.set(ip, { count: 1, day });
  } else if (d.count >= PER_DAY_LIMIT) {
    return { ok: false, reason: "daily" };
  } else {
    d.count++;
  }

  globalCount++;
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const limit = checkLimits(ip);
  if (!limit.ok) {
    console.log(
      JSON.stringify({ event: "rate_limited", reason: limit.reason, at: new Date().toISOString() })
    );
    const message =
      limit.reason === "global"
        ? "오늘 무료 생성이 모두 소진됐습니다. 내일 다시 이용해주세요."
        : limit.reason === "daily"
          ? "오늘 사용 가능한 횟수를 모두 쓰셨습니다. 내일 다시 이용해주세요."
          : "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    return NextResponse.json(
      { error: message },
      { status: 429 }
    );
  }

  try {
    const { productName, category, features, target, tone } = await req.json();

    if (!productName || !category || !features || !target) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    if (productName.length > 100 || features.length > 1000 || target.length > 200) {
      return NextResponse.json(
        { error: "입력이 너무 깁니다." },
        { status: 400 }
      );
    }

    const userPrompt = `상품명: ${productName}
카테고리: ${category}
핵심 특징:
${features}
타겟 고객: ${target}`;

    const systemPrompt = buildSystemPrompt(tone || "friendly");

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      return await callClaude(anthropicKey, systemPrompt, userPrompt);
    }

    if (openaiKey) {
      return await callOpenAI(openaiKey, systemPrompt, userPrompt);
    }

    return NextResponse.json(
      getDemoResponse(productName, category, features, target, tone)
    );
  } catch (err) {
    console.error("generate failed:", err);
    return NextResponse.json(
      { error: "카피 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      output_config: {
        format: { type: "json_schema", schema: COPY_SCHEMA },
      },
    }),
  });

  if (!response.ok) {
    // 업스트림 오류 원문(모델명·내부 사유)을 사용자에게 그대로 노출하지 않는다.
    const err = await response.json().catch(() => null);
    console.error("anthropic error:", response.status, JSON.stringify(err));
    return NextResponse.json(
      { error: "AI 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const data = await response.json();

  // 실제 토큰 사용량을 남겨 비용을 추적한다.
  if (data.usage) {
    console.log(
      JSON.stringify({
        event: "generation_usage",
        input_tokens: data.usage.input_tokens,
        output_tokens: data.usage.output_tokens,
        at: new Date().toISOString(),
      })
    );
  }

  if (data.stop_reason === "max_tokens") {
    return NextResponse.json(
      { error: "카피가 너무 길어 생성이 중단되었습니다. 특징을 줄여 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const text = data.content?.find(
    (b: { type: string }) => b.type === "text"
  )?.text;

  if (!text) {
    return NextResponse.json(
      { error: "AI 응답을 파싱할 수 없습니다." },
      { status: 500 }
    );
  }

  // output_config.format이 스키마에 맞는 JSON을 보장하므로 그대로 파싱한다.
  return NextResponse.json(JSON.parse(text));
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    console.error("openai error:", response.status, JSON.stringify(err));
    return NextResponse.json(
      { error: "AI 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content);
  return NextResponse.json(parsed);
}

function getDemoResponse(
  productName: string,
  category: string,
  features: string,
  target: string,
  tone?: string
) {
  const featureList = features
    .split(/\n|\\n/)
    .map((f: string) => f.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  const mainFeature = featureList[0] || "최고의 품질";
  const subFeatures = featureList.slice(1).join(", ") || "우수한 성능";

  const isWitty = tone === "witty";
  const isPro = tone === "professional";

  return {
    detailPage: {
      title: isWitty
        ? `${productName} 안 써본 사람은 있어도, 한 번만 쓴 사람은 없습니다`
        : isPro
          ? `${mainFeature}, 임상 테스트로 입증된 ${productName}`
          : `아직도 ${category}에서 고민하세요? ${productName} 하나로 끝내세요`,
      body: isPro
        ? `${category} 시장에서 차별화된 경쟁력을 가진 ${productName}을 소개합니다.\n\n핵심 기술: ${mainFeature}\n${subFeatures} 등 검증된 스펙을 갖추고 있습니다.\n\n${target} 대상 사용 만족도 조사 결과 98.2%가 "재구매 의향이 있다"고 응답했습니다.\n\n합리적인 가격, 검증된 품질. 지금 확인하세요.`
        : isWitty
          ? `솔직히 말해서요.\n${category} 제품 뭐 쓰시는지 모르겠지만, 이거 한 번 써보면 "아... 진작 살 걸" 하게 됩니다.\n\n${mainFeature}? 당연히 되고요.\n${subFeatures}까지? 네, 됩니다. 이게 되네요.\n\n${target}이시라면 더 이상 고민하지 마세요.\n고민하는 시간에 ${productName} 검색하세요. 인생이 달라집니다. (과장 아님)`
          : `${target}이라면 한 번쯤 이런 고민 해보셨을 거예요.\n"좋은 ${category} 제품 없을까?" "가성비 좋으면서 품질도 괜찮은 거 없나?"\n\n${productName}은 바로 그 고민에서 시작했습니다.\n${mainFeature}을(를) 핵심으로, ${subFeatures}까지 갖춘 제품이에요.\n\n실제 사용자 후기에서도 "이 가격에 이 퀄리티?" 라는 반응이 쏟아지고 있습니다.\n만족도 98%, 재구매율 85%가 그 증거입니다.\n\n지금 구매하시면 한정 특가로 만나보실 수 있어요.\n늦기 전에 확인해보세요.`,
      cta: isWitty
        ? `${productName} 지금 안 사면 후회합니다 (진심) →`
        : `지금 바로 ${productName} 만나보기 →`,
    },
    blogReview: isWitty
      ? `여러분... 이거 레전드입니다 ㄹㅇ\n\n${productName} 써보고 왔는데 진짜 미쳤어요.\n\n${mainFeature} 이거 실화냐구요. ${subFeatures}까지 되는 건 좀 사기 아닌가 싶었는데 진짜 됩니다.\n\n${target}이시면 무조건 써보세요. 안 쓰면 손해, 써보면 인생템.\n\n결론: ${productName} >> 넘사벽 >> 다른 거`
      : isPro
        ? `${productName} 상세 리뷰를 공유합니다.\n\n${category} 제품을 비교 분석하던 중 ${productName}을 선택하게 되었습니다.\n\n선택 이유는 ${mainFeature}이(가) 결정적이었습니다. 추가로 ${subFeatures}도 충족하여 만족스러운 선택이었습니다.\n\n${target}에게 적합한 제품이라 판단되며, 가격 대비 성능을 고려할 때 추천할 수 있는 제품입니다.`
        : `안녕하세요~ 오늘은 요즘 핫한 ${category} 아이템, ${productName} 솔직 후기 들고 왔어요!\n\n사실 저도 처음엔 반신반의했거든요. 근데 써보고 깜짝 놀랐어요 ㅎㅎ\n\n일단 ${mainFeature}이(가) 확실히 느껴지더라구요. ${subFeatures}도 기대 이상이었고요.\n\n${target}분들께 특히 추천드려요. 저도 이제 이거 없으면 안 될 것 같아요 ㅋㅋ\n\n가격 대비 만족도 최고! ${productName} 강력 추천합니다. 궁금하신 점은 댓글로 물어봐주세요~`,
    instagram: {
      caption: isWitty
        ? `이거 광고 아니고 진짜 후기임 🫡\n\n${productName} 써봤는데\n${mainFeature} 이거 실화?\n\n안 써본 사람은 있어도\n한 번만 쓴 사람은 없다는 게 이해됨 💯`
        : isPro
          ? `${mainFeature}으로 검증된 ${productName}\n\n${target}을 위한 프리미엄 ${category}\n과학적 접근, 확실한 결과\n\n자세한 리뷰는 블로그에서 확인하세요`
          : `✨ 드디어 찾았다, 인생 ${category} 아이템\n\n${productName} 써보고 완전 반해버림 🥹\n${mainFeature} 덕분에 매일이 달라졌어요\n\n솔직히 이건 안 써본 사람만 손해 💯`,
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
