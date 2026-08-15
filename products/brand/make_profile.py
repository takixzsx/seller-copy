"""인스타 프로필 이미지 생성.

프로필은 원형으로 잘리므로 중앙 원 안에만 요소를 배치한다.
- 정렬은 anchor="mm"으로 폰트 베어링 영향을 없앤다.
- 요즘 브랜드 로고 트렌드에 맞춰 굵은 웨이트 + 좁은 자간(트래킹)을 쓴다.
"""

from PIL import Image, ImageDraw, ImageFont

SIZE = 1080
C = SIZE // 2
BLUE = (37, 99, 235)
INK = (17, 17, 17)
LIGHT = (191, 219, 254)
WHITE = (255, 255, 255)
KR = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
EN = "/System/Library/Fonts/HelveticaNeue.ttc"
OUT = "/Users/min/seller-copy/products/brand"

KR_BOLD = 6  # 0=Regular 2=Medium 4=SemiBold 6=Bold


def kr(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(KR, size, index=KR_BOLD)


def en(size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(EN, size, index=index)


def tracked(draw, cx, cy, text, f, fill, tracking=0):
    """자간(tracking)을 적용해 가로 중앙 정렬로 그린다. 음수면 좁아진다."""
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x + w / 2, cy), ch, font=f, fill=fill, anchor="mm")
        x += w + tracking


def variant_a() -> Image.Image:
    """국문 2줄 · Bold · 좁은 자간. 가장 무난하고 눈에 띈다."""
    img = Image.new("RGB", (SIZE, SIZE), BLUE)
    d = ImageDraw.Draw(img)
    f = kr(255)
    tracked(d, C, C - 135, "셀러", f, WHITE, tracking=-14)
    tracked(d, C, C + 135, "카피", f, WHITE, tracking=-14)
    return img


def variant_b() -> Image.Image:
    """옅은 배경 · 잉크블랙 국문 + 파란 점.
    순백이면 인스타 흰 UI에서 경계가 사라지므로 아주 옅은 회색을 쓴다."""
    img = Image.new("RGB", (SIZE, SIZE), (243, 244, 246))
    d = ImageDraw.Draw(img)
    f = kr(235)
    tracked(d, C, C - 120, "셀러", f, INK, tracking=-12)
    tracked(d, C, C + 120, "카피", f, INK, tracking=-12)
    d.ellipse([C + 205, C + 178, C + 265, C + 238], fill=BLUE)
    return img


def variant_c() -> Image.Image:
    """영문 소문자 워드마크. 프로필은 작게 보이므로 최대한 크게."""
    img = Image.new("RGB", (SIZE, SIZE), INK)
    d = ImageDraw.Draw(img)
    tracked(d, C, C - 105, "seller", en(215, 0), WHITE, tracking=-10)
    tracked(d, C, C + 115, "copy", en(215, 0), BLUE, tracking=-10)
    return img


def variant_d() -> Image.Image:
    """모노그램. 아주 작게 줄여도 안 뭉개진다."""
    img = Image.new("RGB", (SIZE, SIZE), BLUE)
    d = ImageDraw.Draw(img)
    tracked(d, C, C + 10, "sc", en(500, 0), WHITE, tracking=-30)
    return img


if __name__ == "__main__":
    for name, fn in [("a", variant_a), ("b", variant_b), ("c", variant_c), ("d", variant_d)]:
        im = fn()
        im.save(f"{OUT}/profile_{name}.png")
        mask = Image.new("L", (SIZE, SIZE), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, SIZE, SIZE], fill=255)
        prev = Image.new("RGB", (SIZE, SIZE), (240, 240, 240))
        prev.paste(im, (0, 0), mask)
        prev.save(f"{OUT}/preview_circle_{name}.png")
    print("saved")
