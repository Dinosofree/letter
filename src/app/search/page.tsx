"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SearchPage() {
  const { results, synthesis, loading, error, hasSearched, search } = useSearch();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
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
            placeholder='例如: "我第一次提到欧洲是什么时候"'
            className="flex-1 px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                       text-warm-700 placeholder-warm-300 focus:outline-none focus:border-accent
                       text-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-warm-700 text-cream-100 rounded-lg text-sm font-medium
                       hover:bg-warm-700/90 disabled:opacity-50 transition-colors"
          >
            {loading ? <LoadingSpinner className="h-4 w-4" /> : "搜索"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg mb-6">
          {error}
        </p>
      )}

      {!hasSearched && (
        <EmptyState
          title="输入关键词开始检索"
          description="使用自然语言搜索你的信件档案, AI 会理解语义并找到相关内容"
        />
      )}

      {hasSearched && loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner className="h-6 w-6" />
          <span className="ml-3 text-sm text-warm-400">检索中...</span>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <EmptyState title="没有找到相关信件" description="尝试换一个关键词或更宽泛的表达" />
      )}

      {results.length > 0 && (
        <>
          {synthesis && (
            <div className="bg-white border border-cream-200 rounded-lg p-5 mb-8">
              <h2 className="text-sm font-medium text-warm-500 mb-3">AI 综合分析</h2>
              <div className="text-sm text-warm-700 whitespace-pre-wrap leading-relaxed">
                {synthesis}
              </div>
            </div>
          )}

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
