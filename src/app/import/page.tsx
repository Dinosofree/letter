"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LetterForm } from "@/components/letters/LetterForm";
import toast from "react-hot-toast";
import type { LetterFormData, Language } from "@/types";

function ImportContent() {
  const [loading, setLoading] = useState(false);
  const [sharedText, setSharedText] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shared = searchParams.get("shared");
    if (shared) {
      setSharedText(decodeURIComponent(shared));
    }
  }, [searchParams]);

  const handleSubmit = async (data: LetterFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      const result = await res.json();
      toast.success("已保存到记忆库");
      router.push(`/letters/${result.letter.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setLoading(false);
    }
  };

  // Detect language from text
  const detectLanguage = (text: string): Language => {
    const hasChinese = /[一-鿿㐀-䶿]/.test(text);
    const hasEnglish = /[a-zA-Z]{3,}/.test(text);
    if (hasChinese && hasEnglish) return "mixed";
    if (hasChinese) return "zh";
    return "en";
  };

  // Detect platform from shared content URL
  const detectPlatform = (text: string): string => {
    if (text.includes("slowly")) return "slowly";
    if (text.includes("gmail") || text.includes("mail.google")) return "gmail";
    if (text.includes("weixin") || text.includes("wechat")) return "wechat";
    return "notes";
  };

  const prefillDate = new Date().toISOString().split("T")[0];
  const prefillLang = sharedText ? detectLanguage(sharedText) : "zh";
  const prefillPlatform = sharedText ? detectPlatform(sharedText) : "notes";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {sharedText && (
        <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-warm-500 mb-2">
            📨 已接收分享内容 ({sharedText.length} 字)
          </p>
          <div className="max-h-32 overflow-y-auto text-sm text-warm-400 whitespace-pre-wrap font-serif">
            {sharedText.slice(0, 300)}
            {sharedText.length > 300 && "..."}
          </div>
        </div>
      )}

      <h1 className="text-xl font-semibold text-warm-700 mb-2">导入信件</h1>
      <p className="text-sm text-warm-400 mb-8">
        通过分享、粘贴或 Gmail 导入你的通信记录
      </p>

      <LetterForm
        initial={
          sharedText
            ? {
                date: prefillDate,
                platform: prefillPlatform,
                language: prefillLang,
                content: sharedText,
                tags: [],
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default function ImportPage() {
  return (
    <Suspense>
      <ImportContent />
    </Suspense>
  );
}
