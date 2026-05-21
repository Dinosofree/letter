import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-warm-500">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg",
          "text-warm-700 placeholder-warm-300",
          "focus:outline-none focus:border-accent transition-colors",
          "disabled:bg-cream-100 disabled:text-warm-300",
          className
        )}
        {...props}
      />
    </div>
  );
}
