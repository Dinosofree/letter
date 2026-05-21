"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LetterForm } from "@/components/letters/LetterForm";
import toast from "react-hot-toast";
import type { LetterFormData } from "@/types";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      toast.success("信件已保存");
      router.push(`/letters/${result.letter.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-warm-700 mb-8">导入信件</h1>
      <LetterForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
