"""게시물 2 — 규칙 카드 캐러셀 (2장, 1080x1350 세로형).

세로 4:5 비율을 쓰는 이유: 인스타 피드에서 정사각형보다 화면을
더 많이 차지해서 스크롤 중 눈에 잘 띈다(현재 권장 비율).
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
BLUE = (37, 99, 235)
INK = (17, 17, 17)
MUTED = (107, 114, 128)
BG = (247, 248, 250)
WHITE = (255, 255, 255)
KR = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = "/Users/min/seller-copy/products/brand"


def kr(size: int, bold=True) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(KR, size, index=6 if bold else 2)


def tracked(draw, cx, cy, text, f, fill, tracking=0, anchor="mm"):
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2 if "m" in anchor[0] else cx
    for ch, w in zip(text, widths):
        draw.text((x + w / 2, cy), ch, font=f, fill=fill, anchor="mm")
        x += w + tracking


def wrap_by_width(draw, text, f, max_width):
    """어절 단위로 픽셀 폭에 맞춰 줄바꿈."""
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


def chip(draw, x, y, text, f):
    pad_x, pad_y = 24, 14
    tw = draw.textlength(text, font=f)
    th = f.size
    draw.rounded_rectangle(
        [x, y, x + tw + pad_x * 2, y + th + pad_y * 2], radius=999, fill=BLUE
    )
    draw.text((x + pad_x, y + pad_y + th / 2), text, font=f, fill=WHITE, anchor="lm")


def slide_1() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    chip(d, 80, 90, "저장 필수", kr(34))

    title_f = kr(84)
    lines = ["AI에 상세페이지 시킬 때", "이 4줄부터", "먼저 붙이세요"]
    y = 300
    for line in lines:
        d.text((80, y), line, font=title_f, fill=INK, anchor="lm")
        y += 108

    sub_f = kr(38, bold=False)
    d.text(
        (80, y + 60),
        "안 붙이면 AI가 수치를 지어냅니다",
        font=sub_f,
        fill=MUTED,
        anchor="lm",
    )

    # 하단 페이지 인디케이터
    d.ellipse([W / 2 - 46, H - 90, W / 2 - 14, H - 58], fill=BLUE)
    d.ellipse([W / 2 + 14, H - 90, W / 2 + 46, H - 58], fill=(209, 213, 219))
    d.text((W - 80, H - 74), "1/2", font=kr(30, bold=False), fill=MUTED, anchor="rm")

    return img


def slide_2() -> Image.Image:
    img = Image.new("RGB", (W, H), BLUE)
    d = ImageDraw.Draw(img)

    d.text((80, 96), "이 규칙, 프롬프트 맨 앞에 붙이세요", font=kr(46), fill=WHITE, anchor="lm")

    rules = [
        ("1", "내가 준 수치·소재명·규격은", "한 글자도 바꾸지 마세요"),
        ("2", "내가 주지 않은 수치를", "지어내지 마세요 (만족도 98% 등)"),
        ("3", "후기·평점·판매량을", "사실처럼 쓰지 마세요"),
        ("4", '"최고" "1위" "유일한"은', "근거 없으면 쓰지 마세요"),
    ]

    y = 260
    num_f = kr(56)
    line_f = kr(40)
    for num, l1, l2 in rules:
        d.rounded_rectangle([80, y, 168, y + 88], radius=20, fill=WHITE)
        d.text((124, y + 44), num, font=num_f, fill=BLUE, anchor="mm")
        d.text((196, y + 20), l1, font=line_f, fill=WHITE, anchor="lm")
        d.text((196, y + 66), l2, font=line_f, fill=(191, 219, 254), anchor="lm")
        y += 132

    d.text(
        (80, y + 40),
        "4개 톤 6회 재검증, 수치 왜곡 0건",
        font=kr(32, bold=False),
        fill=(191, 219, 254),
        anchor="lm",
    )

    d.ellipse([W / 2 - 46, H - 90, W / 2 - 14, H - 58], fill=(191, 219, 254))
    d.ellipse([W / 2 + 14, H - 90, W / 2 + 46, H - 58], fill=WHITE)
    d.text((W - 80, H - 74), "2/2", font=kr(30, bold=False), fill=(191, 219, 254), anchor="rm")

    return img


if __name__ == "__main__":
    slide_1().save(f"{OUT}/rulecard_1.png")
    slide_2().save(f"{OUT}/rulecard_2.png")

    sheet = Image.new("RGB", (2200, 1350), (255, 255, 255))
    sheet.paste(Image.open(f"{OUT}/rulecard_1.png"), (20, 0))
    sheet.paste(Image.open(f"{OUT}/rulecard_2.png"), (1100, 0))
    sheet.save(f"{OUT}/rulecard_sheet.png")
    print("saved")
