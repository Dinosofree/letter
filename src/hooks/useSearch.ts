"use client";

import { useState } from "react";
import type { SearchResult } from "@/types";

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results);
      setSynthesis(data.synthesis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
    setSynthesis(null);
    setError(null);
    setHasSearched(false);
  };

  return { results, synthesis, loading, error, hasSearched, search, clear };
}
