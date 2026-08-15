import { NextRequest, NextResponse } from "next/server";

const VALID_PLANS = ["프로", "비즈니스"];

/**
 * 유료 플랜 버튼 클릭(= 결제 의향)을 기록한다.
 * 아직 결제를 받을 수 없는 상태라, 수요 크기를 재기 위한 신호 수집용이다.
 *
 * 현재는 구조화된 로그만 남긴다. Vercel 로그에서
 *   plan_interest
 * 로 검색하면 건수를 셀 수 있다.
 * 영구 집계가 필요해지면 이 자리에 KV/DB 기록을 추가하면 된다.
 */
export async function POST(req: NextRequest) {
  try {
    const { plan, source } = await req.json();

    if (typeof plan !== "string" || !VALID_PLANS.includes(plan)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // 개인 식별 정보는 저장하지 않는다. 어떤 플랜을 눌렀는지와 유입 경로만 본다.
    console.log(
      JSON.stringify({
        event: "plan_interest",
        plan,
        // utm_source(어느 커뮤니티에서 왔는지). 길이를 잘라 로그 오염을 막는다.
        source: typeof source === "string" ? source.slice(0, 50) : null,
        at: new Date().toISOString(),
        referer: req.headers.get("referer") ?? null,
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
