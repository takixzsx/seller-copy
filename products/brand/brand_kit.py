"""셀러카피 인스타 카드뉴스 공통 툴킷.

디자인 원칙: 클릭웨이브 벤치마크에서 구조(칩 라벨 · 하단 테이크어웨이 바 ·
예시 카드)는 차용하되, 네온/다크 톤은 쓰지 않는다. 저희 차별점은
"AI가 수치를 지어내지 않는다"는 신뢰이므로, 자극적인 톤 대신
차분한 블루·화이트 팔레트를 유지한다.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
BLUE = (37, 99, 235)
LIGHT_BLUE = (191, 219, 254)
INK = (17, 17, 17)
MUTED = (107, 114, 128)
BG = (247, 248, 250)
WHITE = (255, 255, 255)
RED = (220, 38, 38)
RED_BG = (254, 242, 242)
GREEN = (22, 163, 74)
GREEN_BG = (240, 253, 244)
KR_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = "/Users/min/seller-copy/products/brand"


def kr(size: int, bold=True) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(KR_PATH, size, index=6 if bold else 2)


def tracked(draw, cx, cy, text, f, fill, tracking=0):
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
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


def chip(draw, x, y, text, f, bg=BLUE, fg=WHITE):
    pad_x, pad_y = 24, 14
    tw = draw.textlength(text, font=f)
    th = f.size
    draw.rounded_rectangle(
        [x, y, x + tw + pad_x * 2, y + th + pad_y * 2], radius=999, fill=bg
    )
    draw.text((x + pad_x, y + pad_y + th / 2), text, font=f, fill=fg, anchor="lm")


def takeaway_bar(draw, y, text, bg=INK, fg=WHITE, margin=80):
    """클릭웨이브 벤치마크에서 차용한 하단 강조 바.
    스크롤하다 이 한 줄만 읽어도 핵심이 남게 하는 용도."""
    f = kr(34)
    lines = wrap_by_width(draw, text, f, W - margin * 2 - 64)
    line_h = 46
    bar_h = 48 + line_h * len(lines)
    draw.rounded_rectangle([margin, y, W - margin, y + bar_h], radius=20, fill=bg)
    ty = y + 24 + line_h / 2
    for line in lines:
        tracked(draw, W / 2, ty, line, f, fg, tracking=-2)
        ty += line_h
    return y + bar_h  # 다음 요소가 이어 붙일 y좌표


def page_dots(draw, page, total, y=None, active=BLUE, inactive=(209, 213, 219), text_color=MUTED):
    y = y or H - 90
    for i in range(total):
        cx = W / 2 - (total - 1) * 32 / 2 + i * 32
        color = active if i == page - 1 else inactive
        draw.ellipse([cx - 16, y, cx + 16, y + 32], fill=color)
    draw.text(
        (W - 80, y + 16), f"{page}/{total}", font=kr(30, bold=False), fill=text_color, anchor="rm"
    )


def save_set(name: str, slides: list[Image.Image]):
    paths = []
    for i, im in enumerate(slides, 1):
        p = f"{OUT}/{name}_{i}.png"
        im.save(p)
        paths.append(p)
    sheet = Image.new("RGB", (1100 * len(slides), H), WHITE)
    for i, p in enumerate(paths):
        sheet.paste(Image.open(p), (20 + i * 1100, 0))
    sheet.save(f"{OUT}/{name}_sheet.png")
    return paths
