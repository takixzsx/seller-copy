"""게시물 3 — Before/After 캐러셀 (2장, 1080x1350).

인용문은 둘 다 실제 소스에서 가져온 것 (지어낸 예시 아님).
- Before: route.ts의 데모 fallback 함수에 있던 문구
- After: 2026-08-15 실제 API 재호출로 검증된 생성 결과
"""

from PIL import Image, ImageDraw
from brand_kit import W, H, INK, MUTED, BG, WHITE, RED, RED_BG, GREEN, GREEN_BG, kr, chip, wrap_by_width, takeaway_bar, page_dots, save_set


def base_slide(label, badge, accent, accent_bg, quote_text, source_note, bar_text, page):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    chip(d, 80, 90, badge, kr(34), bg=accent, fg=WHITE)
    d.text((80, 230), label, font=kr(70), fill=INK, anchor="lm")
    d.text(
        (80, 300),
        "같은 상품, 같은 AI. 프롬프트만 다릅니다",
        font=kr(32, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    card_y, card_h = 400, 420
    d.rounded_rectangle([80, card_y, W - 80, card_y + card_h], radius=28, fill=accent_bg)
    qf = kr(44)
    max_w = (W - 160) - 56 * 2
    lines = wrap_by_width(d, quote_text, qf, max_w)
    ty = card_y + 70
    for line in lines:
        d.text((80 + 56, ty), line, font=qf, fill=accent, anchor="lm")
        ty += 66
    d.text(
        (80 + 56, card_y + card_h - 60),
        source_note,
        font=kr(28, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    takeaway_bar(d, 900, bar_text, bg=accent, fg=WHITE)
    page_dots(d, page, 2)
    return img


def slide_1() -> Image.Image:
    return base_slide(
        "규칙 없이 뽑으면",
        "BEFORE",
        RED,
        RED_BG,
        '"만족도 98%, 재구매율 85%가 그 증거입니다"',
        "실제 서비스 데모 응답에 있던 문구",
        "이대로 올리면 허위광고입니다",
        1,
    )


def slide_2() -> Image.Image:
    return base_slide(
        "규칙 넣고 뽑으면",
        "AFTER",
        GREEN,
        GREEN_BG,
        '"이 텀블러는 304 스테인리스 내부로 설계되어 12시간 동안 보온 효과를 유지해요"',
        "방금 실제 생성 결과에서 그대로 인용",
        "이제 안전하게 그대로 씁니다",
        2,
    )


if __name__ == "__main__":
    save_set("beforeafter", [slide_1(), slide_2()])
    print("saved")
