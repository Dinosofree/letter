"use client";

import { useState } from "react";
import type { Analysis, AnalysisType } from "@/types";

export function useAnalysis(letterId: string) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (type: AnalysisType) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/letters/${letterId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_type: type }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setAnalysis(null);
    setError(null);
  };

  return { analysis, loading, error, runAnalysis, clear };
}
