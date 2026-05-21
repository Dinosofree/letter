import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm",
        variant === "primary" &&
          "bg-warm-700 text-cream-100 hover:bg-warm-700/90",
        variant === "secondary" &&
          "bg-white border border-cream-300 text-warm-700 hover:bg-cream-50",
        variant === "ghost" &&
          "text-warm-500 hover:text-warm-700 hover:bg-cream-200",
        variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-600",
        className
      )}
      {...props}
    />
  );
}
