"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "프롬프트 복사하기",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API가 막힌 환경(비 HTTPS 등) 대비
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-3 text-sm font-medium text-primary hover:text-primary-dark transition"
    >
      {copied ? "복사됐습니다" : label}
    </button>
  );
}
