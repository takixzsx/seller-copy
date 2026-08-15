import type { Metadata } from "next";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "이커머스 셀러용 AI 프롬프트 8개 (무료)",
  description:
    "스마트스토어·쿠팡 셀러가 바로 쓰는 AI 프롬프트 8개. 상세페이지, 블로그 리뷰, 인스타 캡션, 광고 카피까지. 회원가입 없이 복사해서 쓰세요.",
  keywords: [
    "이커머스 프롬프트",
    "스마트스토어 상세페이지",
    "챗GPT 프롬프트",
    "셀러 마케팅",
    "블로그 체험단 리뷰",
    "상품 상세페이지 작성",
  ],
  openGraph: {
    title: "이커머스 셀러용 AI 프롬프트 8개 (무료)",
    description:
      "복사해서 바로 쓰는 셀러 전용 AI 프롬프트. 상세페이지부터 인스타 캡션까지.",
    type: "article",
  },
};

const RULE = `아래 규칙을 반드시 지켜서 답하세요.

1. 내가 입력한 수치, 소재명, 인증명, 규격은 한 글자도 바꾸지 마세요.
2. 내가 주지 않은 수치를 지어내지 마세요. 만족도 98%, 재구매율 85%,
   판매 1위, 임상 테스트 완료 같은 표현을 만들어내지 마세요.
3. 후기, 평점, 판매량을 사실처럼 쓰지 마세요.
4. "최고", "1위", "유일한" 같은 최상급 표현은 내가 근거를 주지 않았으면 쓰지 마세요.
5. 설득력은 지어낸 숫자가 아니라, 내가 준 특징이 타겟 고객의 어떤 불편을
   해결하는지 구체적으로 연결해서 만드세요.`;

const PROMPTS = [
  {
    cat: "상세페이지",
    title: "상세페이지 본문 4단락",
    body: `[역할] 당신은 스마트스토어 상세페이지를 10년간 써온 이커머스 카피라이터입니다.

[입력]
- 상품명:
- 카테고리:
- 핵심 특징(3~5개):
- 타겟 고객:

[요청]
아래 구조로 상세페이지 본문을 4단락으로 써주세요.
1단락: 타겟 고객이 겪는 구체적 불편 상황 묘사
2단락: 이 상품이 그 불편을 어떻게 해결하는지
3단락: 위 주장을 내가 준 특징으로 뒷받침
4단락: 지금 구매해야 할 이유

[제약]
- 내가 준 특징 외의 기능을 추가하지 마세요.
- 각 단락은 3~4문장. 문단 사이는 빈 줄로 구분.`,
  },
  {
    cat: "상세페이지",
    title: "후킹 제목 20개 뽑기",
    body: `[역할] 당신은 클릭률을 기준으로 제목을 평가하는 퍼포먼스 마케터입니다.

[입력]
- 상품명:
- 핵심 특징:
- 타겟 고객:

[요청]
상세페이지 최상단에 넣을 후킹 제목을 20개 만들어주세요.
다음 5가지 유형을 각 4개씩 섞어주세요.
- 질문형 / 숫자형 / 반전형 / 공감형 / 결과형

[제약]
- 숫자형은 내가 준 수치만 쓰세요. 없으면 공감형으로 채우세요.
- 각 제목 25자 이내.`,
  },
  {
    cat: "상세페이지",
    title: "구매 망설임 반론 처리",
    body: `[역할] 당신은 고객 이탈 원인을 분석하는 CS 매니저입니다.

[입력]
- 상품명:
- 가격:
- 경쟁 상품 대비 비싼 점 / 아쉬운 점:

[요청]
1) 고객이 구매를 망설일 이유를 8개 예측해주세요.
2) 각각에 대해 상세페이지에 넣을 반박 문단을 2~3문장으로 써주세요.

[제약]
- 단점을 없는 것처럼 쓰지 마세요. 인정하고 상쇄하는 가치를 제시하세요.
- 환불/교환 정책은 내가 알려주지 않았으면 언급하지 마세요.`,
  },
  {
    cat: "블로그 · SEO",
    title: "체험 리뷰형 포스팅",
    body: `[역할] 당신은 협찬 리뷰를 자연스럽게 쓰는 블로거입니다.

[입력]
- 상품명:
- 핵심 특징:
- 사용 기간:
- 실제로 좋았던 점:
- 실제로 아쉬웠던 점:

[요청]
네이버 블로그 체험 리뷰를 1,200자 내외로 써주세요.
1인칭 시점, 사용 전 고민 → 사용 과정 → 결과 순서로.

[제약]
- 아쉬웠던 점을 반드시 포함하세요. 장점만 쓰면 광고로 읽힙니다.
- 내가 쓰지 않은 사용 경험을 지어내지 마세요.`,
  },
  {
    cat: "블로그 · SEO",
    title: "키워드 30개 추출",
    body: `[역할] 당신은 네이버 SEO 컨설턴트입니다.

[입력]
- 상품명:
- 카테고리:
- 타겟 고객:

[요청]
블로그 상위노출을 노릴 키워드를 30개 뽑아주세요.
- 대형 5개 / 중형 10개 / 롱테일 15개
각 키워드마다 어떤 검색 의도인지 한 줄로 적어주세요.

[제약]
- 실제 검색량 수치를 추정해서 적지 마세요. 상대적 크기만 분류하세요.`,
  },
  {
    cat: "인스타 · 릴스",
    title: "릴스 15초 대본",
    body: `[역할] 당신은 조회수가 잘 나오는 릴스를 만드는 크리에이터입니다.

[입력]
- 상품명:
- 가장 시각적으로 보여줄 수 있는 특징:
- 타겟 고객:

[요청]
15초 릴스 대본을 표로 써주세요.
열: 초 구간 / 화면에 보이는 것 / 자막 / 나레이션

[제약]
- 0~2초 안에 후킹이 끝나야 합니다.
- 스마트폰으로 찍을 수 있는 장면만.`,
  },
  {
    cat: "인스타 · 릴스",
    title: "해시태그 3세트",
    body: `[역할] 당신은 인스타 도달을 최적화하는 마케터입니다.

[입력]
- 상품명:
- 카테고리:
- 타겟 고객:

[요청]
해시태그를 3세트로 만들어주세요. 각 세트 15개.
- 세트 A: 대형 태그 위주 (도달 우선)
- 세트 B: 중소형 태그 위주 (참여율 우선)
- 세트 C: 타겟 특화 (구매 의도 우선)

[제약]
- 세트 간 중복 5개 이하.`,
  },
  {
    cat: "광고 · 운영",
    title: "부정 리뷰 대응",
    body: `[역할] 당신은 브랜드 평판을 관리하는 CS 매니저입니다.

[입력]
- 상품명:
- 받은 부정 리뷰 내용(복사해서 붙여넣기):
- 실제 사실 관계:

[요청]
공개 답변을 써주세요. 그리고 이 리뷰에서 개선해야 할 점을 정리해주세요.

[제약]
- 변명하지 말고 사실 관계만 정확히 밝히세요.
- 내가 알려준 사실 관계를 벗어나지 마세요.`,
  },
];

