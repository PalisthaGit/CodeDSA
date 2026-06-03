import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  color?: "pink" | "blue" | "purple" | "yellow" | "green";
  className?: string;
}

const colorMap = {
  pink: "bg-pink-light border-pink-border text-text-primary",
  blue: "bg-blue-light border-blue-border text-text-primary",
  purple: "bg-purple-light border-purple-border text-purple-text",
  yellow: "bg-yellow-light border-yellow-border text-yellow-text",
  green: "bg-green-light border-green-border text-text-primary",
};

export function Pill({ label, color = "pink", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-sm border rounded-full",
        colorMap[color],
        className
      )}
    >
      {label}
    </span>
  );
}
