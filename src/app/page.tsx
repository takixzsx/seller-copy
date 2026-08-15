const FEATURES = [
  {
    icon: "📝",
    title: "상세페이지 판매 카피",
    desc: "후킹 제목 + 구매 전환 본문 + CTA까지. 붙여넣기만 하세요.",
  },
  {
    icon: "📰",
    title: "블로그 체험 리뷰",
    desc: "네이버 SEO 키워드가 자연스럽게 녹아든 체험 리뷰 형식 글.",
  },
  {
    icon: "📸",
    title: "인스타 캡션 + 해시태그",
    desc: "릴스·쇼츠에 바로 쓸 수 있는 캡션과 해시태그 세트.",
  },
];

const STEPS = [
  { num: "1", text: "상품 정보 입력", sub: "상품명, 카테고리, 핵심 특징, 타겟 고객" },
  { num: "2", text: "AI가 카피 생성", sub: "3종 카피를 몇 초 만에 완성" },
  { num: "3", text: "복사해서 바로 사용", sub: "스마트스토어, 쿠팡, 블로그, 인스타에 붙여넣기" },
];

const PLANS = [
  {
    name: "무료",
    price: "0원",
    period: "",
    features: ["일 3회 생성", "3종 카피 모두 이용", "기본 톤 설정"],
    cta: "무료로 시작하기",
    highlight: false,
  },
  {
    name: "프로",
    price: "9,900원",
    period: "/월",
    features: ["무제한 생성", "톤·스타일 커스텀", "생성 히스토리 저장", "우선 생성 큐"],
    cta: "프로 시작하기",
    highlight: true,
  },
  {
    name: "비즈니스",
    price: "29,900원",
    period: "/월",
    features: ["프로 기능 전부 포함", "팀원 5명까지", "브랜드 가이드 설정", "API 연동"],
    cta: "문의하기",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">셀러카피</span>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="hover:text-foreground transition">기능</a>
            <a href="#how" className="hover:text-foreground transition">사용법</a>
            <a href="#pricing" className="hover:text-foreground transition">요금</a>
            <a href="/generate" className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">시작하기</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="text-center max-w-2xl">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide">
            이커머스 셀러 전용 AI 카피라이터
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            상품 정보만 넣으면
            <br />
            <span className="text-primary">판매 카피가 완성됩니다</span>
          </h1>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            상세페이지, 블로그 리뷰, 인스타 캡션까지
            <br className="hidden md:block" />
            3종 마케팅 카피를 몇 초 만에 생성하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/generate"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-base"
            >
              무료로 시작하기
            </a>
            <a
              href="#how"
              className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-card transition text-base"
            >
              어떻게 작동하나요?
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-card py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            원클릭으로 3종 카피 생성
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            더 이상 카피라이터에게 외주 맡기거나 ChatGPT에 프롬프트 고민할 필요 없습니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            3단계로 끝
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-lg mb-1">{s.text}</h3>
                <p className="text-muted text-sm">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-card py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            요금제
          </h2>
          <p className="text-muted text-center mb-12">
            무료로 시작하고, 필요할 때 업그레이드하세요.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-6 border ${
                  p.highlight
                    ? "border-primary bg-white shadow-lg ring-2 ring-primary/20"
                    : "border-border bg-white"
                }`}
              >
                {p.highlight && (
                  <span className="inline-block text-xs font-bold text-white bg-primary px-3 py-1 rounded-full mb-4">
                    인기
                  </span>
                )}
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                  <span className="text-muted text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">&#10003;</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                    p.highlight
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-border hover:bg-card"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          지금 바로 카피를 만들어보세요
        </h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          매일 3회 무료 생성. 카드 등록 없이 바로 시작할 수 있습니다.
        </p>
        <a
          href="#pricing"
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-base"
        >
          무료로 시작하기
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span className="font-semibold text-foreground">셀러카피</span>
          <span>&copy; 2026 셀러카피. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
