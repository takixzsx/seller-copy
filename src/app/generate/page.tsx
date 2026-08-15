"use client";

import { useState, useEffect, useCallback } from "react";

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

const TONES = [
  { value: "friendly", label: "친근한", desc: "~해요체, 이모티콘" },
  { value: "professional", label: "전문적인", desc: "신뢰감, 데이터 중심" },
  { value: "emotional", label: "감성적인", desc: "스토리텔링, 공감" },
  { value: "witty", label: "위트있는", desc: "유머, 밈 감성" },
];

const FREE_LIMIT = 3;

interface GeneratedCopy {
  detailPage: { title: string; body: string; cta: string };
  blogReview: string;
  instagram: { caption: string; hashtags: string[] };
}

function getTodayKey() {
  return `sellercopy_usage_${new Date().toISOString().slice(0, 10)}`;
}

function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(getTodayKey()) || "0", 10);
}

function incrementUsage() {
  const key = getTodayKey();
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, String(current + 1));
}

export default function GeneratePage() {
  const [form, setForm] = useState({
    productName: "",
    category: "",
    features: "",
    target: "",
    tone: "friendly",
  });
  const [result, setResult] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"detail" | "blog" | "insta">(
    "detail"
  );

  useEffect(() => {
    setUsageCount(getUsageCount());
  }, []);

  const remaining = FREE_LIMIT - usageCount;

  const canSubmit =
    form.productName.trim() &&
    form.category &&
    form.features.trim() &&
    form.target.trim() &&
    remaining > 0;

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
      setActiveTab("detail");
      incrementUsage();
      setUsageCount(getUsageCount());
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-primary">
            셀러카피
          </a>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">
              오늘 남은 횟수{" "}
              <span
                className={`font-bold ${remaining > 0 ? "text-primary" : "text-red-500"}`}
              >
                {remaining}/{FREE_LIMIT}
              </span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* Input Form */}
          <div>
            <h1 className="text-xl font-bold mb-1">카피 생성하기</h1>
            <p className="text-muted text-sm mb-6">
              상품 정보를 입력하면 AI가 3종 카피를 생성합니다.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="상품명">
                <input
                  type="text"
                  placeholder="예: 프리미엄 세라마이드 수분크림"
                  value={form.productName}
                  onChange={(e) =>
                    setForm({ ...form, productName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </Field>

              <Field label="카테고리">
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
              </Field>

              <Field label="핵심 특징 (3~5개)">
                <textarea
                  placeholder={
                    "예:\n- 세라마이드 5종 함유\n- 48시간 보습 지속\n- 민감성 피부 테스트 완료"
                  }
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </Field>

              <Field label="타겟 고객">
                <input
                  type="text"
                  placeholder="예: 20~30대 건조한 피부 고민 여성"
                  value={form.target}
                  onChange={(e) =>
                    setForm({ ...form, target: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </Field>

              <Field label="톤 & 스타일" required={false}>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, tone: t.value })}
                      className={`px-3 py-2 rounded-lg border text-left transition text-sm ${
                        form.tone === t.value
                          ? "border-primary bg-blue-50 text-primary"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <span className="block text-xs text-muted mt-0.5">
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              {remaining <= 0 ? (
                <div className="text-center py-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 font-medium mb-1">
                    오늘 무료 생성 횟수를 모두 사용했습니다
                  </p>
                  <p className="text-xs text-red-500">
                    내일 다시 3회 무료로 생성할 수 있어요
                  </p>
                  <button className="mt-3 px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition">
                    프로 플랜 시작하기
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="h-4 w-4" />
                      생성 중...
                    </span>
                  ) : (
                    "카피 생성하기"
                  )}
                </button>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          </div>

          {/* Results */}
          <div>
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted text-sm border border-dashed border-border rounded-xl p-12 min-h-[400px]">
                <svg
                  className="w-12 h-12 mb-4 text-border"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p>상품 정보를 입력하고</p>
                <p>생성 버튼을 눌러주세요</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted text-sm border border-dashed border-border rounded-xl p-12 min-h-[400px]">
                <Spinner className="h-10 w-10 text-primary mb-4" />
                <p className="font-medium text-foreground">
                  AI가 카피를 생성하고 있습니다
                </p>
                <p className="text-xs mt-1">약 5~10초 소요됩니다</p>
              </div>
            )}

            {result && (
              <div>
                {/* Tabs */}
                <div className="flex border-b border-border mb-5">
                  {(
                    [
                      { key: "detail", label: "상세페이지" },
                      { key: "blog", label: "블로그 리뷰" },
                      { key: "insta", label: "인스타그램" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                        activeTab === tab.key
                          ? "border-primary text-primary"
                          : "border-transparent text-muted hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Detail Page Copy */}
                {activeTab === "detail" && (
                  <ResultCard
                    copied={copied === "detail"}
                    onCopy={() =>
                      copyToClipboard(
                        `${result.detailPage.title}\n\n${result.detailPage.body}\n\n${result.detailPage.cta}`,
                        "detail"
                      )
                    }
                  >
                    <h3 className="text-lg font-bold mb-4 text-primary leading-snug">
                      {result.detailPage.title}
                    </h3>
                    <div className="text-sm leading-relaxed whitespace-pre-line mb-5 text-gray-700">
                      {result.detailPage.body}
                    </div>
                    <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                      {result.detailPage.cta}
                    </div>
                  </ResultCard>
                )}

                {/* Blog Review */}
                {activeTab === "blog" && (
                  <ResultCard
                    copied={copied === "blog"}
                    onCopy={() =>
                      copyToClipboard(result.blogReview, "blog")
                    }
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                      {result.blogReview}
                    </div>
                  </ResultCard>
                )}

                {/* Instagram */}
                {activeTab === "insta" && (
                  <ResultCard
                    copied={copied === "insta"}
                    onCopy={() =>
                      copyToClipboard(
                        `${result.instagram.caption}\n\n${result.instagram.hashtags.join(" ")}`,
                        "insta"
                      )
                    }
                  >
                    <div className="text-sm leading-relaxed mb-4 text-gray-700 whitespace-pre-line">
                      {result.instagram.caption}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.instagram.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-50 text-primary px-2.5 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ResultCard>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg animate-fade-in z-50">
          클립보드에 복사되었습니다
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
  required = true,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ResultCard({
  children,
  copied,
  onCopy,
}: {
  children: React.ReactNode;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="border border-border rounded-xl p-5 relative">
      <button
        onClick={onCopy}
        className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
          copied
            ? "bg-green-50 text-green-600"
            : "bg-gray-50 text-muted hover:bg-gray-100 hover:text-foreground"
        }`}
      >
        {copied ? "복사됨!" : "복사하기"}
      </button>
      <div className="pr-20">{children}</div>
    </div>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
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
  );
}
