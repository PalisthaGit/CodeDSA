import type { VisualizerItem } from "@/types";
import { cn } from "@/lib/utils";

interface VisualizerSidebarProps {
  items: VisualizerItem[];
}

export function VisualizerSidebar({ items }: VisualizerSidebarProps) {
  return (
    <div className="rounded-card border border-purple-border bg-purple-light p-4">
      <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">
        State
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center justify-between rounded-notebook px-3 py-1.5 text-sm transition-colors",
              item.active && "bg-blue-light border border-blue-border",
              item.highlighted && "bg-yellow-light border border-yellow-border",
              !item.active && !item.highlighted && "bg-background border border-text-muted/20"
            )}
          >
            <span className="text-text-primary">{item.label}</span>
            <span className="text-text-secondary">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
