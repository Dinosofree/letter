import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-cream-200 text-warm-500",
        variant === "accent" &&
          "bg-accent/10 text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
