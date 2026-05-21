import { TimelineCard } from "./TimelineCard";
import { formatMonthLabel } from "@/lib/utils";
import type { LetterListItem } from "@/types";

interface TimelineGroupProps {
  monthKey: string;
  letters: LetterListItem[];
}

export function TimelineGroup({ monthKey, letters }: TimelineGroupProps) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-medium text-warm-400 mb-4 px-1 tracking-wide">
        {formatMonthLabel(monthKey)}
      </h2>
      <div className="space-y-3">
        {letters.map((letter) => (
          <TimelineCard
            key={letter.id}
            id={letter.id}
            date={letter.date}
            platform={letter.platform}
            sender={letter.sender}
            receiver={letter.receiver}
            language={letter.language}
            title={letter.title}
            tags={letter.tags}
          />
        ))}
      </div>
    </div>
  );
}
