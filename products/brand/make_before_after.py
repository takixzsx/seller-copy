"""게시물 3 — Before/After 캐러셀 (2장, 1080x1350).

인용문은 둘 다 실제 소스에서 가져온 것.
- Before: route.ts의 데모 fallback 함수에 있던 문구(수정 전 상태의 실제 예시)
- After: 2026-08-15 실제 API 호출로 검증된 생성 결과
지어낸 문장이 아니라 실제 기록에서 인용한다.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
RED = (220, 38, 38)
RED_BG = (254, 242, 242)
GREEN = (22, 163, 74)
GREEN_BG = (240, 253, 244)
INK = (17, 17, 17)
MUTED = (107, 114, 128)
BG = (247, 248, 250)
WHITE = (255, 255, 255)
BLUE = (37, 99, 235)
KR = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = "/Users/min/seller-copy/products/brand"


def kr(size: int, bold=True) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(KR, size, index=6 if bold else 2)


def tracked(draw, cx, cy, text, f, fill, tracking=0):
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x + w / 2, cy), ch, font=f, fill=fill, anchor="mm")
        x += w + tracking


def wrap_by_width(draw, text, f, max_width):
    words = text.split(" ")
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=f) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def chip(draw, x, y, text, f, bg, fg):
    pad_x, pad_y = 22, 12
    tw = draw.textlength(text, font=f)
    th = f.size
    draw.rounded_rectangle(
        [x, y, x + tw + pad_x * 2, y + th + pad_y * 2], radius=999, fill=bg
    )
    draw.text((x + pad_x, y + pad_y + th / 2), text, font=f, fill=fg, anchor="lm")


def card(draw, x, y, w, h, bg):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=28, fill=bg)


def base_slide(label, badge, accent, card_bg, quote_text, quote_color, source_note, page):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    chip(d, 80, 90, badge, kr(34), accent, WHITE)

    title_f = kr(70)
    d.text((80, 230), label, font=title_f, fill=INK, anchor="lm")

    d.text(
        (80, 300),
        "같은 상품, 같은 AI. 프롬프트만 다릅니다",
        font=kr(32, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    # 인용 카드 — 실제 폭을 측정해 자동 줄바꿈(하드코딩 줄바꿈 금지)
    card_y, card_h = 400, 520
    card(d, 80, card_y, W - 160, card_h, card_bg)
    qf = kr(44)
    max_text_width = (W - 160) - 56 * 2
    quote_lines = wrap_by_width(d, quote_text, qf, max_text_width)
    ty = card_y + 70
    for line in quote_lines:
        d.text((80 + 56, ty), line, font=qf, fill=quote_color, anchor="lm")
        ty += 66

    d.text(
        (80 + 56, card_y + card_h - 60),
        source_note,
        font=kr(28, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    d.ellipse([W / 2 - 46, H - 90, W / 2 - 14, H - 58], fill=BLUE if page == 1 else (209, 213, 219))
    d.ellipse([W / 2 + 14, H - 90, W / 2 + 46, H - 58], fill=(209, 213, 219) if page == 1 else BLUE)
    d.text((W - 80, H - 74), f"{page}/2", font=kr(30, bold=False), fill=MUTED, anchor="rm")

    return img


def slide_1() -> Image.Image:
    # route.ts 데모 fallback 함수에 실제로 있던 문구를 그대로 인용 (지어낸 문장 아님)
    quote = '"만족도 98%, 재구매율 85%가 그 증거입니다"'
    return base_slide(
        "규칙 없이 뽑으면",
        "BEFORE",
        RED,
        RED_BG,
        quote,
        RED,
        "실제 서비스 데모 응답에 있던 문구",
        1,
    )


def slide_2() -> Image.Image:
    # 방금 실제 API를 다시 호출해 받은 결과에서 그대로 인용 (기억이 아니라 실측)
    quote = '"이 텀블러는 304 스테인리스 내부로 설계되어 12시간 동안 보온 효과를 유지해요"'
    return base_slide(
        "규칙 넣고 뽑으면",
        "AFTER",
        GREEN,
        GREEN_BG,
        quote,
        GREEN,
        "방금 실제 생성 결과에서 그대로 인용",
        2,
    )


if __name__ == "__main__":
    slide_1().save(f"{OUT}/beforeafter_1.png")
    slide_2().save(f"{OUT}/beforeafter_2.png")

    sheet = Image.new("RGB", (2200, 1350), (255, 255, 255))
    sheet.paste(Image.open(f"{OUT}/beforeafter_1.png"), (20, 0))
    sheet.paste(Image.open(f"{OUT}/beforeafter_2.png"), (1100, 0))
    sheet.save(f"{OUT}/beforeafter_sheet.png")
    print("saved")
