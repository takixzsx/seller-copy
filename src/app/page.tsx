import PricingPlans from "@/components/PricingPlans";

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
    href: "/generate",
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
            <a href="#features" className="hidden sm:block hover:text-foreground transition">기능</a>
            <a href="#how" className="hidden sm:block hover:text-foreground transition">사용법</a>
            <a href="#pricing" className="hidden sm:block hover:text-foreground transition">요금</a>
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

      {/* Demo Preview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            이런 카피가 나옵니다
          </h2>
          <p className="text-muted text-center mb-10 max-w-xl mx-auto">
            &ldquo;프리미엄 세라마이드 수분크림&rdquo;으로 생성한 실제 예시입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="border border-border rounded-xl p-5">
              <span className="text-xs font-semibold text-muted tracking-wide">상세페이지</span>
              <h4 className="font-bold text-primary mt-2 mb-3 leading-snug">
                아직도 수분크림에서 고민하세요? 이 제품 하나로 끝내세요
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                건조한 피부 고민이라면 한 번쯤 이런 고민 해보셨을 거예요. &ldquo;좋은 수분크림 없을까?&rdquo; 세라마이드 5종 함유, 48시간 보습 지속까지 갖춘 제품이에요.
              </p>
              <span className="inline-block mt-3 text-xs text-primary font-medium">+ 더 보기</span>
            </div>
            <div className="border border-border rounded-xl p-5">
              <span className="text-xs font-semibold text-muted tracking-wide">블로그 리뷰</span>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-6">
                안녕하세요~ 오늘은 요즘 핫한 뷰티 아이템, 프리미엄 세라마이드 수분크림 솔직 후기 들고 왔어요! 사실 저도 처음엔 반신반의했거든요. 근데 써보고 깜짝 놀랐어요 ㅎㅎ 일단 세라마이드 5종 함유가 확실히 느껴지더라구요.
              </p>
              <span className="inline-block mt-3 text-xs text-primary font-medium">+ 더 보기</span>
            </div>
            <div className="border border-border rounded-xl p-5">
              <span className="text-xs font-semibold text-muted tracking-wide">인스타그램</span>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-3">
                &#10024; 드디어 찾았다, 인생 뷰티 아이템<br />
                써보고 완전 반해버림 &#129401;<br />
                세라마이드 덕분에 매일이 달라졌어요
              </p>
              <div className="flex flex-wrap gap-1">
                {["#수분크림추천", "#세라마이드", "#솔직후기", "#인생템"].map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <a
              href="/generate"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              내 상품으로 직접 만들어보기
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-card py-20 px-4">
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
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            요금제
          </h2>
          <p className="text-muted text-center mb-12">
            무료로 시작하고, 필요할 때 업그레이드하세요.
          </p>
          <PricingPlans plans={PLANS} />
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
