"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SearchPage() {
  const { results, synthesis, loading, error, hasSearched, search } = useSearch();
  const [query, setQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [memoryDoc, setMemoryDoc] = useState<{ content: string; format: string } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMemoryDoc(null);
    search(query);
  };

  const handleGenerateDoc = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/memory-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), format: "markdown" }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setMemoryDoc(data);
    } catch {
      toast.error("生成失败");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (content: string, format: string) => {
    const ext = format === "markdown" ? "md" : "txt";
    const mime = format === "markdown" ? "text/markdown" : "text/plain";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memory-${query.slice(0, 20)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("已下载");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-warm-700 mb-6">检索</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='自然语言搜索 · 中英文 · 情感 · 主题...'
            className="flex-1 px-4 py-2.5 bg-white border border-cream-300 rounded-xl
                       text-warm-700 placeholder-warm-300 focus:outline-none focus:border-accent
                       text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-warm-700 text-cream-100 rounded-xl text-sm font-medium
                       hover:bg-warm-700/90 disabled:opacity-50 transition-colors"
          >
            {loading ? <LoadingSpinner className="h-4 w-4" /> : "搜索"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>
      )}

      {!hasSearched && (
        <EmptyState
          title="用自然语言搜索你的记忆库"
          description="试试: 「去年夏天关于自由的内容」「我和 Anna 的通信」「When did I first mention Europe」"
        />
      )}

      {hasSearched && loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <LoadingSpinner className="h-5 w-5" />
          <span className="text-sm text-warm-400">检索中...</span>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <EmptyState
          title="没有找到相关内容"
          description="尝试用不同的表达方式重新搜索"
        />
      )}

      {results.length > 0 && (
        <>
          {/* AI synthesis */}
          {synthesis && (
            <div className="bg-white border border-cream-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-warm-500">AI 综合分析</h2>
                <span className="text-xs text-warm-300">{results.length} 封相关信件</span>
              </div>
              <div className="text-sm text-warm-700 whitespace-pre-wrap leading-relaxed">
                {synthesis}
              </div>
            </div>
          )}

          {/* Memory doc generation */}
          <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mb-8">
            <p className="text-xs text-warm-400 mb-3">
              生成记忆文档 — 将搜索结果整理为可导出的长期记忆档案
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleGenerateDoc} disabled={generating}>
                {generating ? (
                  <>
                    <LoadingSpinner className="h-3.5 w-3.5 mr-1.5" />
                    生成中...
                  </>
                ) : (
                  "生成记忆文档"
                )}
              </Button>
              {memoryDoc && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(memoryDoc.content, memoryDoc.format)}
                >
                  下载 .{memoryDoc.format === "markdown" ? "md" : "txt"}
                </Button>
              )}
            </div>
          </div>

          {/* Memory doc preview */}
          {memoryDoc && (
            <div className="bg-white border border-accent/20 rounded-xl p-5 mb-8 max-h-96 overflow-y-auto">
              <div className="prose prose-sm text-warm-700 whitespace-pre-wrap font-serif leading-relaxed">
                {memoryDoc.content.slice(0, 2000)}
                {memoryDoc.content.length > 2000 && (
                  <p className="text-warm-300 text-xs mt-2">
                    ... 完整内容请下载查看
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Search results */}
          <div className="space-y-3">
            {results.map((r) => (
              <TimelineCard
                key={r.id}
                id={r.id}
                date={r.date}
                platform={r.platform}
                sender={r.sender}
                receiver={r.receiver}
                language={r.language}
                title={r.title}
                tags={r.tags}
                content={r.content}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
