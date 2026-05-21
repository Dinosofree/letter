"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ANALYSIS_TYPES } from "@/lib/constants";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { AnalysisType } from "@/types";

interface AnalysisPanelProps {
  letterId: string;
  existingAnalyses: { analysis_type: string; content: string }[];
}

export function AnalysisPanel({ letterId, existingAnalyses }: AnalysisPanelProps) {
  const { analysis, loading, error, runAnalysis } = useAnalysis(letterId);
  const [selectedType, setSelectedType] = useState<AnalysisType>("emotional_tone");

  const existingCache = existingAnalyses.find((a) => a.analysis_type === selectedType);
  const displayContent = analysis?.content ?? existingCache?.content ?? null;
  const isCached = !!existingCache && !analysis;

  return (
    <div className="border-t border-cream-200 pt-8 mt-8">
      <h3 className="text-sm font-medium text-warm-500 mb-4">AI 分析</h3>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as AnalysisType)}
          className="px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm
                     text-warm-700 focus:outline-none focus:border-accent appearance-none"
        >
          {ANALYSIS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => runAnalysis(selectedType)}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner className="h-4 w-4 mr-2" />
              分析中...
            </>
          ) : existingCache ? (
            "重新分析"
          ) : (
            "分析"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      {isCached && (
        <p className="text-xs text-warm-300 mb-3">来自之前的分析</p>
      )}

      {displayContent && (
        <div className="bg-white border border-cream-200 rounded-lg p-5">
          <div className="text-sm text-warm-700 whitespace-pre-wrap leading-relaxed">
            {displayContent}
          </div>
        </div>
      )}

      {!displayContent && !loading && !error && (
        <p className="text-sm text-warm-300">
          选择分析类型, 点击"分析"按钮
        </p>
      )}
    </div>
  );
}
