import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors rounded-notebook",
        variant === "primary" && "bg-pink-light text-text-primary border border-pink-border hover:bg-pink-border",
        variant === "secondary" && "bg-blue-light text-text-primary border border-blue-border hover:bg-blue-border",
        variant === "ghost" && "text-text-secondary hover:text-text-primary hover:bg-pink-section",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
