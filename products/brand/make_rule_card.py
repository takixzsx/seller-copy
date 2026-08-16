"""게시물 2 — 규칙 카드 캐러셀 (2장, 1080x1350 세로형)."""

from PIL import Image, ImageDraw
from brand_kit import (
    W, H, BLUE, LIGHT_BLUE, INK, MUTED, BG, WHITE,
    kr, tracked, chip, takeaway_bar, page_dots, save_set,
)


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

    d.text(
        (80, y + 50),
        "안 붙이면 AI가 수치를 지어냅니다",
        font=kr(38, bold=False),
        fill=MUTED,
        anchor="lm",
    )

    takeaway_bar(d, 1010, "이 4줄, 상세페이지 허위광고를 막아줍니다", bg=BLUE, fg=WHITE)
    page_dots(d, 1, 2)
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

    y = 250
    num_f = kr(56)
    line_f = kr(40)
    for num, l1, l2 in rules:
        d.rounded_rectangle([80, y, 168, y + 88], radius=20, fill=WHITE)
        d.text((124, y + 44), num, font=num_f, fill=BLUE, anchor="mm")
        d.text((196, y + 20), l1, font=line_f, fill=WHITE, anchor="lm")
        d.text((196, y + 66), l2, font=line_f, fill=LIGHT_BLUE, anchor="lm")
        y += 126

    takeaway_bar(d, y + 30, "4개 톤 6회 재검증, 수치 왜곡 0건", bg=WHITE, fg=BLUE)
    page_dots(d, 2, 2, active=WHITE, inactive=(59, 130, 246), text_color=WHITE)
    return img


if __name__ == "__main__":
    save_set("rulecard", [slide_1(), slide_2()])
    print("saved")
