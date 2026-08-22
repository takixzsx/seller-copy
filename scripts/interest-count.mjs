/**
 * 페이크 도어(유료 플랜 버튼) 클릭 누적 건수를 센다.
 *
 *   npm run interest
 *
 * Blob 스토어에 클릭 1건당 파일 1개가 쌓여 있으므로, 접두사별로 개수를 세면 된다.
 * 파일 내용은 받지 않고 목록만 훑기 때문에 건수가 많아져도 빠르다.
 */
import { list } from "@vercel/blob";

const PREFIX = "plan-interest/";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN이 없습니다. `vercel env pull .env.local --scope lucid18` 후 다시 실행하세요."
  );
  process.exit(1);
}

const byPlan = new Map();
const byDay = new Map();
let cursor;

do {
  const res = await list({ prefix: PREFIX, cursor, limit: 1000 });
  for (const blob of res.blobs) {
    // plan-interest/<plan>/<ISO타임스탬프>-<uuid>.json
    const [, plan = "unknown", file = ""] = blob.pathname.split("/");
    byPlan.set(plan, (byPlan.get(plan) ?? 0) + 1);
    byDay.set(file.slice(0, 10), (byDay.get(file.slice(0, 10)) ?? 0) + 1);
  }
  cursor = res.hasMore ? res.cursor : undefined;
} while (cursor);

const total = [...byPlan.values()].reduce((a, b) => a + b, 0);

if (total === 0) {
  console.log("아직 클릭이 없습니다.");
  process.exit(0);
}

console.log(`\n총 ${total}건\n`);
console.log("플랜별");
for (const [plan, n] of [...byPlan].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${plan.padEnd(10)} ${n}`);
}
console.log("\n날짜별");
for (const [day, n] of [...byDay].sort()) {
  console.log(`  ${day}  ${"#".repeat(Math.min(n, 40))} ${n}`);
}