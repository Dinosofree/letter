"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ErrorMessage message="加载出错" onRetry={reset} />
    </div>
  );
}
