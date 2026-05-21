import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ className, label, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm text-warm-500">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full px-4 py-3 bg-white border border-cream-300 rounded-lg",
          "text-warm-700 placeholder-warm-300 resize-y min-h-[100px]",
          "focus:outline-none focus:border-accent transition-colors",
          "disabled:bg-cream-100 disabled:text-warm-300",
          className
        )}
        {...props}
      />
    </div>
  );
}
