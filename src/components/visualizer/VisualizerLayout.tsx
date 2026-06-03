import { VisualizerSidebar } from "./VisualizerSidebar";
import type { VisualizerItem } from "@/types";

interface VisualizerLayoutProps {
  title: string;
  items: VisualizerItem[];
  controls?: React.ReactNode;
  children: React.ReactNode;
}

export function VisualizerLayout({
  title,
  items,
  controls,
  children,
}: VisualizerLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="mb-6 text-2xl text-text-primary">{title}</h2>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-card border border-blue-border bg-blue-section p-6">
            {children}
          </div>
          {controls && <div className="mt-4">{controls}</div>}
        </div>
        <aside className="w-full lg:w-64 shrink-0">
          <VisualizerSidebar items={items} />
        </aside>
      </div>
    </div>
  );
}
