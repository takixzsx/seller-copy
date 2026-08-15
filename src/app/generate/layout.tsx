import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카피 생성하기",
  description:
    "상품 정보를 입력하면 AI가 상세페이지 카피, 블로그 리뷰, 인스타 캡션을 자동 생성합니다.",
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
