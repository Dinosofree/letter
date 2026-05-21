"use client";

import { TimelineGroup } from "./TimelineGroup";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { groupByMonth } from "@/lib/utils";
import { useLetters } from "@/hooks/useLetters";
import Link from "next/link";

export function Timeline() {
  const { letters, loading, error, hasMore, loadMore } = useLetters();

  if (loading) return <PageSpinner />;

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (letters.length === 0) {
    return (
      <EmptyState
        title="还没有信件"
        description="开始导入你的第一封信件，建立个人通信档案"
        action={
          <Link href="/import">
            <Button>导入信件</Button>
          </Link>
        }
      />
    );
  }

  const groups = groupByMonth(letters);

  return (
    <div>
      {Array.from(groups.entries()).map(([monthKey, monthLetters]) => (
        <TimelineGroup key={monthKey} monthKey={monthKey} letters={monthLetters} />
      ))}

      {hasMore && (
        <div className="flex justify-center py-8">
          <Button variant="ghost" onClick={loadMore}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  );
}
