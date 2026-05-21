"use client";

import { useCallback, useEffect, useState } from "react";
import type { Letter, LetterListItem } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";

export function useLetters() {
  const [letters, setLetters] = useState<LetterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchLetters = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/letters?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (pageNum === 1) {
        setLetters(data.letters);
      } else {
        setLetters((prev) => [...prev, ...data.letters]);
      }
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load letters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetters(1);
  }, [fetchLetters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchLetters(page + 1);
    }
  }, [loading, hasMore, page, fetchLetters]);

  return { letters, loading, error, hasMore, loadMore, refetch: () => fetchLetters(1) };
}

export function useLetter(id: string | null) {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`/api/letters/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setLetter(data.letter))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load letter"))
      .finally(() => setLoading(false));
  }, [id]);

  return { letter, loading, error };
}
