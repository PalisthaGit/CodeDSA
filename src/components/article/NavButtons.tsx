import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavButtonsProps {
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
}

export function NavButtons({ prevSlug, prevTitle, nextSlug, nextTitle }: NavButtonsProps) {
  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-pink-border pt-8">
      {prevSlug ? (
        <Link
          href={`/articles/${prevSlug}`}
          className="flex flex-col items-start rounded-notebook border border-pink-border bg-pink-section px-4 py-3 text-sm transition-colors hover:bg-pink-light"
        >
          <span className="text-xs text-text-muted">← Previous</span>
          <span className="mt-1 text-text-primary">{prevTitle}</span>
        </Link>
      ) : (
        <div />
      )}

      {nextSlug ? (
        <Link
          href={`/articles/${nextSlug}`}
          className={cn(
            "flex flex-col items-end rounded-notebook border border-blue-border bg-blue-section px-4 py-3 text-sm transition-colors hover:bg-blue-light",
            !prevSlug && "ml-auto"
          )}
        >
          <span className="text-xs text-text-muted">Next →</span>
          <span className="mt-1 text-text-primary">{nextTitle}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
