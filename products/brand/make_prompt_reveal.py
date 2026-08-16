"""게시물 4 — 프롬프트 공개 + 댓글 CTA (3장, 1080x1350).

인용 프롬프트는 products/prompt-pack/README.md의 1-1 항목을 그대로 옮김
(지어낸 예시 아님, 실제 pack에 있는 프롬프트).

3번 슬라이드는 클릭웨이브 벤치마크에서 차용한 "댓글 유도형 CTA" —
댓글 수가 알고리즘 노출에 크게 작용하고, 지금 저희 퍼널의 병목이
"조회는 되는데 프로필 방문이 적다"는 것이었으므로 그 지점을 정면으로 겨냥.
DM은 자동화가 없어 수동 발송 필요 — dm_template.txt 참고.
"""

from PIL import Image, ImageDraw
from brand_kit import W, H, BLUE, LIGHT_BLUE, INK, MUTED, BG, WHITE, kr, chip, wrap_by_width, takeaway_bar, page_dots, save_set


def slide_1() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    chip(d, 80, 90, "프롬프트 공개", kr(34))

    title_f = kr(80)
    for i, line in enumerate(["제가 실제로 쓰는", "상세페이지 프롬프트", "그냥 가져가세요"]):
        d.text((80, 300 + i * 104), line, font=title_f, fill=INK, anchor="lm")

    d.text(
        (80, 660),
        "복사해서 빈칸만 채우면 됩니다",
        font=kr(38, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    takeaway_bar(d, 1010, "8개 중 1개만 먼저 보여드릴게요", bg=BLUE, fg=WHITE)
    page_dots(d, 1, 3)
    return img


def label_chip(d, x, y, text):
    f = kr(30)
    pad_x, pad_y = 16, 8
    tw = d.textlength(text, font=f)
    th = f.size
    d.rounded_rectangle([x, y, x + tw + pad_x * 2, y + th + pad_y * 2], radius=10, fill=BLUE)
    d.text((x + pad_x, y + pad_y + th / 2), text, font=f, fill=WHITE, anchor="lm")
    return th + pad_y * 2


def slide_2() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    d.text((80, 90), "상세페이지 본문 프롬프트", font=kr(50), fill=INK, anchor="lm")

    card_y = 200
    d.rounded_rectangle([80, card_y, W - 80, H - 130], radius=28, fill=WHITE)

    pad = 56
    x = 80 + pad
    y = card_y + 50
    body_f = kr(32, bold=False)
    line_h = 46
    max_w = (W - 160) - pad * 2

    def write_para(label, text, y):
        y += label_chip(d, x, y, label) + 16
        for line in wrap_by_width(d, text, body_f, max_w):
            d.text((x, y), line, font=body_f, fill=INK, anchor="lm")
            y += line_h
        return y + 28

    y = write_para("역할", "스마트스토어 상세페이지를 10년간 써온 이커머스 카피라이터", y)
    y = write_para("입력", "상품명 · 카테고리 · 핵심특징 3~5개 · 타겟 고객", y)
    y += label_chip(d, x, y, "요청") + 16
    for line in [
        "4단락으로 작성",
        "1단락 타겟이 겪는 구체적 불편",
        "2단락 이 상품이 어떻게 해결하는지",
        "3단락 내가 준 특징으로 뒷받침",
        "4단락 지금 사야 할 이유",
    ]:
        d.text((x, y), line, font=body_f, fill=INK, anchor="lm")
        y += line_h
    y += 28
    y = write_para("제약", "내가 준 특징 외의 기능을 추가하지 마세요", y)

    page_dots(d, 2, 3)
    return img


def slide_3() -> Image.Image:
    img = Image.new("RGB", (W, H), BLUE)
    d = ImageDraw.Draw(img)

    chip(d, 80, 90, "댓글 이벤트", kr(34), bg=WHITE, fg=BLUE)

    title_f = kr(72)
    for i, line in enumerate(['댓글에 "프롬프트"', "남기면", "나머지 7개", "DM으로 드려요"]):
        d.text((80, 260 + i * 100), line, font=title_f, fill=WHITE, anchor="lm")

    d.text(
        (80, 700),
        "무료 · 회원가입 없음",
        font=kr(36, bold=False),
        fill=LIGHT_BLUE,
        anchor="lm",
    )

    takeaway_bar(d, 1010, "상세페이지 · 블로그 · 인스타 · 광고까지 8개", bg=WHITE, fg=BLUE)
    page_dots(d, 3, 3, active=WHITE, inactive=(59, 130, 246), text_color=WHITE)
    return img


if __name__ == "__main__":
    save_set("promptreveal", [slide_1(), slide_2(), slide_3()])
    print("saved")
