"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LetterMetadata } from "@/components/letters/LetterMetadata";
import { LetterContent } from "@/components/letters/LetterContent";
import { LetterForm } from "@/components/letters/LetterForm";
import { AnalysisPanel } from "@/components/letters/AnalysisPanel";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useLetter } from "@/hooks/useLetters";
import toast from "react-hot-toast";
import type { LetterFormData } from "@/types";

export default function LetterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { letter, loading, error } = useLetter(id);
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [analyses, setAnalyses] = useState<{ analysis_type: string; content: string }[]>([]);

  // Load analyses
  useEffect(() => {
    if (id) {
      fetch(`/api/letters/${id}`)
        .then((res) => res.json())
        .then((data) => setAnalyses(data.analyses || []))
        .catch(() => {});
    }
  }, [id]);

  if (loading) return <PageSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => router.refresh()} />;
  if (!letter) return <ErrorMessage message="信件不存在" />;

  const handleUpdate = async (data: LetterFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("已更新");
      setEditing(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "更新失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/letters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("已删除");
      router.push("/");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-warm-700">编辑信件</h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            取消
          </Button>
        </div>
        <LetterForm
          initial={{
            date: letter.date,
            platform: letter.platform,
            sender: letter.sender,
            receiver: letter.receiver,
            language: letter.language,
            title: letter.title || "",
            content: letter.content,
            tags: letter.tags,
          }}
          onSubmit={handleUpdate}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-warm-400 hover:text-warm-700 transition-colors"
        >
          ← 返回
        </button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDelete(!showDelete)}
          >
            删除
          </Button>
        </div>
      </div>

      {showDelete && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600 mb-3">确定删除这封信件? 此操作不可逆。</p>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              确定删除
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDelete(false)}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      <LetterMetadata
        date={letter.date}
        platform={letter.platform}
        sender={letter.sender}
        receiver={letter.receiver}
        language={letter.language}
        tags={letter.tags}
      />

      {letter.title && (
        <h2 className="text-lg font-medium text-warm-700 mt-6 mb-4">
          {letter.title}
        </h2>
      )}

      <div className="mt-8">
        <LetterContent content={letter.content} />
      </div>

      <AnalysisPanel letterId={id} existingAnalyses={analyses} />
    </div>
  );
}
