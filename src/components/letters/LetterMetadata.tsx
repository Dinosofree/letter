import { Badge } from "@/components/ui/Badge";
import { PLATFORM_LABELS, LANGUAGES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Language } from "@/types";

interface LetterMetadataProps {
  date: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  tags: string[];
}

export function LetterMetadata({
  date,
  platform,
  sender,
  receiver,
  language,
  tags,
}: LetterMetadataProps) {
  const langLabel = LANGUAGES.find((l) => l.value === language)?.label ?? language;

  return (
    <div className="space-y-3">
      <div className="text-2xl font-medium text-warm-700">
        {formatDate(date)}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="accent">{PLATFORM_LABELS[platform] || platform}</Badge>
        <Badge>{langLabel}</Badge>
        {sender && (
          <span className="text-warm-500">
            {sender}
            {receiver && " → "}
          </span>
        )}
        {receiver && <span className="text-warm-500">{receiver}</span>}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
