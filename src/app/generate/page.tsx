"use client";

import { useState } from "react";

const CATEGORIES = [
  "패션/의류",
  "뷰티/화장품",
  "식품/건강",
  "생활/주방",
  "디지털/가전",
  "유아/아동",
  "스포츠/레저",
  "반려동물",
  "인테리어/가구",
  "기타",
];

interface GeneratedCopy {
  detailPage: { title: string; body: string; cta: string };
  blogReview: string;
  instagram: { caption: string; hashtags: string[] };
}

export default function GeneratePage() {
  const [form, setForm] = useState({
    productName: "",
    category: "",
    features: "",
    target: "",
  });
  const [result, setResult] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const canSubmit =
    form.productName.trim() &&
    form.category &&
    form.features.trim() &&
    form.target.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "생성에 실패했습니다.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-primary">
            셀러카피
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">카피 생성하기</h1>
        <p className="text-muted mb-8">
          상품 정보를 입력하면 3종 마케팅 카피를 AI가 생성합니다.
        </p>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 프리미엄 세라마이드 수분크림"
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option value="">카테고리 선택</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                핵심 특징 (3~5개) <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder={"예:\n- 세라마이드 5종 함유\n- 48시간 보습 지속\n- 민감성 피부 테스트 완료"}
                value={form.features}
                onChange={(e) =>
                  setForm({ ...form, features: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                타겟 고객 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 20~30대 건조한 피부 고민 여성"
                value={form.target}
                onChange={(e) =>
                  setForm({ ...form, target: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  생성 중...
                </span>
              ) : (
                "카피 생성하기"
              )}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          {/* Results */}
          <div className="space-y-6">
            {!result && !loading && (
              <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-border rounded-xl p-12">
                왼쪽에서 상품 정보를 입력하고 생성 버튼을 눌러주세요.
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full text-muted text-sm border border-dashed border-border rounded-xl p-12">
                <div className="text-center">
                  <svg
                    className="animate-spin h-8 w-8 text-primary mx-auto mb-3"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  AI가 카피를 생성하고 있습니다...
                </div>
              </div>
            )}

            {result && (
              <>
                {/* 상세페이지 카피 */}
                <ResultCard
                  label="상세페이지 판매 카피"
                  copied={copied === "detail"}
                  onCopy={() =>
                    copyToClipboard(
                      `${result.detailPage.title}\n\n${result.detailPage.body}\n\n${result.detailPage.cta}`,
                      "detail"
                    )
                  }
                >
                  <h3 className="text-lg font-bold mb-3 text-primary">
                    {result.detailPage.title}
                  </h3>
                  <div className="text-sm leading-relaxed whitespace-pre-line mb-4">
                    {result.detailPage.body}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {result.detailPage.cta}
                  </div>
                </ResultCard>

                {/* 블로그 리뷰 */}
                <ResultCard
                  label="블로그 체험 리뷰"
                  copied={copied === "blog"}
                  onCopy={() =>
                    copyToClipboard(result.blogReview, "blog")
                  }
                >
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {result.blogReview}
                  </div>
                </ResultCard>

                {/* 인스타 캡션 */}
                <ResultCard
                  label="인스타그램 캡션 + 해시태그"
                  copied={copied === "insta"}
                  onCopy={() =>
                    copyToClipboard(
                      `${result.instagram.caption}\n\n${result.instagram.hashtags.join(" ")}`,
                      "insta"
                    )
                  }
                >
                  <div className="text-sm leading-relaxed mb-3">
                    {result.instagram.caption}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.instagram.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </ResultCard>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ResultCard({
  label,
  children,
  copied,
  onCopy,
}: {
  label: string;
  children: React.ReactNode;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          {label}
        </span>
        <button
          onClick={onCopy}
          className="text-xs text-primary hover:text-primary-dark transition font-medium"
        >
          {copied ? "복사됨!" : "복사하기"}
        </button>
      </div>
      {children}
    </div>
  );
}
