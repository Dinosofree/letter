import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({
  className,
  label,
  id,
  options,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm text-warm-500">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg",
          "text-warm-700 focus:outline-none focus:border-accent transition-colors",
          "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%234A4238%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
