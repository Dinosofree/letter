import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PLATFORM_LABELS } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";
import type { Language } from "@/types";

interface TimelineCardProps {
  id: string;
  date: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  title: string | null;
  tags: string[];
  content?: string;
  similarity?: number;
}

export function TimelineCard({
  id,
  date,
  platform,
  sender,
  receiver,
  language,
  title,
  tags,
  content,
}: TimelineCardProps) {
  return (
    <Link
      href={`/letters/${id}`}
      className="block bg-white border border-cream-200 rounded-lg p-5
                 hover:border-cream-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-warm-400 mb-2">
            <span>{formatDate(date)}</span>
            <span>·</span>
            <Badge variant="accent">
              {PLATFORM_LABELS[platform] || platform}
            </Badge>
          </div>

          {title && (
            <h3 className="text-sm font-medium text-warm-700 mb-1 truncate">
              {title}
            </h3>
          )}

          <div className="text-xs text-warm-500 mb-2">
            {sender && <span>{sender}</span>}
            {sender && receiver && <span> → </span>}
            {receiver && <span>{receiver}</span>}
            {!sender && !receiver && (
              <span>{language === "zh" ? "中文" : language === "en" ? "English" : "中英混合"}</span>
            )}
          </div>

          {content && (
            <p className="text-sm text-warm-500 leading-relaxed line-clamp-2">
              {truncate(content, 200)}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-warm-300">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <svg
          className="w-4 h-4 text-cream-300 flex-shrink-0 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
