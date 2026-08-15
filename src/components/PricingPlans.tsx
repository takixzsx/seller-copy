"use client";

import { useState } from "react";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlight: boolean;
  /** 무료 플랜은 바로 생성 페이지로, 유료 플랜은 관심 등록 모달로 */
  href?: string;
};

export default function PricingPlans({ plans }: { plans: Plan[] }) {
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  function handlePaidClick(planName: string) {
    setOpenPlan(planName);
    // 어느 채널에서 유입됐는지(?utm_source=...) 같이 기록한다.
    const source = new URLSearchParams(window.location.search).get("utm_source");
    // 관심 신호 기록. 실패해도 사용자 경험을 막지 않는다.
    void fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planName, source }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
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
            {p.href ? (
              <a
                href={p.href}
                className={`block text-center w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                  p.highlight
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-border hover:bg-card"
                }`}
              >
                {p.cta}
              </a>
            ) : (
              <button
                onClick={() => handlePaidClick(p.name)}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                  p.highlight
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-border hover:bg-card"
                }`}
              >
                {p.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {openPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpenPlan(null)}
          role="presentation"
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="interest-title"
          >
            <h3 id="interest-title" className="font-bold text-lg mb-2">
              {openPlan} 플랜은 준비 중입니다
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              아직 결제 기능이 열리지 않았습니다. 방금 관심을 보여주신 것으로
              기록됐고, 이런 신호가 모이면 우선순위를 높여 준비하겠습니다.
            </p>
            <p className="text-sm text-muted leading-relaxed mb-5">
              그동안에는 <strong className="text-foreground">무료 플랜으로 하루 3회</strong>{" "}
              모든 기능을 그대로 쓰실 수 있습니다.
            </p>
            <div className="flex gap-2">
              <a
                href="/generate"
                className="flex-1 text-center py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition"
              >
                무료로 사용해보기
              </a>
              <button
                onClick={() => setOpenPlan(null)}
                className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-card transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
