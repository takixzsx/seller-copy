import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "셀러카피 — AI 마케팅 카피 생성기",
    template: "%s | 셀러카피",
  },
  description:
    "스마트스토어, 쿠팡, 11번가 셀러를 위한 AI 마케팅 카피 생성기. 상세페이지 카피, 블로그 리뷰, 인스타 캡션을 원클릭으로.",
  keywords: [
    "이커머스",
    "마케팅 카피",
    "AI 카피라이팅",
    "스마트스토어",
    "쿠팡",
    "상세페이지",
    "셀러카피",
    "상품 카피",
    "네이버 SEO",
  ],
  openGraph: {
    title: "셀러카피 — AI 마케팅 카피 생성기",
    description:
      "상품 정보만 넣으면 상세페이지 카피, 블로그 리뷰, 인스타 캡션이 완성됩니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "셀러카피 — AI 마케팅 카피 생성기",
    description:
      "상품 정보만 넣으면 상세페이지 카피, 블로그 리뷰, 인스타 캡션이 완성됩니다.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
