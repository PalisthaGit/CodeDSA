"use client";

import { useState, useEffect } from "react";
import type { TOCItem } from "@/types";
import { cn } from "@/lib/utils";

interface TOCSidebarProps {
  items: TOCItem[];
}

export function TOCSidebar({ items }: TOCSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-20">
      <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">
        On this page
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors hover:text-text-primary",
                activeId === item.id
                  ? "text-text-primary font-medium"
                  : "text-text-secondary"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
