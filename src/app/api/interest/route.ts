import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

/** 표시용 플랜 이름 → Blob 경로에 쓸 ASCII 슬러그 */
const PLAN_SLUGS: Record<string, string> = {
  프로: "pro",
  비즈니스: "business",
};

/** 클릭 1건 = Blob 1개. 이 접두사 아래 개수를 세면 총 건수가 된다. */
const INTEREST_PREFIX = "plan-interest/";

/**
 * 유료 플랜 버튼 클릭(= 결제 의향)을 기록한다.
 * 아직 결제를 받을 수 없는 상태라, 수요 크기를 재기 위한 신호 수집용이다.
 *
 * 클릭 1건마다 Blob 스토어(seller-copy-signals, private)에
 *   plan-interest/<plan>/<timestamp>-<uuid>.json
 * 을 하나 쓴다. 런타임 로그는 Hobby 플랜에서 몇 시간 만에 사라지지만
 * Blob은 남으므로, 누적 건수는 `npm run interest`로 언제든 셀 수 있다.
 */
export async function POST(req: NextRequest) {
  let plan: unknown;
  let source: unknown;

  try {
    ({ plan, source } = await req.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof plan !== "string" || !(plan in PLAN_SLUGS)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 개인 식별 정보는 저장하지 않는다. 어떤 플랜을 눌렀는지와 유입 경로만 본다.
  const record = {
    event: "plan_interest",
    plan,
    // utm_source(어느 커뮤니티에서 왔는지). 길이를 잘라 로그 오염을 막는다.
    source: typeof source === "string" ? source.slice(0, 50) : null,
    at: new Date().toISOString(),
    referer: req.headers.get("referer") ?? null,
  };

  // 실시간으로 훑어볼 때 편하도록 로그도 그대로 남긴다.
  console.log(JSON.stringify(record));

  try {
    await put(
      `${INTEREST_PREFIX}${PLAN_SLUGS[plan]}/${record.at}-${crypto.randomUUID()}.json`,
      JSON.stringify(record),
      { access: "private", addRandomSuffix: false, contentType: "application/json" }
    );
  } catch (err) {
    // 기록에 실패해도 사용자 경험은 막지 않는다. 신호 하나를 잃을 뿐이다.
    console.error("plan_interest 저장 실패", err);
  }

  return NextResponse.json({ ok: true });
}