export default function PackPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <a href="/" className="text-primary font-bold text-lg">
          셀러카피
        </a>
        <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-3 leading-snug">
          이커머스 셀러용 AI 프롬프트 8개
        </h1>
        <p className="text-muted leading-relaxed">
          스마트스토어·쿠팡 셀러가 바로 쓰는 프롬프트입니다. 회원가입도, 이메일
          입력도 필요 없습니다. 복사해서 ChatGPT나 Claude에 붙여넣고 빈칸만
          채우세요.
        </p>
      </header>

      <section className="mb-10 border border-primary/30 bg-primary/5 rounded-xl p-5">
        <h2 className="font-bold mb-2">먼저 이 규칙을 프롬프트 앞에 붙이세요</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          대부분의 프롬프트 모음이 빠뜨리는 부분입니다. 이걸 안 넣으면 AI가
          &ldquo;만족도 98%&rdquo;, &ldquo;업계 1위&rdquo; 같은 검증 불가능한
          수치를 지어냅니다. 그대로 상세페이지에 쓰면 허위광고가 됩니다.
        </p>
        <pre className="bg-white border border-border rounded-lg p-4 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
          {RULE}
        </pre>
        <CopyButton text={RULE} label="규칙 복사하기" />
      </section>

      <div className="space-y-6">
        {PROMPTS.map((p, i) => (
          <article
            key={p.title}
            className="border border-border rounded-xl p-5 bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {p.cat}
              </span>
              <span className="text-xs text-muted">{i + 1} / 8</span>
            </div>
            <h2 className="font-bold mb-3">{p.title}</h2>
            <pre className="bg-card border border-border rounded-lg p-4 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {p.body}
            </pre>
            <CopyButton text={`${RULE}\n\n---\n\n${p.body}`} />
          </article>
        ))}
      </div>

      <section className="mt-12 border border-border rounded-xl p-6 bg-card text-center">
        <h2 className="font-bold text-lg mb-2">
          빈칸 채우는 것도 번거로우시다면
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-5">
          셀러카피는 상품명·특징·타겟만 넣으면 상세페이지, 블로그 리뷰, 인스타
          캡션 3종을 한 번에 만들어줍니다. 위 규칙이 이미 적용되어 있어서 수치를
          지어내지 않습니다. 하루 3회 무료입니다.
        </p>
        <a
          href="/generate"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition"
        >
          무료로 카피 생성해보기
        </a>
      </section>

      <footer className="mt-10 text-center text-xs text-muted">
        <a href="/" className="hover:text-foreground transition">
          셀러카피 홈으로
        </a>
      </footer>
    </main>
  );
}
