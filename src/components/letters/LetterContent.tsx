interface LetterContentProps {
  content: string;
}

export function LetterContent({ content }: LetterContentProps) {
  return (
    <div className="letter-content whitespace-pre-wrap break-words">
      {content}
    </div>
  );
}
